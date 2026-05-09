'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  User, 
  Phone, 
  Calendar, 
  Droplet, 
  MapPin, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  Users,
  AlertCircle,
  CheckCircle2,
  Plus,
  Info,
  Clock,
  Activity,
  Award
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { megalaService } from '@/services/megalaService'
import { unitService } from '@/services/unitService'
import { donorService } from '@/services/donorService'
import { BLOOD_GROUPS } from '@/constants'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function RegisterPage() {
  const [megalaOptions, setMegalaOptions] = useState<Array<{ id: string; name: string }>>([])
  const [unitOptions, setUnitOptions] = useState<Array<{ id: string; name: string }>>([])
  const [loadingMegala, setLoadingMegala] = useState(true)
  const [loadingUnits, setLoadingUnits] = useState(false)
  const [formStep, setFormStep] = useState(1)

  const [form, setForm] = useState({
    name: '',
    bloodGroup: '',
    dob: '',
    phone: '',
    megalaId: '',
    unitId: '',
    newUnitName: '',
    lastDonation: ''
  })
  const [showNewUnitInput, setShowNewUnitInput] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  useEffect(() => {
    const fetchMegalas = async () => {
      try {
        const data = await megalaService.getAll()
        setMegalaOptions(data)
      } catch (e) {
        console.error(e)
        toast.error('Failed to load committees')
      } finally {
        setLoadingMegala(false)
      }
    }
    fetchMegalas()
  }, [])

  useEffect(() => {
    if (!form.megalaId) {
      setUnitOptions([])
      return
    }
    const fetchUnits = async () => {
      setLoadingUnits(true)
      try {
        const data = await unitService.getByMegala(form.megalaId)
        setUnitOptions(data)
        setShowNewUnitInput(false)
      } catch (e) {
        console.error(e)
        toast.error('Failed to load units')
      } finally {
        setLoadingUnits(false)
      }
    }
    fetchUnits()
  }, [form.megalaId])

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
      if (!/^\d{10}$/.test(form.phone)) return 'Phone must be 10 digits'
      if (!form.megalaId) return 'Committee is required'
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
        const newUnit = await unitService.create(form.megalaId, form.newUnitName)
        finalUnitId = newUnit.id
      }

      await donorService.create({
        name: form.name,
        blood_group: form.bloodGroup,
        dob: form.dob,
        phone: form.phone,
        megala_id: form.megalaId,
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass p-10 rounded-[2.5rem] text-center space-y-8 premium-shadow"
        >
          <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center mx-auto rotate-12">
            <CheckCircle2 className="w-14 h-14 text-green-600 -rotate-12" />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-slate-900">Heroic Act!</h1>
            <p className="text-slate-600 font-medium leading-relaxed">
              You are now part of our life-saving community. Your information is securely stored and ready to help when needed.
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
                megalaId: '',
                unitId: '',
                newUnitName: '',
                lastDonation: ''
              })
            }} 
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
          >
            Register Another Donor
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-3xl px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl">
              <Image src="/images/DYFI-Logo.jpg" alt="DYFI Logo" fill className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black leading-none tracking-tight">DYFI PINARAYI</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Blood Connect</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">About</a>
            <a href="#impact" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Impact</a>
            <a href="#register" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Register</a>
          </div>
          <Button size="sm" className="rounded-xl font-bold px-5" onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}>
            Join Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={targetRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <Image 
          src="/images/DYFI-Logo.jpg" 
          alt="DYFI Logo" 
          fill 
          className="object-cover opacity-20 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              style={{ opacity, scale }}
              className="lg:col-span-7 space-y-8"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-white text-sm font-bold border-white/20"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Community Health Initiative
              </motion.div>
              
              <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter">
                Be a <span className="text-primary italic">Life Saver</span> <br />
                in Your Town.
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed">
                Connect with a community dedicated to helping others. Your blood donation is a gift of life for those in emergency need.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="h-16 px-10 rounded-2xl text-xl font-bold shadow-2xl shadow-primary/30 group"
                  onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Become a Donor
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex items-center gap-4 px-6 py-3 rounded-2xl glass-dark border-white/10">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-800">
                        <Image src={`/images/${i}.jpeg`} alt="Donor" width={40} height={40} className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-black leading-none">500+ Donors</span>
                    <span className="text-slate-400 text-xs font-bold uppercase">Already Joined</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Stats Cards */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="grid grid-cols-2 gap-6"
              >
                <div className="space-y-6 pt-12">
                  <div className="p-6 rounded-[2.5rem] glass text-slate-900 premium-shadow border-none rotate-3">
                    <Activity className="w-10 h-10 text-primary mb-4" />
                    <div className="text-4xl font-black mb-1">100%</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Free Service</div>
                  </div>
                  <div className="p-6 rounded-[2.5rem] glass text-slate-900 premium-shadow border-none -rotate-2">
                    <Clock className="w-10 h-10 text-blue-600 mb-4" />
                    <div className="text-4xl font-black mb-1">24/7</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Emergency Support</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-6 rounded-[2.5rem] glass text-slate-900 premium-shadow border-none -rotate-3">
                    <Users className="w-10 h-10 text-emerald-600 mb-4" />
                    <div className="text-4xl font-black mb-1">2.5k</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Lives Impacted</div>
                  </div>
                  <div className="p-6 rounded-[2.5rem] glass text-slate-900 premium-shadow border-none rotate-2">
                    <Award className="w-10 h-10 text-amber-600 mb-4" />
                    <div className="text-4xl font-black mb-1">8+</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Blood Groups</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Our Community <br /><span className="text-primary">Impact.</span></h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              DYFI Pinarayi Blood Connect is more than a database. It's a lifeline for hundreds of families in our block committee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Emergency Response",
                desc: "We facilitate immediate connection between donors and patients in critical conditions.",
                img: "/images/1.jpeg",
                icon: AlertCircle,
                color: "rose"
              },
              {
                title: "Voluntary Network",
                desc: "A massive network of volunteers across Pinarayi block dedicated to social welfare.",
                img: "/images/2.jpeg",
                icon: Users,
                color: "blue"
              },
              {
                title: "Verified Donors",
                desc: "All our donors are registered through local unit committees ensuring reliability.",
                img: "/images/4.jpeg",
                icon: ShieldCheck,
                color: "emerald"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative"
              >
                <div className="relative h-[400px] rounded-[3rem] overflow-hidden mb-6 premium-shadow">
                  <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white", {
                      "bg-rose-600": item.color === "rose",
                      "bg-blue-600": item.color === "blue",
                      "bg-emerald-600": item.color === "emerald",
                    })}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{item.title}</h3>
                    <p className="text-white/70 font-medium text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight">Join the <br /><span className="text-primary text-gradient">Movement.</span></h2>
                <p className="text-xl text-slate-600 font-medium leading-relaxed">
                  Fill out the form to become a registered donor. Your data is strictly confidential and used only for medical requirements.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: "Data Security", desc: "Your contact details are encrypted and hidden." },
                  { icon: Heart, title: "Purely Voluntary", desc: "Donate at your convenience, no obligations." },
                  { icon: Clock, title: "Quick Updates", desc: "Easily update your availability status." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center flex-shrink-0 premium-shadow">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-500 font-medium text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none premium-shadow rounded-[3rem] overflow-hidden bg-white">
                  <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-black mb-1">Donor Registration</CardTitle>
                      <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Step {formStep} of 2</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className={cn("w-10 h-2 rounded-full transition-all duration-500", formStep >= 1 ? "bg-primary" : "bg-slate-700")} />
                      <div className={cn("w-10 h-2 rounded-full transition-all duration-500", formStep >= 2 ? "bg-primary" : "bg-slate-700")} />
                    </div>
                  </div>

                  <CardContent className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <AnimatePresence mode="wait">
                        {formStep === 1 ? (
                          <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Full Name */}
                              <div className="space-y-3">
                                <Label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                  <User className="w-4 h-4 text-primary" />
                                  Full Name
                                </Label>
                                <div className="relative group">
                                  <Input
                                    name="name"
                                    placeholder="e.g. Rahul Das"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all text-base font-bold"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Blood Group */}
                              <div className="space-y-3">
                                <Label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                  <Droplet className="w-4 h-4 text-primary" />
                                  Blood Group
                                </Label>
                                <Select
                                  value={form.bloodGroup}
                                  onValueChange={value => setForm(prev => ({ ...prev, bloodGroup: value || '' }))}
                                >
                                  <SelectTrigger className="h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all text-base font-bold">
                                    <SelectValue placeholder="Select group" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-[1.5rem] p-2">
                                    {BLOOD_GROUPS.map(group => (
                                      <SelectItem key={group} value={group} className="rounded-xl py-3 font-bold">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-xs">
                                            {group}
                                          </div>
                                          {group}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Date of Birth */}
                              <div className="space-y-3">
                                <Label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  Date of Birth
                                </Label>
                                <Input
                                  name="dob"
                                  type="date"
                                  value={form.dob}
                                  onChange={handleChange}
                                  className="h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all text-base font-bold"
                                  required
                                />
                              </div>

                              {/* Last Donation Date */}
                              <div className="space-y-3">
                                <Label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                  <Clock className="w-4 h-4 text-primary" />
                                  Last Donation
                                </Label>
                                <Input
                                  name="lastDonation"
                                  type="date"
                                  value={form.lastDonation}
                                  onChange={handleChange}
                                  className="h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all text-base font-bold"
                                />
                              </div>
                            </div>

                            <Button 
                              type="button" 
                              onClick={nextStep}
                              className="w-full h-16 rounded-[1.25rem] text-xl font-black group"
                            >
                              Continue
                              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Phone Number */}
                              <div className="space-y-3">
                                <Label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                  <Phone className="w-4 h-4 text-primary" />
                                  Phone Number
                                </Label>
                                <Input
                                  name="phone"
                                  placeholder="e.g. 9876543210"
                                  value={form.phone}
                                  onChange={handleChange}
                                  maxLength={10}
                                  className="h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all text-base font-bold"
                                  required
                                />
                              </div>

                              {/* Committee */}
                              <div className="space-y-3">
                                <Label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  Committee
                                </Label>
                                <Select
                                  value={form.megalaId}
                                  onValueChange={value => setForm(prev => ({ ...prev, megalaId: value || '', unitId: '' }))}
                                >
                                  <SelectTrigger className="h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all text-base font-bold">
                                    <SelectValue placeholder="Select committee" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-[1.5rem] p-2">
                                    {loadingMegala ? (
                                      <div className="p-4 text-center text-slate-400">Loading...</div>
                                    ) : megalaOptions.map(opt => (
                                      <SelectItem key={opt.id} value={opt.id} className="rounded-xl py-3 font-bold">
                                        {opt.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Unit */}
                              <div className="space-y-3 md:col-span-2">
                                <Label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                  <Building2 className="w-4 h-4 text-primary" />
                                  Unit Committee
                                </Label>
                                <Select
                                  value={form.unitId}
                                  onValueChange={value => {
                                    const val = value || ''
                                    if (val === 'NEW_UNIT') {
                                      setShowNewUnitInput(true)
                                      setForm(prev => ({ ...prev, unitId: '' }))
                                    } else {
                                      setShowNewUnitInput(false)
                                      setForm(prev => ({ ...prev, unitId: val }))
                                    }
                                  }}
                                  disabled={!form.megalaId}
                                >
                                  <SelectTrigger className="h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all text-base font-bold">
                                    <SelectValue placeholder={form.megalaId ? 'Select unit' : 'Select committee first'} />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-[1.5rem] p-2">
                                    {loadingUnits ? (
                                      <div className="p-4 text-center text-slate-400">Loading...</div>
                                    ) : (
                                      <>
                                        {unitOptions.map(opt => (
                                          <SelectItem key={opt.id} value={opt.id} className="rounded-xl py-3 font-bold">
                                            {opt.name}
                                          </SelectItem>
                                        ))}
                                        <SelectItem value="NEW_UNIT" className="rounded-xl py-3 font-bold text-primary bg-primary/5">
                                          <div className="flex items-center gap-2">
                                            <Plus className="w-4 h-4" />
                                            Add New Unit
                                          </div>
                                        </SelectItem>
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {showNewUnitInput && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3"
                              >
                                <Label className="text-sm font-black text-primary uppercase tracking-wider">New Unit Name</Label>
                                <Input
                                  name="newUnitName"
                                  placeholder="e.g. Pinarayi West"
                                  value={form.newUnitName}
                                  onChange={handleChange}
                                  className="h-14 px-6 rounded-2xl bg-primary/5 border-2 border-primary/20 focus:bg-white transition-all text-base font-bold"
                                  required
                                />
                              </motion.div>
                            )}

                            <div className="flex gap-4">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={prevStep}
                                className="h-16 w-20 rounded-[1.25rem] border-2"
                              >
                                Back
                              </Button>
                              <Button 
                                type="submit" 
                                className="h-16 flex-1 rounded-[1.25rem] text-xl font-black shadow-xl shadow-primary/20"
                                disabled={submitting}
                              >
                                {submitting ? 'Registering...' : 'Register as Donor'}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </CardContent>
                  
                  <div className="bg-slate-50 p-6 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                      <ShieldCheck className="w-3 h-3" />
                      Secure Registration • DYFI Pinarayi
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Trust & Responsibility.</h2>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              We understand the sensitivity of your information. This platform is managed directly by the DYFI Pinarayi Block Committee, ensuring that your data is used exclusively for life-saving emergencies and humanitarian efforts.
            </p>
            <div className="pt-8">
              <div className="inline-flex items-center gap-6 px-10 py-5 rounded-3xl bg-slate-900 text-white premium-shadow">
                <div className="flex flex-col text-left">
                  <span className="text-2xl font-black">Need Help?</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Emergency Blood Support</span>
                </div>
                <div className="w-[1px] h-10 bg-white/20" />
                <a href="tel:+910000000000" className="text-2xl font-black hover:text-primary transition-colors">Contact Committee</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-white p-2">
                  <Image src="/images/DYFI-Logo.jpg" alt="DYFI Logo" fill className="object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black leading-none tracking-tight">DYFI PINARAYI</span>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Blood Connect</span>
                </div>
              </div>
              <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
                Building a reliable and transparent blood donation network to save lives in Pinarayi and surrounding areas.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-black mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Donor Guidelines</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-black mb-6">Connect</h4>
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-12 rounded-2xl glass-dark flex items-center justify-center hover:bg-primary transition-colors cursor-pointer border-white/5">
                    <Heart className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6">
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
              &copy; {new Date().getFullYear()} DYFI Pinarayi Block Committee.
            </p>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
              Developed for Humanity
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Submit */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <Button 
          onClick={() => {
            if (formStep === 1) nextStep()
            else document.querySelector('form')?.requestSubmit()
          }}
          className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-2xl shadow-primary/40 glass border-primary/20"
          disabled={submitting}
        >
          {submitting ? 'Registering...' : (formStep === 1 ? 'Continue Registration' : 'Complete Registration')}
        </Button>
      </div>
    </div>
  )
}
