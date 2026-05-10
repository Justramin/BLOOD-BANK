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
  Heart,
  Search,
  UserPlus,
  Hospital,
  AlertCircle
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
import { donationService } from '@/services/donationService'
import { BLOOD_GROUPS } from '@/constants'
import { Committee, Unit, Donor } from '@/types'
import { cn } from '@/lib/utils'

export const RegisterForm = () => {
  const [committeeOptions, setCommitteeOptions] = useState<Committee[]>([])
  const [unitOptions, setUnitOptions] = useState<Unit[]>([])
  const [loadingCommittee, setLoadingCommittee] = useState(true)
  const [loadingUnits, setLoadingUnits] = useState(false)
  const [formStep, setFormStep] = useState(1) // 1: Mode Selection, 2: Phone Search, 3: Full Reg, 4: Donation Entry
  const [regMode, setRegMode] = useState<'new' | 'existing' | null>(null)

  const [form, setForm] = useState({
    name: '',
    bloodGroup: '',
    dob: '',
    phone: '',
    committeeId: '',
    unitId: '',
    newUnitName: '',
    hospitalName: '',
    donationDate: ''
  })

  const [existingDonor, setExistingDonor] = useState<Donor | null>(null)
  const [phoneExists, setPhoneExists] = useState(false)
  const [showNewUnitInput, setShowNewUnitInput] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searching, setSearching] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  // Instant Phone Validation Logic
  useEffect(() => {
    const checkPhone = async () => {
      if (form.phone.length === 10) {
        setSearching(true)
        try {
          const donor = await donorService.getByPhone(form.phone)
          if (donor) {
            setPhoneExists(true)
            if (regMode === 'existing') {
              setExistingDonor(donor)
              setForm(prev => ({
                ...prev,
                name: donor.name,
                bloodGroup: donor.blood_group,
                dob: donor.dob || '',
                committeeId: donor.committee_id || '',
                unitId: donor.unit_id || ''
              }))
              setFormStep(4) // Move to donation details
            }
          } else {
            setPhoneExists(false)
            setExistingDonor(null)
            if (regMode === 'existing') {
              toast.info('No donor found. Please complete registration.')
              setFormStep(3) // Move to full registration
            }
          }
        } catch (e) {
          console.error(e)
        } finally {
          setSearching(false)
        }
      } else {
        setPhoneExists(false)
      }
    }
    checkPhone()
  }, [form.phone, regMode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    
    if (step === 3) {
      if (!form.name) newErrors.name = 'Full name is required'
      if (!form.bloodGroup) newErrors.bloodGroup = 'Blood group is required'
      if (!form.dob) newErrors.dob = 'Date of birth is required'
      if (!form.phone) newErrors.phone = 'Phone number is required'
      else if (form.phone.length !== 10) newErrors.phone = 'Invalid phone number'
      else if (phoneExists) newErrors.phone = 'Donor already registered with this phone number'
      
      if (!form.committeeId) newErrors.committeeId = 'Megala Committee is required'
      if (!form.unitId && !form.newUnitName) newErrors.unitId = 'Unit is required'
    }

    if (step === 4) {
      if (regMode === 'existing') {
        if (!form.hospitalName) newErrors.hospitalName = 'Hospital name is required'
        if (!form.donationDate) newErrors.donationDate = 'Donation date is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(formStep)) {
      toast.error('Please fix the errors in the form')
      return
    }
    setSubmitting(true)
    try {
      let donorId = existingDonor?.id

      if (!donorId) {
        let finalUnitId = form.unitId
        if (showNewUnitInput && form.newUnitName) {
          const newUnit = await unitService.create(form.committeeId, form.newUnitName)
          finalUnitId = newUnit.id
        }

        const newDonor = await donorService.create({
          name: form.name,
          blood_group: form.bloodGroup,
          dob: form.dob || null,
          phone: form.phone,
          committee_id: form.committeeId || null,
          unit_id: finalUnitId || null,
          last_blood_donating_date: form.donationDate || null,
          available: true
        })
        donorId = newDonor.id
      } else {
        // Update existing donor's last donation date
        await donorService.update(donorId, {
          last_blood_donating_date: form.donationDate || null,
          available: true
        })
      }

      // Create donation record only if hospitalName is provided
      if (form.hospitalName && form.donationDate && donorId) {
        await donationService.create({
          donor_id: donorId,
          hospital_name: form.hospitalName,
          donation_date: form.donationDate
        })
      }

      setIsSuccess(true)
      toast.success('Donation entry recorded successfully!')
    } catch (e: any) {
      console.error('Submission Error:', e)
      
      let errorMessage = 'Failed to submit donation record'
      if (e.message) errorMessage = e.message
      if (e.details) errorMessage += `: ${e.details}`
      if (e.code === '23505') errorMessage = 'A donor with this phone number is already registered.'
      
      toast.error(errorMessage, {
        duration: 5000
      })
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
          <h1 className="text-5xl font-black text-slate-900">Entry Recorded!</h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed font-nunito">
            Thank you for your life-saving contribution. The donation record has been successfully registered.
          </p>
        </div>
        <Button
          onClick={() => {
            setIsSuccess(false)
            setFormStep(1)
            setRegMode(null)
            setExistingDonor(null)
            setPhoneExists(false)
            setForm({
              name: '',
              bloodGroup: '',
              dob: '',
              phone: '',
              committeeId: '',
              unitId: '',
              newUnitName: '',
              hospitalName: '',
              donationDate: ''
            })
          }}
          className="w-full h-20 rounded-3xl text-2xl font-black shadow-2xl shadow-primary/20 bg-primary hover:bg-rose-600"
        >
          Add Another Entry
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
                Humanitarian Portal
              </motion.div>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-none">
                Donation <br />
                <span className="text-primary italic">Entry.</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed font-nunito">
                Record a new blood donation entry. Smart system auto-fills data for registered donors via phone number.
              </p>
            </div>

            <div className="space-y-10">
              {[
                { icon: ShieldCheck, title: "Smart Retrieval", desc: "Instantly fetch donor history using phone number to save time.", color: 'emerald' },
                { icon: Heart, title: "Gift of Life", desc: "Every recorded donation helps us track our community's impact.", color: 'rose' },
                { icon: Clock, title: "Instant Validation", desc: "Number verification while typing to prevent duplicate registrations.", color: 'blue' }
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
                    <CardTitle className="text-4xl font-black mb-2">Blood Donation</CardTitle>
                    <CardDescription className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">
                      {formStep === 1 ? 'Choose Mode' : formStep === 2 ? 'Identify Donor' : formStep === 3 ? 'Registration' : 'Donation Details'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4].map(s => (
                      <div key={s} className={cn("w-8 h-2 rounded-full transition-all duration-500", formStep >= s ? "bg-primary" : "bg-slate-800")} />
                    ))}
                  </div>
                </div>

                <CardContent className="p-12 relative z-10">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <AnimatePresence mode="wait">
                      {formStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                          <button
                            type="button"
                            onClick={() => { setRegMode('existing'); setFormStep(2); }}
                            className="p-10 rounded-[3rem] border-4 border-slate-50 bg-slate-50 hover:bg-white hover:border-primary/20 transition-all text-left group"
                          >
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                              <Search className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Already Registered</h3>
                            <p className="text-slate-500 font-medium font-nunito">Use your phone number to quickly record a donation.</p>
                          </button>

                          <button
                            type="button"
                            onClick={() => { setRegMode('new'); setFormStep(2); }}
                            className="p-10 rounded-[3rem] border-4 border-slate-50 bg-slate-50 hover:bg-white hover:border-primary/20 transition-all text-left group"
                          >
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                              <UserPlus className="w-8 h-8 text-rose-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">New Registration</h3>
                            <p className="text-slate-500 font-medium font-nunito">First time donating? Register as a new donor here.</p>
                          </button>
                        </motion.div>
                      )}

                      {formStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          className="space-y-10"
                        >
                          <div className="space-y-4">
                            <div className="flex justify-between items-center ml-2">
                              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" /> Phone Number
                              </Label>
                              {searching && <span className="text-[10px] font-black text-primary animate-pulse uppercase tracking-widest">Verifying...</span>}
                            </div>
                            <div className="relative">
                              <Input
                                name="phone"
                                placeholder="9876543210"
                                value={form.phone}
                                onChange={handleChange}
                                maxLength={10}
                                className={cn(
                                  "h-20 px-8 rounded-3xl bg-slate-50 border-4 transition-all text-2xl font-bold",
                                  phoneExists && regMode === 'new' ? "border-rose-100 focus:border-rose-200" : "border-transparent focus:border-primary/20"
                                )}
                              />
                              {phoneExists && regMode === 'new' && (
                                <div className="mt-4 flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-widest ml-2">
                                  <AlertCircle className="w-4 h-4" />
                                  Donor already registered with this phone number
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-6">
                            <Button type="button" variant="ghost" onClick={() => setFormStep(1)} className="h-20 px-10 rounded-3xl font-black">Back</Button>
                            {regMode === 'new' && (
                              <Button
                                type="button"
                                onClick={() => !phoneExists && setFormStep(3)}
                                disabled={phoneExists || form.phone.length < 10 || searching}
                                className="h-20 flex-1 rounded-3xl text-2xl font-black bg-slate-900 hover:bg-black"
                              >
                                Continue
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {formStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          className="space-y-8"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <Label className="ml-2 text-xs font-black text-slate-400 uppercase">Full Name</Label>
                              <Input name="name" value={form.name} onChange={handleChange} placeholder="Donor's Full Name" className={cn("h-16 rounded-2xl bg-slate-50 border-none", errors.name && "ring-2 ring-rose-500")} />
                              {errors.name && <p className="ml-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label className="ml-2 text-xs font-black text-slate-400 uppercase">Phone Number</Label>
                              <Input name="phone" value={form.phone} onChange={handleChange} maxLength={10} placeholder="10 Digit Number" className={cn("h-16 rounded-2xl bg-slate-50 border-none", errors.phone && "ring-2 ring-rose-500")} />
                              {errors.phone && <p className="ml-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.phone}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label className="ml-2 text-xs font-black text-slate-400 uppercase">Blood Group</Label>
                              <Select value={form.bloodGroup} onValueChange={v => {
                                setForm(p => ({ ...p, bloodGroup: v || '' }))
                                setErrors(p => { const n = { ...p }; delete n.bloodGroup; return n; })
                              }}>
                                <SelectTrigger className={cn("h-16 rounded-2xl bg-slate-50 border-none", errors.bloodGroup && "ring-2 ring-rose-500")}>
                                  <SelectValue placeholder="Select Group">
                                    {form.bloodGroup}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                  {BLOOD_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              {errors.bloodGroup && <p className="ml-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.bloodGroup}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label className="ml-2 text-xs font-black text-slate-400 uppercase">Birth Date</Label>
                              <Input name="dob" type="date" value={form.dob} onChange={handleChange} className={cn("h-16 rounded-2xl bg-slate-50 border-none", errors.dob && "ring-2 ring-rose-500")} />
                              {errors.dob && <p className="ml-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.dob}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label className="ml-2 text-xs font-black text-slate-400 uppercase">Megala Committee</Label>
                              <Select value={form.committeeId} onValueChange={v => {
                                setForm(p => ({ ...p, committeeId: v || '', unitId: '' }))
                                setErrors(p => { const n = { ...p }; delete n.committeeId; return n; })
                              }}>
                                <SelectTrigger className={cn("h-16 rounded-2xl bg-slate-50 border-none", errors.committeeId && "ring-2 ring-rose-500")}>
                                  <SelectValue placeholder="Select Megala">
                                    {committeeOptions.find(c => c.id === form.committeeId)?.name}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                  {committeeOptions.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              {errors.committeeId && <p className="ml-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.committeeId}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label className="ml-2 text-xs font-black text-slate-400 uppercase">Unit Committee</Label>
                              <Select value={form.unitId} onValueChange={v => {
                                if (v === 'NEW_UNIT') setShowNewUnitInput(true);
                                else { 
                                  setShowNewUnitInput(false); 
                                  setForm(p => ({ ...p, unitId: v || '' })); 
                                  setErrors(p => { const n = { ...p }; delete n.unitId; return n; })
                                }
                              }} disabled={!form.committeeId}>
                                <SelectTrigger className={cn("h-16 rounded-2xl bg-slate-50 border-none", errors.unitId && "ring-2 ring-rose-500")}>
                                  <SelectValue placeholder="Select">
                                    {unitOptions.find(u => u.id === form.unitId)?.name}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                  {unitOptions.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                                  <SelectItem value="NEW_UNIT">+ Add New Unit</SelectItem>
                                </SelectContent>
                              </Select>
                              {errors.unitId && <p className="ml-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.unitId}</p>}
                            </div>
                          </div>
                          {showNewUnitInput && (
                            <Input name="newUnitName" placeholder="New Unit Name" value={form.newUnitName} onChange={handleChange} className="h-16 rounded-2xl border-primary/20" />
                          )}
                          <div className="flex gap-6">
                            <Button type="button" variant="ghost" onClick={() => setFormStep(2)} className="h-20 px-10 rounded-3xl font-black">Back</Button>
                            <Button 
                              type="button" 
                              onClick={() => {
                                if (validateStep(3)) setFormStep(4)
                              }} 
                              className="h-20 flex-1 rounded-3xl text-2xl font-black bg-slate-900 hover:bg-black transition-all active:scale-95"
                            >
                              Continue
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {formStep === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          className="space-y-10"
                        >
                          {existingDonor && (
                            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-6">
                              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center font-black text-primary text-2xl shadow-sm">{existingDonor.blood_group}</div>
                              <div>
                                <h4 className="text-xl font-black text-slate-900">{existingDonor.name}</h4>
                                <p className="text-slate-500 font-medium">Verified Registered Donor</p>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <Hospital className="w-4 h-4 text-primary" /> Hospital Name {regMode === 'new' && '(Optional)'}
                              </Label>
                              <Input
                                name="hospitalName"
                                placeholder={regMode === 'new' ? "Skip if not donating now" : "Medical College, Kannur"}
                                value={form.hospitalName}
                                onChange={handleChange}
                                className={cn(
                                  "h-16 px-8 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 transition-all text-lg font-bold",
                                  errors.hospitalName ? "ring-rose-500 ring-2" : "focus:ring-primary/10"
                                )}
                              />
                              {errors.hospitalName && <p className="ml-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.hospitalName}</p>}
                            </div>

                            <div className="space-y-4">
                              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <Calendar className="w-4 h-4 text-primary" /> Donation Date {regMode === 'new' && '(Optional)'}
                              </Label>
                              <Input
                                name="donationDate"
                                type="date"
                                value={form.donationDate}
                                onChange={handleChange}
                                className={cn(
                                  "h-16 px-8 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 transition-all text-lg font-bold",
                                  errors.donationDate ? "ring-rose-500 ring-2" : "focus:ring-primary/10"
                                )}
                              />
                              {errors.donationDate && <p className="ml-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.donationDate}</p>}
                            </div>
                          </div>

                          <div className="flex gap-6">
                            <Button type="button" variant="ghost" onClick={() => setFormStep(regMode === 'existing' ? 2 : 3)} className="h-20 px-10 rounded-3xl font-black">Back</Button>
                            <Button
                              type="submit"
                              disabled={submitting}
                              className="h-20 flex-1 rounded-3xl text-2xl font-black bg-primary hover:bg-rose-600 shadow-2xl shadow-primary/20"
                            >
                              {submitting ? 'Recording...' : 'Submit Entry'}
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
