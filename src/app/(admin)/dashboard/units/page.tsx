'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Search, Building2, Edit, Trash2, MapPin, Activity, ChevronRight, Layers } from 'lucide-react'
import { unitService } from '@/services/unitService'
import { committeeService } from '@/services/committeeService'
import { Unit, Committee } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
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

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([])
  const [committees, setCommittees] = useState<Committee[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null)
  const [name, setName] = useState('')
  const [committeeId, setCommitteeId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    try {
      const [unitsData, committeesData] = await Promise.all([
        unitService.getAll(),
        committeeService.getAll()
      ])
      setUnits(unitsData)
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !committeeId) return

    setSubmitting(true)
    try {
      if (currentUnit) {
        await unitService.update(currentUnit.id, name, committeeId)
        toast.success('Unit updated successfully')
      } else {
        await unitService.create(committeeId, name)
        toast.success('Unit created successfully')
      }
      setIsDialogOpen(false)
      setName('')
      setCommitteeId('')
      setCurrentUnit(null)
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this unit?')) return

    try {
      await unitService.delete(id)
      toast.success('Unit deleted successfully')
      loadData()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const filteredUnits = units.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.committees?.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10 p-4 md:p-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <Layers className="w-3 h-3" />
            Infrastructure
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Unit <span className="text-primary italic">Committees</span></h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{filteredUnits.length} Units Active</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setCurrentUnit(null)
            setName('')
            setCommitteeId('')
          }
        }}>
          <DialogTrigger render={<Button className="rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20" />}>
            <Plus className="w-5 h-5 mr-2" />
            Add Unit
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] overflow-hidden border-none p-0">
            <div className="bg-slate-900 p-8 text-white">
              <DialogTitle className="text-3xl font-black">
                {currentUnit ? 'Edit Unit' : 'New Unit'}
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                Local unit level management
              </DialogDescription>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6 bg-white">
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Select Committee</Label>
                <Select value={committeeId} onValueChange={(v) => v && setCommitteeId(v)} required>
                  <SelectTrigger className="h-12 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-xl font-bold text-slate-900">
                    <SelectValue placeholder="Select Parent Committee">
                      {committees.find(c => c.id === committeeId)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl p-2">
                    {committees.map((m) => (
                      <SelectItem key={m.id} value={m.id} className="rounded-xl font-bold py-3">
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Unit Name</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Pinarayi West"
                  className="h-12 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-xl font-bold"
                  required
                />
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Unit Details'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Bar */}
      <Card className="border-none premium-shadow rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/30 p-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search units or parent committees..." 
              className="pl-12 h-14 bg-white border-2 border-transparent focus:border-primary/20 rounded-[1.25rem] font-bold text-lg shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-[2rem]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode='popLayout'>
                {filteredUnits.map((unit, idx) => (
                  <motion.div
                    key={unit.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <div className="group p-6 rounded-[2rem] bg-white border-2 border-slate-50 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => {
                              setCurrentUnit(unit)
                              setName(unit.name)
                              setCommitteeId(unit.committee_id)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(unit.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-black text-xl text-slate-900 tracking-tight group-hover:text-primary transition-colors">{unit.name}</h3>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 w-fit group-hover:bg-primary/5 transition-colors">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[120px]">
                            {unit.committees?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {!loading && filteredUnits.length === 0 && (
            <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Building2 className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">No units found</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Try a different search term</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

