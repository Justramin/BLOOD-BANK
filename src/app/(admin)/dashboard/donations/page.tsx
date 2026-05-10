'use client'

import React, { useEffect, useState } from 'react'
import { 
  Search, 
  Filter, 
  FileDown, 
  Calendar,
  ChevronRight,
  Droplet,
  ShieldCheck,
  Heart,
  Hospital,
  User,
  Phone,
  Building2,
  MapPin,
  XCircle,
  MoreVertical,
  Activity
} from 'lucide-react'
import { donationService } from '@/services/donationService'
import { committeeService } from '@/services/committeeService'
import { Donation, Committee } from '@/types'
import { BLOOD_GROUPS } from '@/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { exportDonationsToExcel, exportDonationsToPDF } from '@/utils/exportUtils'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'

export default function DonationRecordsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [committees, setCommittees] = useState<Committee[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [search, setSearch] = useState('')
  const [filterCommittee, setFilterCommittee] = useState('all')
  const [filterBlood, setFilterBlood] = useState('all')

  const loadData = async () => {
    try {
      const [donationsData, committeesData] = await Promise.all([
        donationService.getAll(),
        committeeService.getAll()
      ])
      setDonations(donationsData)
      setCommittees(committeesData)
    } catch (error) {
      toast.error('Failed to load donation records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredDonations = donations.filter(d => {
    const donor = d.donor
    if (!donor) return false

    const matchesSearch = donor.name.toLowerCase().includes(search.toLowerCase()) || 
                         donor.phone.includes(search) ||
                         d.hospital_name.toLowerCase().includes(search.toLowerCase())
    
    const matchesCommittee = filterCommittee === 'all' || donor.committee_id === filterCommittee
    const matchesBlood = filterBlood === 'all' || donor.blood_group === filterBlood
    
    return matchesSearch && matchesCommittee && matchesBlood
  })

  return (
    <div className="space-y-10 p-4 md:p-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <Heart className="w-3 h-3" />
            Humanitarian Records
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Donation <span className="text-primary italic">History</span></h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{filteredDonations.length} Donation Entries found</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-2 bg-white" />}>
              <FileDown className="w-4 h-4 mr-2" />
              Export Records
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px]">
              <DropdownMenuItem onClick={() => exportDonationsToExcel(filteredDonations, 'donation_records')} className="rounded-xl py-3 font-bold cursor-pointer">
                <ChevronRight className="w-4 h-4 mr-2 text-primary" />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportDonationsToPDF(filteredDonations, 'donation_records')} className="rounded-xl py-3 font-bold cursor-pointer">
                <ChevronRight className="w-4 h-4 mr-2 text-primary" />
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-none premium-shadow rounded-[2rem] overflow-hidden bg-white">
        <div className="p-6 md:p-8 flex flex-col lg:flex-row items-center gap-6">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by donor name, phone or hospital..." 
              className="pl-12 h-14 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-[1.25rem] font-bold text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <Select value={filterCommittee} onValueChange={(v) => v && setFilterCommittee(v)}>
              <SelectTrigger className="w-[180px] h-14 bg-slate-50 border-none rounded-[1.25rem] font-black text-xs uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="Committee">
                    {filterCommittee === 'all' ? 'Committee' : committees.find(c => c.id === filterCommittee)?.name}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2 min-w-[200px]">
                <SelectItem value="all" className="rounded-xl font-bold py-3">All Committees</SelectItem>
                {committees.map(m => <SelectItem key={m.id} value={m.id} className="rounded-xl font-bold py-3">{m.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterBlood} onValueChange={(v) => v && setFilterBlood(v)}>
              <SelectTrigger className="w-[140px] h-14 bg-slate-50 border-none rounded-[1.25rem] font-black text-xs uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="Blood" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2">
                <SelectItem value="all" className="rounded-xl font-bold py-3">All Groups</SelectItem>
                {BLOOD_GROUPS.map(g => <SelectItem key={g} value={g} className="rounded-xl font-bold py-3">{g}</SelectItem>)}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              className="h-14 w-14 rounded-[1.25rem] border-2 flex items-center justify-center p-0"
              onClick={() => {
                setSearch('')
                setFilterCommittee('all')
                setFilterBlood('all')
              }}
            >
              <XCircle className="w-6 h-6 text-slate-400" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Donation Grid */}
      <div className="relative">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredDonations.map((record, idx) => (
                <motion.div
                  key={record.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Card className="group border-none premium-shadow hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <div className="p-8 pb-6 bg-slate-950 text-white flex justify-between items-start">
                        <div className="flex gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary font-black text-xl backdrop-blur-md">
                            {record.donor?.blood_group}
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="text-lg font-black tracking-tight line-clamp-1">{record.donor?.name}</h3>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              <Calendar className="w-3 h-3 text-primary" />
                              {record.donation_date ? format(new Date(record.donation_date), 'dd MMM yyyy') : 'Date N/A'}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-primary/20 text-primary border-none rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                          ENTRY
                        </Badge>
                      </div>
                      
                      <div className="p-8 space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                              <Hospital className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Hospital</span>
                              <span className="text-sm font-bold text-slate-900 truncate">{record.hospital_name || 'Not Specified'}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Committee</span>
                              <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-primary" />
                                <span className="truncate">{(record.donor as any)?.committees?.name}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 border-l border-slate-100 pl-4">
                              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Unit</span>
                              <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                <Building2 className="w-3 h-3 text-primary" />
                                <span className="truncate">{(record.donor as any)?.units?.name}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-primary" />
                              <span className="text-sm font-black text-slate-900">{record.donor?.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {!loading && filteredDonations.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[3rem] premium-shadow"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <Search className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">No donation records found</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Try adjusting your filters</p>
          </motion.div>
        )}
      </div>

      {/* Security Footer */}
      <div className="flex items-center gap-4 py-10 border-t border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900">Encrypted Record System</h4>
          <p className="text-xs font-medium text-slate-400 italic">Donation history is logged for humanitarian coordination and reporting.</p>
        </div>
      </div>
    </div>
  )
}
