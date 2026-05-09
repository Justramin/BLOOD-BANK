'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Search, MapPin, Edit, Trash2, MoreHorizontal, Activity, ChevronRight, MapPinned } from 'lucide-react'
import { megalaService } from '@/services/megalaService'
import { Committee } from '@/types'
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
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCommittee, setCurrentCommittee] = useState<Committee | null>(null)
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadCommittees = async () => {
    try {
      const data = await megalaService.getAll()
      setCommittees(data)
    } catch (error) {
      toast.error('Failed to load committees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCommittees()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)
    try {
      if (currentCommittee) {
        await megalaService.update(currentCommittee.id, name)
        toast.success('Committee updated successfully')
      } else {
        await megalaService.create(name)
        toast.success('Committee created successfully')
      }
      setIsDialogOpen(false)
      setName('')
      setCurrentCommittee(null)
      loadCommittees()
    } catch (error: any) {
      toast.error(error.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will also delete all units under this committee.')) return

    try {
      await megalaService.delete(id)
      toast.success('Committee deleted successfully')
      loadCommittees()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const filteredCommittees = committees.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10 p-4 md:p-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <MapPinned className="w-3 h-3" />
            Geography
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Regional <span className="text-primary italic">Committees</span></h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{filteredCommittees.length} Committees Registered</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setCurrentCommittee(null)
            setName('')
          }
        }}>
          <DialogTrigger render={<Button className="rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20" />}>
            <Plus className="w-5 h-5 mr-2" />
            Add Committee
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] overflow-hidden border-none p-0">
            <div className="bg-slate-900 p-8 text-white">
              <DialogTitle className="text-3xl font-black">
                {currentCommittee ? 'Edit Committee' : 'New Committee'}
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                Regional committee management
              </DialogDescription>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6 bg-white">
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Committee Name</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Pinarayi North"
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
                  {submitting ? 'Saving...' : 'Save Committee'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter & List Bar */}
      <Card className="border-none premium-shadow rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/30 p-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search committees..." 
              className="pl-12 h-14 bg-white border-2 border-transparent focus:border-primary/20 rounded-[1.25rem] font-bold text-lg shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode='popLayout'>
                {filteredCommittees.map((committee, idx) => (
                  <motion.div
                    key={committee.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <div className="group p-6 rounded-[1.5rem] bg-white border-2 border-slate-50 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{committee.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
                            {committee.units?.[0]?.count || 0} Units Registered
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            setCurrentCommittee(committee)
                            setName(committee.name)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(committee.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {!loading && filteredCommittees.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <MapPinned className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">No results found</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Try a different search term</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

