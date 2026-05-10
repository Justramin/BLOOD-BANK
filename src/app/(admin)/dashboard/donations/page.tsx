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
  const [filterDate, setFilterDate] = useState('')
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
      d.hospital_name?.toLowerCase().includes(search.toLowerCase())

    const matchesCommittee = filterCommittee === 'all' || donor.committee_id === filterCommittee
    const matchesBlood = filterBlood === 'all' || donor.blood_group === filterBlood
    const matchesDate = !filterDate || (d.donation_date && d.donation_date === filterDate)

    return matchesSearch && matchesCommittee && matchesBlood && matchesDate
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
            <DropdownMenuTrigger render={
              <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-2 bg-white">
                <FileDown className="w-4 h-4 mr-2" />
                Export Records
              </Button>
            }>
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
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
              <Input 
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 w-[180px] h-14 bg-slate-50 border-none rounded-[1.25rem] font-bold text-xs text-slate-500"
              />
            </div>
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
                setFilterDate('')
                setFilterCommittee('all')
                setFilterBlood('all')
              }}
            >
              <XCircle className="w-6 h-6 text-slate-400" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Donation Table */}
      <Card className="border-none premium-shadow rounded-[2rem] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredDonations.length > 0 ? (
            <table className="w-full border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">Si No</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Donor Details</th>
                  <th className="px-6 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Hospital</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Donation Date</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Megala Committee</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Committee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode='popLayout'>
                  {filteredDonations.map((record, idx) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-6 text-center text-xs font-black text-slate-300">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 leading-none mb-1">{record.donor?.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {record.donor?.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-black text-xs">
                          {record.donor?.blood_group}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 bg-slate-100/50 px-3 py-2 rounded-lg w-fit max-w-[200px]">
                          <Hospital className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="truncate">{record.hospital_name || 'Not Specified'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                          <Calendar className="w-4 h-4 text-primary" />
                          {record.donation_date ? format(new Date(record.donation_date), 'dd MMM yyyy') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 whitespace-nowrap">
                          <MapPin className="w-4 h-4 text-primary/60" />
                          {record.donor?.committees?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 whitespace-nowrap">
                          <Building2 className="w-4 h-4 text-primary/60" />
                          {record.donor?.units?.name || 'N/A'}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          ) : (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">No donation records found</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </Card>

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
