'use client'

import React from 'react'
import { Navbar } from '@/components/public/Navbar'
import { Hero } from '@/components/public/Hero'
import { EmergencyRequests } from '@/components/public/EmergencyRequests'
import { Campaigns } from '@/components/public/Campaigns'
import { Awareness } from '@/components/public/Awareness'
import { DonorSearch } from '@/components/public/DonorSearch'
import { VolunteerImpact } from '@/components/public/VolunteerImpact'
import { RegisterForm } from '@/components/public/RegisterForm'
import { CTASection } from '@/components/public/CTASection'
import { Footer } from '@/components/public/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <EmergencyRequests />
      <Campaigns />
      <Awareness />
      <DonorSearch />
      <VolunteerImpact />
      <RegisterForm />
      <CTASection />
      <Footer />
      
      {/* Mobile Sticky Floating Button for Urgent Situations */}
      <div className="md:hidden fixed bottom-8 right-8 z-50">
        <button 
          className="w-16 h-16 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center animate-bounce border-4 border-white"
          onClick={() => document.getElementById('emergency')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-[8px] font-black uppercase tracking-tighter">Urgent</span>
        </button>
      </div>
    </main>
  )
}
