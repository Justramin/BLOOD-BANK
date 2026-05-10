'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Users, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-20 overflow-hidden bg-black">
      {/* Cinematic Background with Advanced Overlays */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src="/images/Banner Image.png"
            alt="Blood Donation Movement"
            fill
            className="object-cover opacity-60"
            priority
          />
        </motion.div>
        
        {/* Modern Dark Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        
        {/* Soft Red Glow Lighting Effects */}
        <div className="absolute top-1/4 -left-20 w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl space-y-10">
          {/* Badge/Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 text-[10px] font-black tracking-[0.3em] uppercase"
          >
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
            Humanitarian Support Network
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-[7.5rem] font-black text-white leading-[0.95] tracking-tighter"
            >
              Every <span className="text-red-600 italic">Drop</span> <br className="hidden md:block" />
              Can Save a <br className="hidden md:block" />
              Human Life.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-2xl text-gray-400 font-medium max-w-2xl leading-relaxed font-nunito"
            >
              Join the Pinarayi Block Committee's collective action for public welfare. 
              Our youth-led volunteer network is standing by to support life in emergencies.
            </motion.p>
          </div>

          {/* CTA Buttons - Mobile Optimized Stacking */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-5 pt-4"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto h-16 md:h-20 px-10 md:px-12 rounded-2xl md:rounded-3xl text-xl md:text-2xl font-black bg-red-600 hover:bg-red-700 transition-all hover:scale-105 shadow-2xl shadow-red-600/20"
              onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Become a Donor
              <ArrowRight className="ml-3 w-6 h-6 md:w-8 md:h-8" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-16 md:h-20 px-10 md:px-12 rounded-2xl md:rounded-3xl text-xl md:text-2xl font-black border-2 border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/40 transition-all"
            >
              <Users className="mr-3 w-6 h-6 md:w-7 md:h-7" />
              Join Volunteers
            </Button>
          </motion.div>

          {/* Social Proof / Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex items-center gap-6 pt-10 border-t border-white/5"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-black overflow-hidden bg-gray-800">
                  <Image 
                    src={`/images/${i === 2 ? '2.jpeg' : `${i}.jpg`}`} 
                    alt="Volunteer" 
                    width={48} 
                    height={48} 
                    className="object-cover" 
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-lg md:text-xl leading-none">1,200+</span>
                <ShieldCheck className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Active Community Members</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modern Scroll Action */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-4 opacity-30"
      >
        <span className="text-[9px] font-black text-white uppercase tracking-[0.6em]">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-red-600 via-red-600/20 to-transparent" />
      </motion.div>

      {/* Cinematic Texture Layer */}
      <div className="absolute inset-0 z-1 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} 
      />
    </section>
  )
}
