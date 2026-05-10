'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, ShieldCheck, Users, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

const stats = [
  { label: 'Active Donors', value: '1,200+', icon: Users, color: 'blue' },
  { label: 'Responses', value: '450+', icon: Activity, color: 'rose' },
  { label: 'Committees', value: '25+', icon: ShieldCheck, color: 'emerald' },
  { label: 'Lives Saved', value: '3,000+', icon: Heart, color: 'amber' },
]

export const VolunteerImpact = () => {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest"
              >
                Humanitarian Impact
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1]">
                Real Stories of <br />
                <span className="text-emerald-600 italic">Resilience.</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed font-nunito">
                "In the middle of the night, when we were desperate for O-ve blood, the DYFI volunteer network responded in 15 minutes. This platform is a blessing for our community."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-slate-900">Family of a Patient</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thalassery General Hospital</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group"
                >
                  <stat.icon className={cn(
                    "w-8 h-8 mb-4 transition-transform group-hover:scale-110",
                    stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'rose' ? 'text-rose-600' :
                        stat.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'
                  )} />
                  <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-square rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)]"
            >
              <Image src="/images/1.jpg" alt="Community Action" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12 text-white">
                <p className="text-3xl font-black mb-4">"We are not just a database; we are a community that cares."</p>
                <div className="h-1.5 w-20 bg-primary rounded-full" />
              </div>
            </motion.div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -top-10 -right-10 p-8 rounded-[2.5rem] glass bg-white/95 shadow-2xl max-w-[280px] hidden md:block"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-slate-900">Verified</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Safety First</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                All donors are verified through physical unit committee visits to ensure reliability and trust.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
