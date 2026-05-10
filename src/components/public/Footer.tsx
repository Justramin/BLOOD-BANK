'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Globe, Shield, Info, Mail, Phone, MapPin } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-white pt-32 pb-12 relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-10">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative w-16 h-16 overflow-hidden rounded-2xl bg-white p-2 shadow-2xl border border-slate-100 group-hover:scale-110 transition-transform">
                <Image src="/Images/DYFI-Logo.jpg" alt="DYFI Logo" fill className="object-contain p-1.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black leading-none tracking-tight text-slate-900">DYFI PINARAYI</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Blood Connect</span>
              </div>
            </Link>
            
            <p className="text-xl text-slate-500 font-medium leading-relaxed font-nunito max-w-md">
              A humanitarian volunteer-driven platform built for public welfare through collective participation. 
              Saving lives, one drop at a time.
            </p>

            <div className="flex gap-4">
              {[Globe, Shield, Info, Mail].map((Icon, i) => (
                <button key={i} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-8">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Platform</h4>
              <ul className="space-y-4">
                {['Home', 'Campaigns', 'Register'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-slate-500 font-bold hover:text-primary transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Resources</h4>
              <ul className="space-y-4">
                {['Donor Guidelines', 'Health Tips', 'Volunteer FAQs', 'Committee Rules'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-slate-500 font-bold hover:text-primary transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8 col-span-2 md:col-span-1">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Contact</h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-slate-500 font-bold text-sm">Pinarayi Block Committee Office, Kannur</span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-slate-500 font-black text-sm">+91 999 000 1111</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>&copy; {new Date().getFullYear()} DYFI Pinarayi Block Committee</span>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
          
          <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100">
            <Heart className="w-3 h-3 text-primary fill-primary" />
            Built for public welfare through collective volunteer participation
          </div>
        </div>
      </div>
    </footer>
  )
}
