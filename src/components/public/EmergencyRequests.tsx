'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, MapPin, Building2, Phone, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const mockRequests = [
  {
    id: 1,
    bloodGroup: 'O+',
    units: 2,
    hospital: 'Pinarayi CHC',
    location: 'Pinarayi',
    urgency: 'Immediate',
    time: '10 mins ago',
    contact: '+91 98765 43210'
  },
  {
    id: 2,
    bloodGroup: 'A-',
    units: 1,
    hospital: 'Thalassery General Hospital',
    location: 'Thalassery',
    urgency: 'Within 2 Hours',
    time: '25 mins ago',
    contact: '+91 87654 32109'
  },
  {
    id: 3,
    bloodGroup: 'B+',
    units: 3,
    hospital: 'AKG Memorial Hospital',
    location: 'Kannur',
    urgency: 'Immediate',
    time: '45 mins ago',
    contact: '+91 76543 21098'
  }
]

export const EmergencyRequests = () => {
  return (
    <section id="emergency" className="py-32 bg-slate-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
          <div className="max-w-2xl space-y-6 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-black uppercase tracking-widest border border-primary/30"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live Emergency Feed
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
              Critical <br />
              <span className="text-primary italic">Requests.</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed font-nunito">
              Immediate blood requirements in our network. If you match any of these, please contact the provided number or the committee immediately.
            </p>
          </div>

          <Button size="lg" className="h-16 px-10 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-lg group shadow-2xl">
            Post Request
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockRequests.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 hover:bg-slate-800/80 transition-all hover:border-primary/50"
            >
              {/* Urgency Badge */}
              <div className="flex justify-between items-start mb-10">
                <div className="flex flex-col gap-3">
                  <div className={cn(
                    "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2",
                    req.urgency === 'Immediate' ? "bg-primary text-white animate-pulse" : "bg-amber-500/20 text-amber-500"
                  )}>
                    <AlertCircle className="w-3 h-3" />
                    {req.urgency}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {req.time}
                  </span>
                </div>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-rose-700 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-primary/20">
                  {req.bloodGroup}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">{req.units} Units Required</h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                    <Building2 className="w-4 h-4 text-primary" />
                    {req.hospital}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mt-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    {req.location}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Contact Family/Hospital</span>
                    <span className="text-white font-black text-sm">{req.contact}</span>
                  </div>
                  <Button className="w-full h-14 rounded-xl bg-primary hover:bg-rose-600 font-black text-xs uppercase tracking-widest group">
                    <Phone className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Connect Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Committee Hotline Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-10 rounded-[3rem] bg-gradient-to-r from-blue-600 to-indigo-700 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Phone className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white">Committee Emergency Hotline</h4>
              <p className="text-blue-100 font-medium">Contact us for any coordination help in emergencies.</p>
            </div>
          </div>
          <a href="tel:+910000000000" className="px-10 py-5 rounded-2xl bg-white text-blue-700 font-black text-xl hover:scale-105 transition-all">
            +91 999 000 1111
          </a>
        </motion.div>
      </div>
    </section>
  )
}
