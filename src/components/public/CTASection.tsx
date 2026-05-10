'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, UserPlus, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const CTASection = () => {
  return (
    <section className="py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto rounded-[4rem] bg-slate-900 overflow-hidden relative"
      >
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 px-8 py-24 md:p-24 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
              Join the Movement <br />
              of <span className="text-primary italic">Humanity.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium font-nunito leading-relaxed">
              Whether as a donor or a volunteer coordinator, your participation 
              strengthens our community's safety net.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Button 
              size="lg" 
              className="h-20 px-12 rounded-3xl text-xl font-black bg-primary hover:bg-rose-600 shadow-2xl shadow-primary/20 group"
              onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <UserPlus className="mr-3 w-6 h-6" />
              Register as Donor
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="h-20 px-12 rounded-3xl text-xl font-black border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
            >
              <Users className="mr-3 w-6 h-6" />
              Become a Volunteer
            </Button>
          </div>

          <div className="pt-8 flex flex-wrap justify-center gap-8 text-white/40 font-black text-[10px] uppercase tracking-[0.3em]">
            <span className="flex items-center gap-2">
              <Heart className="w-3 h-3 text-primary" /> Free Service
            </span>
            <span className="flex items-center gap-2">
              <Heart className="w-3 h-3 text-primary" /> 100% Volunteer Driven
            </span>
            <span className="flex items-center gap-2">
              <Heart className="w-3 h-3 text-primary" /> Public Welfare
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
