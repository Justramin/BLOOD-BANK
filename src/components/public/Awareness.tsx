'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const posters = [
  '/Images/Poster1.jpg',
  '/Images/Poster2.jpg',
  '/Images/Poster3.jpg',
  '/Images/Poster4.jpg',
  '/Images/Poster5.jpg',
  '/Images/Poster6.jpg',
  '/Images/Poster7.jpg',
  '/Images/Poster8.jpg',
]

export const Awareness = () => {
  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl"
          >
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900">
            Donate Blood. <br />
            <span className="text-primary italic">Share Life.</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed font-nunito">
            A small contribution from you can mean a lifetime of happiness for someone else. 
            Explore our awareness posters and share them to inspire others.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {posters.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
              className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 group cursor-pointer"
            >
              <Image 
                src={src} 
                alt={`Awareness Poster ${i + 1}`} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="px-6 py-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                  Full View
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
    </section>
  )
}
