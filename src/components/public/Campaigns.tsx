'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users } from 'lucide-react'

const campaigns = [
  {
    id: 1,
    title: 'Mega Blood Donation Camp',
    location: 'Pinarayi Public Library Hall',
    date: 'Oct 15, 2025',
    volunteers: '45+',
    image: '/Images/1.jpeg',
    category: 'Donation Camp'
  },
  {
    id: 2,
    title: 'Youth Awareness Program',
    location: 'Block Committee Office',
    date: 'Nov 02, 2025',
    volunteers: '120+',
    image: '/Images/3.jpeg',
    category: 'Awareness'
  },
  {
    id: 3,
    title: 'Emergency Response Drill',
    location: 'Town Center',
    date: 'Dec 10, 2025',
    volunteers: '60+',
    image: '/Images/4.jpeg',
    category: 'Training'
  },
  {
    id: 4,
    title: 'Community Outreach',
    location: 'Unit Committees',
    date: 'Ongoing',
    volunteers: '200+',
    image: '/Images/5.jpeg',
    category: 'Service'
  }
]

export const Campaigns = () => {
  return (
    <section id="campaigns" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest"
            >
              Our Movement
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none">
              Community <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-600">Campaigns.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed font-nunito">
              Witness the power of collective community action. Our campaigns are built on the spirit of volunteerism and public service.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pb-2"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-14 h-14 rounded-full border-4 border-white overflow-hidden bg-slate-200">
                  <Image src={`/Images/${i}.jpeg`} alt="Volunteer" width={56} height={56} className="object-cover" />
                </div>
              ))}
              <div className="w-14 h-14 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                +1k
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-4 text-center">Join our 1,200+ volunteers</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {campaigns.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative h-[500px] rounded-[3rem] overflow-hidden premium-shadow"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute top-6 left-6">
                <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
                  {item.category}
                </span>
              </div>

              <div className="absolute bottom-8 left-8 right-8 space-y-4">
                <h3 className="text-2xl font-black text-white leading-tight">{item.title}</h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold">{item.volunteers} Volunteers Joined</span>
                  </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black text-sm uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Background Text */}
      <div className="absolute -bottom-10 -right-20 text-[15rem] font-black text-slate-50 select-none -z-10 tracking-tighter opacity-50">
        VOLUNTEER
      </div>
    </section>
  )
}
