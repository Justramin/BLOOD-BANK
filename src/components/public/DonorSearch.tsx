'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Droplet,
  MapPin,
  Building2,
  Phone,
  Calendar,
  ShieldCheck,
  User,
  Filter,
  CheckCircle2,
  XCircle,
  MessageSquare
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { BLOOD_GROUPS } from '@/constants'
import { committeeService } from '@/services/committeeService'
import { unitService } from '@/services/unitService'
import { donorService } from '@/services/donorService'
import { Committee, Unit, Donor } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export const DonorSearch = () => {
  const [donors, setDonors] = useState<Donor[]>([])
  const [committees, setCommittees] = useState<Committee[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    search: '',
    bloodGroup: 'ALL',
    committeeId: 'ALL',
    unitId: 'ALL',
    availableOnly: false
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donorData, committeeData] = await Promise.all([
          donorService.getAll(),
          committeeService.getAll()
        ])
        setDonors(donorData)
        setCommittees(committeeData)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (filters.committeeId !== 'ALL') {
      unitService.getByCommittee(filters.committeeId).then(setUnits)
    } else {
      setUnits([])
    }
  }, [filters.committeeId])

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(filters.search.toLowerCase())
    const matchesBlood = filters.bloodGroup === 'ALL' || donor.blood_group === filters.bloodGroup
    const matchesCommittee = filters.committeeId === 'ALL' || donor.committee_id === filters.committeeId
    const matchesUnit = filters.unitId === 'ALL' || donor.unit_id === filters.unitId
    const matchesAvailability = !filters.availableOnly || donor.available
    return matchesSearch && matchesBlood && matchesCommittee && matchesUnit && matchesAvailability
  })

  return (
    <section id="donors" className="py-32 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest"
          >
            Real-time Database
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none">
            Find a <span className="text-blue-600">Donor.</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed font-nunito">
            Search our verified database of volunteer donors. Every entry is cross-verified through local committee networks.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="glass rounded-[3rem] p-8 md:p-12 mb-16 shadow-2xl shadow-blue-900/5 border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Search className="w-64 h-64 text-blue-600" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Search Bar */}
            <div className="lg:col-span-4 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Search Name</label>
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-600" />
                <Input
                  placeholder="e.g. John Doe..."
                  className="h-16 pl-14 pr-6 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-lg"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            {/* Blood Group */}
            <div className="lg:col-span-3 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Blood Group</label>
              <Select value={filters.bloodGroup} onValueChange={(val) => setFilters(prev => ({ ...prev, bloodGroup: val }))}>
                <SelectTrigger className="h-16 px-6 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-lg">
                  <SelectValue placeholder="All Groups" />
                </SelectTrigger>
                <SelectContent className="rounded-3xl p-2 border-none shadow-2xl">
                  <SelectItem value="ALL" className="rounded-xl py-3 font-bold">All Groups</SelectItem>
                  {BLOOD_GROUPS.map(bg => (
                    <SelectItem key={bg} value={bg} className="rounded-xl py-3 font-bold">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs">{bg}</div>
                        {bg}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Committee */}
            <div className="lg:col-span-3 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Committee</label>
              <Select value={filters.committeeId} onValueChange={(val) => setFilters(prev => ({ ...prev, committeeId: val, unitId: 'ALL' }))}>
                <SelectTrigger className="h-16 px-6 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-lg">
                  <SelectValue placeholder="All Committees" />
                </SelectTrigger>
                <SelectContent className="rounded-3xl p-2 border-none shadow-2xl">
                  <SelectItem value="ALL" className="rounded-xl py-3 font-bold">All Committees</SelectItem>
                  {committees.map(c => (
                    <SelectItem key={c.id} value={c.id} className="rounded-xl py-3 font-bold">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* More Filters Toggle (Pill style) */}
            <div className="lg:col-span-2 flex items-end">
              <Button
                variant={filters.availableOnly ? "default" : "outline"}
                className={cn(
                  "h-16 w-full rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                  filters.availableOnly ? "bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20" : ""
                )}
                onClick={() => setFilters(prev => ({ ...prev, availableOnly: !prev.availableOnly }))}
              >
                {filters.availableOnly ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Filter className="w-4 h-4 mr-2" />}
                {filters.availableOnly ? "Available" : "Status"}
              </Button>
            </div>
          </div>

          {/* Active Unit Filter (Horizontal Pills) */}
          {filters.committeeId !== 'ALL' && units.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <button
                onClick={() => setFilters(prev => ({ ...prev, unitId: 'ALL' }))}
                className={cn(
                  "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2",
                  filters.unitId === 'ALL' ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-500 hover:border-blue-200"
                )}
              >
                All Units
              </button>
              {units.map(unit => (
                <button
                  key={unit.id}
                  onClick={() => setFilters(prev => ({ ...prev, unitId: unit.id }))}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2",
                    filters.unitId === unit.id ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-500 hover:border-blue-200"
                  )}
                >
                  {unit.name}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-[400px] rounded-[2.5rem] bg-slate-50 animate-pulse" />
              ))
            ) : filteredDonors.length > 0 ? (
              filteredDonors.map((donor, i) => (
                <motion.div
                  key={donor.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group relative bg-white rounded-[2.5rem] p-8 premium-shadow border border-slate-100 hover:border-blue-200 transition-all hover:-translate-y-2"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                        <User className="w-10 h-10" />
                      </div>
                      <div className={cn(
                        "absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border-4 border-white shadow-lg",
                        donor.blood_group.includes('+') ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                      )}>
                        {donor.blood_group}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline" className="rounded-lg py-1 px-3 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Volunteer
                      </Badge>
                      {donor.available ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                          <CheckCircle2 className="w-3 h-3" /> Available
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <XCircle className="w-3 h-3" /> Busy
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{donor.name}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        {committees.find(c => c.id === donor.committee_id)?.name} Committee
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-[0.1em] text-[10px]">Unit</span>
                        <span className="text-slate-900 font-black">{units.find(u => u.id === donor.unit_id)?.name || 'Local Unit'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-[0.1em] text-[10px]">Last Donated</span>
                        <span className="text-slate-900 font-black">{donor.last_blood_donating_date || 'Never'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-10">
                    <Button
                      variant="outline"
                      className="h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                      asChild
                    >
                      <a href={`tel:${donor.phone}`}>
                        <Phone className="w-4 h-4 mr-2 text-blue-600" />
                        Call Now
                      </a>
                    </Button>
                    <Button
                      className="h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-slate-900 hover:bg-black shadow-xl shadow-slate-200"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">No Donors Found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your filters or search query.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
