'use client'

import React, { useEffect, useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  MessageCircle, 
  Edit, 
  Trash2, 
  FileDown, 
  User,
  Users,
  MapPin,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Activity,
  ChevronRight,
  Droplet,
  ShieldCheck,
  AlertCircle,
  Settings
} from 'lucide-react'
import { donorService } from '@/services/donorService'
import { committeeService } from '@/services/committeeService'
import { unitService } from '@/services/unitService'
import { Donor, Committee, Unit } from '@/types'
import { BLOOD_GROUPS } from '@/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { exportToExcel, exportToPDF } from '@/utils/exportUtils'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [committees, setCommittees] = useState<Committee[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [search, setSearch] = useState('')
  const [filterCommittee, setFilterCommittee] = useState('all')
  const [filterUnit, setFilterUnit] = useState('all')
  const [filterBlood, setFilterBlood] = useState('all')

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentDonor, setCurrentDonor] = useState<Partial<Donor>>({})
  const [submitting, setSubmitting] = useState(false)
  const [formUnits, setFormUnits] = useState<Unit[]>([])

  const loadData = async () => {
    try {
      const [donorsData, committeesData] = await Promise.all([
        donorService.getAll(),
        committeeService.getAll()
      ])
      setDonors(donorsData)
      setCommittees(committeesData)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCommitteeChange = async (id: string | null) => {
    if (!id || id === 'all') {
      setUnits([])
      setFilterUnit('all')
      return
    }
    try {
      const unitsData = await unitService.getByCommittee(id)
      setUnits(unitsData)
      setFilterUnit('all')
    } catch (error) {
      toast.error('Failed to load units')
    }
  }

  const handleFormCommitteeChange = async (id: string | null) => {
    if (!id) return
    setCurrentDonor(prev => ({ ...prev, committee_id: id, unit_id: undefined } as Partial<Donor>))
    try {
      const unitsData = await unitService.getByCommittee(id)
      setFormUnits(unitsData)
    } catch (error) {
      toast.error('Failed to load units')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentDonor?.name || !currentDonor?.phone || !currentDonor?.blood_group || !currentDonor?.committee_id || !currentDonor?.unit_id) {
      toast.error('Please fill all required fields')
      return
    }

    setSubmitting(true)
    try {
      if (currentDonor.id) {
        await donorService.update(currentDonor.id, currentDonor as any)
        toast.success('Donor updated successfully')
      } else {
        await donorService.create(currentDonor as any)
        toast.success('Donor added successfully')
      }
      setIsDialogOpen(false)
      setCurrentDonor({})
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this donor?')) return

    try {
      await donorService.delete(id)
      toast.success('Donor deleted successfully')
      loadData()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const filteredDonors = donors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                         d.phone.includes(search)
    const matchesCommittee = filterCommittee === 'all' || d.committee_id === filterCommittee
    const matchesUnit = filterUnit === 'all' || d.unit_id === filterUnit
    const matchesBlood = filterBlood === 'all' || d.blood_group === filterBlood
    return matchesSearch && matchesCommittee && matchesUnit && matchesBlood
  })

  return (
    <div className="space-y-10 p-4 md:p-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <Users className="w-3 h-3" />
            Management
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Blood <span className="text-primary italic">Donors</span></h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{filteredDonors.length} Registered Donors found</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-2 bg-white" />}>
              <FileDown className="w-4 h-4 mr-2" />
              Export Data
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px]">
              <DropdownMenuItem onClick={() => exportToExcel(filteredDonors, 'donors')} className="rounded-xl py-3 font-bold cursor-pointer">
                <ChevronRight className="w-4 h-4 mr-2 text-primary" />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToPDF(filteredDonors, 'donors')} className="rounded-xl py-3 font-bold cursor-pointer">
                <ChevronRight className="w-4 h-4 mr-2 text-primary" />
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setCurrentDonor({})
              setFormUnits([])
            }
          }}>
            <DialogTrigger render={<Button className="rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20" />}>
              <Plus className="w-5 h-5 mr-2" />
              Add New Donor
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] overflow-hidden border-none p-0">
              <div className="bg-slate-900 p-8 text-white">
                <DialogTitle className="text-3xl font-black">
                  {currentDonor.id ? 'Edit Donor' : 'New Donor'}
                </DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                  Enter information for the donation database
                </DialogDescription>
              </div>
              <form onSubmit={handleSave} className="p-8 space-y-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Name</Label>
                    <Input 
                      value={currentDonor.name || ''} 
                      onChange={(e) => setCurrentDonor(prev => ({ ...prev, name: e.target.value } as Partial<Donor>))}
                      placeholder="e.g. John Doe"
                      className="h-12 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-xl font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Phone Number</Label>
                    <Input 
                      value={currentDonor.phone || ''} 
                      onChange={(e) => setCurrentDonor(prev => ({ ...prev, phone: e.target.value } as Partial<Donor>))}
                      placeholder="10-digit number"
                      maxLength={10}
                      className="h-12 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-xl font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Blood Group</Label>
                    <Select 
                      value={currentDonor.blood_group} 
                      onValueChange={(v) => setCurrentDonor(prev => ({ ...prev, blood_group: v } as Partial<Donor>))}
                    >
                      <SelectTrigger className="h-12 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-xl font-bold">
                        <SelectValue placeholder="Select Group" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl p-2">
                        {BLOOD_GROUPS.map(g => (
                          <SelectItem key={g} value={g} className="rounded-xl font-bold py-3">
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              {g}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Date of Birth</Label>
                    <Input 
                      type="date"
                      value={currentDonor.dob || ''} 
                      onChange={(e) => setCurrentDonor(prev => ({ ...prev, dob: e.target.value } as Partial<Donor>))}
                      className="h-12 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Regional Committee</Label>
                    <Select 
                      value={currentDonor?.committee_id} 
                      onValueChange={handleFormCommitteeChange}
                    >
                      <SelectTrigger className="h-12 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-xl font-bold text-slate-900">
                        <SelectValue placeholder="Select Committee">
                          {committees.find(c => c.id === currentDonor?.committee_id)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl p-2">
                        {committees.map(m => <SelectItem key={m.id} value={m.id} className="rounded-xl font-bold py-3">{m.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Unit Committee</Label>
                    <Select 
                      value={currentDonor.unit_id} 
                      onValueChange={(v) => setCurrentDonor(prev => ({ ...prev, unit_id: v } as Partial<Donor>))}
                      disabled={!currentDonor.committee_id}
                    >
                      <SelectTrigger className="h-12 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-xl font-bold text-slate-900">
                        <SelectValue placeholder="Select Unit">
                          {formUnits.find(u => u.id === currentDonor.unit_id)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl p-2">
                        {formUnits.map(u => <SelectItem key={u.id} value={u.id} className="rounded-xl font-bold py-3">{u.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Last Donation</Label>
                    <Input 
                      type="date"
                      value={currentDonor.last_blood_donating_date || ''} 
                      onChange={(e) => setCurrentDonor(prev => ({ ...prev, last_blood_donating_date: e.target.value } as Partial<Donor>))}
                      className="h-12 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-xl font-bold"
                    />
                  </div>
                  <div className="flex items-center space-x-3 pt-8">
                    <input 
                      type="checkbox" 
                      id="available" 
                      checked={currentDonor.available ?? true}
                      onChange={(e) => setCurrentDonor(prev => ({ ...prev, available: e.target.checked } as Partial<Donor>))}
                      className="w-6 h-6 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary transition-all cursor-pointer"
                    />
                    <Label htmlFor="available" className="text-sm font-black text-slate-900 cursor-pointer uppercase tracking-wider">Available Now</Label>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20"
                    disabled={submitting}
                  >
                    {submitting ? 'Processing...' : 'Save Donor Details'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-none premium-shadow rounded-[2rem] overflow-hidden bg-white">
        <div className="p-6 md:p-8 flex flex-col lg:flex-row items-center gap-6">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by name, phone or unit..." 
              className="pl-12 h-14 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-[1.25rem] font-bold text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <Select value={filterCommittee} onValueChange={(v) => { if (v) { setFilterCommittee(v); handleCommitteeChange(v); } }}>
              <SelectTrigger className="w-[160px] h-14 bg-slate-50 border-none rounded-[1.25rem] font-black text-xs uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="Committee">
                    {filterCommittee === 'all' ? 'All' : committees.find(c => c.id === filterCommittee)?.name}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2 min-w-[200px]">
                <SelectItem value="all" className="rounded-xl font-bold py-3">All Committees</SelectItem>
                {committees.map(m => <SelectItem key={m.id} value={m.id} className="rounded-xl font-bold py-3">{m.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterUnit} onValueChange={(v) => v && setFilterUnit(v)} disabled={filterCommittee === 'all'}>
              <SelectTrigger className="w-[160px] h-14 bg-slate-50 border-none rounded-[1.25rem] font-black text-xs uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="Unit">
                    {filterUnit === 'all' ? 'All' : units.find(u => u.id === filterUnit)?.name}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2 min-w-[200px]">
                <SelectItem value="all" className="rounded-xl font-bold py-3">All Units</SelectItem>
                {units.map(u => <SelectItem key={u.id} value={u.id} className="rounded-xl font-bold py-3">{u.name}</SelectItem>)}
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
                setFilterUnit('all')
                setFilterBlood('all')
              }}
            >
              <XCircle className="w-6 h-6 text-slate-400" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Donors Grid */}
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
              {filteredDonors.map((donor, idx) => (
                <motion.div
                  key={donor.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Card className="group border-none premium-shadow hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white ring-2 ring-transparent hover:ring-primary/10">
                    <CardContent className="p-0">
                      {/* Card Header Section */}
                      <div className="p-8 pb-6 flex justify-between items-start">
                        <div className="flex gap-5">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-2xl shadow-inner border-2 border-primary/10 group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all duration-500">
                              {donor.blood_group}
                            </div>
                            {donor.available && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-black text-slate-900 line-clamp-1 tracking-tight">{donor.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge className={cn(
                                "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest border-none shadow-none",
                                donor.available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                              )}>
                                {donor.available ? 'Ready to Donate' : 'On Break'}
                              </Badge>
                              {donor.last_blood_donating_date && (
                                <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest border-slate-100 text-slate-400">
                                  Donor
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-xl text-slate-300 hover:text-slate-900 transition-colors" />}>
                            <MoreVertical className="w-5 h-5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[150px]">
                            <DropdownMenuItem onClick={() => {
                              setCurrentDonor(donor)
                              handleFormCommitteeChange(donor.committee_id)
                              setIsDialogOpen(true)
                            }} className="rounded-xl py-3 font-bold cursor-pointer">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(donor.id)} className="rounded-xl py-3 font-bold cursor-pointer text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Info Body */}
                      <div className="px-8 pb-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-50">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Committee</span>
                            <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-primary" />
                              <span className="truncate">{(donor as any).committees?.name}</span>
                            </div>
                          </div>
                          <div className="space-y-1 border-l border-slate-100 pl-4">
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Unit</span>
                            <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                              <Building2 className="w-3 h-3 text-primary" />
                              <span className="truncate">{(donor as any).units?.name}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Phone</span>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <Phone className="w-3 h-3 text-primary" />
                              {donor.phone}
                            </div>
                          </div>
                          <div className="space-y-1 border-l border-slate-100 pl-4">
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Status</span>
                            <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                              <Activity className="w-3 h-3 text-primary" />
                              {donor.last_blood_donating_date ? format(new Date(donor.last_blood_donating_date), 'MMM yyyy') : 'First Time'}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                          <Button render={<a href={`tel:${donor.phone}`} />} className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100 font-black">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                          </Button>
                          <Button render={<a href={`https://wa.me/91${donor.phone}`} target="_blank" rel="noopener noreferrer" />} variant="outline" className="h-14 w-14 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center hover:bg-slate-50 transition-colors">
                            <MessageCircle className="w-6 h-6 text-emerald-500" />
                          </Button>
                          <Button variant="outline" className="h-14 w-14 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center hover:bg-slate-50 transition-colors" render={<Link href={`/dashboard/donors?id=${donor.id}`} />}>
                             <ChevronRight className="w-6 h-6 text-slate-400" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {!loading && filteredDonors.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[3rem] premium-shadow"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <Search className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">No matching donors</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Try adjusting your filters or search terms</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearch('')
                setFilterCommittee('all')
                setFilterUnit('all')
                setFilterBlood('all')
              }}
              className="mt-6 text-primary font-black uppercase tracking-widest text-[10px]"
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Trust & Security Badge */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-10 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Privacy Protection Active</h4>
            <p className="text-xs font-medium text-slate-400 italic">Sensitive data is encrypted and only visible to authorized admins.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
          <AlertCircle className="w-3 h-3" />
          System Version 2.0.4 Premium
        </div>
      </div>
    </div>
  )
}
