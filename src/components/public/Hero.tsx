'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Activity, Users, Clock, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-950">
      {/* Background with Emotional Imagery */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/2.jpeg"
          alt="Humanitarian Support"
          fill
          className="object-cover opacity-60 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
              <span className="uppercase tracking-[0.2em]">Volunteer Driven Humanitarian Movement</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-black text-white leading-[1.05] tracking-tighter"
            >
              Every <span className="text-primary italic">Drop</span> <br />
              Can Save a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">Human Life.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed font-nunito"
            >
              Join the Pinarayi Block Committee's collective action for public welfare.
              Our youth-led volunteer network is standing by to support life in emergencies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:row gap-6 pt-4"
            >
              <Button
                size="lg"
                className="h-20 px-12 rounded-3xl text-2xl font-black shadow-[0_20px_50px_rgba(239,68,68,0.3)] group bg-primary hover:bg-rose-600 border-none transition-all hover:scale-105"
                onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Become a Life Saver
                <ArrowRight className="ml-3 w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </Button>

              <div className="flex items-center gap-5 px-8 py-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
                <div className="flex -space-x-4">
                  {['1.jpg', '2.jpeg', '3.jpg', '4.jpg'].map((img, i) => (
                    <div key={i} className="w-12 h-12 rounded-2xl border-4 border-slate-900 overflow-hidden bg-slate-800 shadow-xl">
                      <Image src={`/images/${img}`} alt="Volunteer" width={48} height={48} className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-xl leading-none">1,200+</span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Volunteers</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating Stats Cards */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="grid grid-cols-2 gap-8 perspective-1000">
              <motion.div
                initial={{ opacity: 0, y: 50, rotate: -5 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="space-y-8 pt-16"
              >
                <div className="p-8 rounded-[3rem] glass bg-white/95 text-slate-900 shadow-2xl border-none">
                  <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-5xl font-black mb-1 tracking-tight">500+</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Emergency Responses</div>
                </div>

                <div className="p-8 rounded-[3rem] glass bg-white/95 text-slate-900 shadow-2xl border-none">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-5xl font-black mb-1 tracking-tight">24/7</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Ready Support</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50, rotate: 5 }}
                animate={{ opacity: 1, y: 0, rotate: 3 }}
                transition={{ delay: 1, duration: 1 }}
                className="space-y-8"
              >
                <div className="p-8 rounded-[3rem] glass bg-white/95 text-slate-900 shadow-2xl border-none">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <Users className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="text-5xl font-black mb-1 tracking-tight">2,800</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Hearts Touched</div>
                </div>

                <div className="p-8 rounded-[3rem] glass bg-white/95 text-slate-900 shadow-2xl border-none">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <Heart className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="text-5xl font-black mb-1 tracking-tight">150+</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Life Lines Camps</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Decorative Elements */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50"
      >
        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Scroll Down</span>
        <div className="w-px h-16 bg-gradient-to-b from-primary via-white/20 to-transparent" />
      </motion.div>
    </section>
  )
}
