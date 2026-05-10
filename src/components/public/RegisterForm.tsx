'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Droplet,
  Calendar,
  Clock,
  Phone,
  MapPin,
  Building2,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart
} from 'lucide-react'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { committeeService } from '@/services/committeeService'
import { unitService } from '@/services/unitService'
import { donorService } from '@/services/donorService'
import { BLOOD_GROUPS } from '@/constants'
import { Committee, Unit } from '@/types'
import { cn } from '@/lib/utils'

export const RegisterForm = () => {
  const [committeeOptions, setCommitteeOptions] = useState<Committee[]>([])
  const [unitOptions, setUnitOptions] = useState<Unit[]>([])
  const [loadingCommittee, setLoadingCommittee] = useState(true)
  const [loadingUnits, setLoadingUnits] = useState(false)
  const [formStep, setFormStep] = useState(1)

  const [form, setForm] = useState({
    name: '',
    bloodGroup: '',
    dob: '',
    phone: '',
    committeeId: '',
    unitId: '',
    newUnitName: '',
    lastDonation: ''
  })
  const [showNewUnitInput, setShowNewUnitInput] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    committeeService.getAll().then(data => {
      setCommitteeOptions(data)
      setLoadingCommittee(false)
    }).catch(() => {
      toast.error('Failed to load committees')
      setLoadingCommittee(false)
    })
  }, [])

  useEffect(() => {
    if (!form.committeeId) {
      setUnitOptions([])
      return
    }
    setLoadingUnits(true)
    unitService.getByCommittee(form.committeeId).then(data => {
      setUnitOptions(data)
      setShowNewUnitInput(false)
      setLoadingUnits(false)
    }).catch(() => {
      toast.error('Failed to load units')
      setLoadingUnits(false)
    })
  }, [form.committeeId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!form.name) return 'Full name is required'
      if (!form.bloodGroup) return 'Blood group is required'
      if (!form.dob) return 'Date of birth is required'
    }
    if (step === 2) {
      if (!form.phone) return 'Phone number is required'
      if (!/\d{10}/.test(form.phone)) return 'Phone must be 10 digits'
      if (!form.committeeId) return 'Committee is required'
      if (!form.unitId && !form.newUnitName) return 'Unit is required'
    }
    return null
  }

  const nextStep = () => {
    const error = validateStep(formStep)
    if (error) {
      toast.error(error)
      return
    }
    setFormStep(prev => prev + 1)
  }

  const prevStep = () => setFormStep(prev => prev - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const error = validateStep(2)
    if (error) {
      toast.error(error)
      return
    }
    setSubmitting(true)
    try {
      let finalUnitId = form.unitId
      if (showNewUnitInput && form.newUnitName) {
        const newUnit = await unitService.create(form.committeeId, form.newUnitName)
        finalUnitId = newUnit.id
      }

      await donorService.create({
        name: form.name,
        blood_group: form.bloodGroup,
        dob: form.dob,
        phone: form.phone,
        committee_id: form.committeeId,
        unit_id: finalUnitId,
        last_blood_donating_date: form.lastDonation || null,
        available: true
      })

      setIsSuccess(true)
      toast.success('Registration successful!')
    } catch (e) {
      console.error(e)
      toast.error('Failed to submit registration')
    } finally {
      setSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto glass p-16 rounded-[4rem] text-center space-y-10 shadow-2xl border-none"
      >
        <div className="w-32 h-32 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mx-auto rotate-12 shadow-inner">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 -rotate-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-slate-900">Heroic Act!</h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed font-nunito">
            Thank you for joining our life-saving community. Your information is securely stored and ready to help when needed.
          </p>
        </div>
        <Button
          onClick={() => {
            setIsSuccess(false)
            setFormStep(1)
            setForm({
              name: '',
              bloodGroup: '',
              dob: '',
              phone: '',
              committeeId: '',
              unitId: '',
              newUnitName: '',
              lastDonation: ''
            })
          }}
          className="w-full h-20 rounded-3xl text-2xl font-black shadow-2xl shadow-primary/20 bg-primary hover:bg-rose-600"
        >
          Register Another
        </Button>
      </motion.div>
    )
  }

  return (
    <section id="register" className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest"
              >
                Join the Mission
              </motion.div>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-none">
                Register as a <br />
                <span className="text-primary italic">Life Saver.</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed font-nunito">
                Your voluntary donation is a gift of life. Register today and become a vital part of our humanitarian network.
              </p>
            </div>

            <div className="space-y-10">
              {[
                { icon: ShieldCheck, title: "100% Privacy", desc: "Your contact details are encrypted and only accessible in emergencies.", color: 'emerald' },
                { icon: Heart, title: "Voluntary Act", desc: "No pressure, donate only when you are comfortable and available.", color: 'rose' },
                { icon: Clock, title: "Real-time Control", desc: "Toggle your availability status anytime through our local committee coordinators.", color: 'blue' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-8 items-start group"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-110",
                    item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                      item.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                  )}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-slate-500 font-medium font-nunito">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Card className="border-none shadow-[0_50px_100px_rgba(0,0,0,0.08)] rounded-[4rem] overflow-hidden bg-white relative">
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                  <Droplet className="w-64 h-64 text-primary fill-primary" />
                </div>

                <div className="bg-slate-950 p-12 text-white flex flex-col md:row items-center justify-between gap-8">
                  <div>
                    <CardTitle className="text-4xl font-black mb-2">Registration</CardTitle>
                    <CardDescription className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Step {formStep} of 2</CardDescription>
                  </div>
                  <div className="flex gap-3">
                    <div className={cn("w-12 h-2 rounded-full transition-all duration-500", formStep >= 1 ? "bg-primary" : "bg-slate-800")} />
                    <div className={cn("w-12 h-2 rounded-full transition-all duration-500", formStep >= 2 ? "bg-primary" : "bg-slate-800")} />
                  </div>
                </div>

                <CardContent className="p-12 relative z-10">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <AnimatePresence mode="wait">
                      {formStep === 1 ? (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          className="space-y-10"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <User className="w-4 h-4 text-primary" /> Full Name
                              </Label>
                              <Input
                                name="name"
                                placeholder="Rahul Das"
                                value={form.name}
                                onChange={handleChange}
                                className="h-16 px-8 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-bold"
                              />
                            </div>

                            <div className="space-y-4">
                              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <Droplet className="w-4 h-4 text-primary" /> Blood Group
                              </Label>
                              <Select value={form.bloodGroup} onValueChange={v => setForm(p => ({ ...p, bloodGroup: v }))}>
                                <SelectTrigger className="h-16 px-8 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-bold">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="rounded-3xl p-2 border-none shadow-2xl">
                                  {BLOOD_GROUPS.map(g => (
                                    <SelectItem key={g} value={g} className="rounded-xl py-4 font-bold">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">{g}</div>
                                        {g}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-4">
                              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <Calendar className="w-4 h-4 text-primary" /> Birth Date
                              </Label>
                              <Input
                                name="dob"
                                type="date"
                                value={form.dob}
                                onChange={handleChange}
                                className="h-16 px-8 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-bold"
                              />
                            </div>

                            <div className="space-y-4">
                              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <Clock className="w-4 h-4 text-primary" /> Last Donation
                              </Label>
                              <Input
                                name="lastDonation"
                                type="date"
                                value={form.lastDonation}
                                onChange={handleChange}
                                className="h-16 px-8 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-bold"
                              />
                            </div>
                          </div>

                          <Button
                            type="button"
                            onClick={nextStep}
                            className="w-full h-20 rounded-3xl text-2xl font-black bg-slate-900 hover:bg-black group shadow-2xl shadow-black/10"
                          >
                            Continue
                            <ArrowRight className="ml-3 w-8 h-8 group-hover:translate-x-2 transition-transform" />
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          className="space-y-10"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <Phone className="w-4 h-4 text-primary" /> Phone Number
                              </Label>
                              <Input
                                name="phone"
                                placeholder="9876543210"
                                value={form.phone}
                                onChange={handleChange}
                                maxLength={10}
                                className="h-16 px-8 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-bold"
                              />
                            </div>

                            <div className="space-y-4">
                              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <MapPin className="w-4 h-4 text-primary" /> Committee
                              </Label>
                              <Select value={form.committeeId} onValueChange={v => setForm(p => ({ ...p, committeeId: v, unitId: '' }))}>
                                <SelectTrigger className="h-16 px-8 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-bold">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="rounded-3xl p-2 border-none shadow-2xl">
                                  {committeeOptions.map(c => (
                                    <SelectItem key={c.id} value={c.id} className="rounded-xl py-4 font-bold">{c.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-4 md:col-span-2">
                              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <Building2 className="w-4 h-4 text-primary" /> Unit Committee
                              </Label>
                              <Select value={form.unitId} onValueChange={v => {
                                if (v === 'NEW_UNIT') {
                                  setShowNewUnitInput(true)
                                  setForm(p => ({ ...p, unitId: '' }))
                                } else {
                                  setShowNewUnitInput(false)
                                  setForm(p => ({ ...p, unitId: v }))
                                }
                              }} disabled={!form.committeeId}>
                                <SelectTrigger className="h-16 px-8 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-bold">
                                  <SelectValue placeholder={form.committeeId ? "Select" : "Select Committee First"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-3xl p-2 border-none shadow-2xl">
                                  {unitOptions.map(u => (
                                    <SelectItem key={u.id} value={u.id} className="rounded-xl py-4 font-bold">{u.name}</SelectItem>
                                  ))}
                                  <SelectItem value="NEW_UNIT" className="rounded-xl py-4 font-bold text-primary bg-primary/5">
                                    <div className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Unit</div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {showNewUnitInput && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                              <Label className="text-xs font-black text-primary uppercase tracking-widest ml-2">New Unit Name</Label>
                              <Input
                                name="newUnitName"
                                placeholder="e.g. West Pinarayi"
                                value={form.newUnitName}
                                onChange={handleChange}
                                className="h-16 px-8 rounded-2xl bg-primary/5 border-2 border-primary/20 focus:bg-white transition-all text-lg font-bold"
                              />
                            </motion.div>
                          )}

                          <div className="flex gap-6">
                            <Button type="button" variant="outline" onClick={prevStep} className="h-20 w-32 rounded-3xl border-2 border-slate-100 font-black">
                              Back
                            </Button>
                            <Button
                              type="submit"
                              disabled={submitting}
                              className="h-20 flex-1 rounded-3xl text-2xl font-black bg-primary hover:bg-rose-600 shadow-2xl shadow-primary/20"
                            >
                              {submitting ? 'Registering...' : 'Complete Registration'}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </CardContent>

                <div className="bg-slate-50 p-8 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure Data
                  </div>
                  <div className="w-px h-4 bg-slate-200" />
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <Heart className="w-4 h-4 text-rose-600" /> Purely Voluntary
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
