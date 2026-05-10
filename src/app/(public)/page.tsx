'use client'

import React from 'react'
import { Navbar } from '@/components/public/Navbar'
import { Hero } from '@/components/public/Hero'
import { Campaigns } from '@/components/public/Campaigns'
import { Awareness } from '@/components/public/Awareness'
import { RegisterForm } from '@/components/public/RegisterForm'
import { CTASection } from '@/components/public/CTASection'
import { Footer } from '@/components/public/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Campaigns />
      <Awareness />
      <RegisterForm />
      <CTASection />
      <Footer />
    </main>
  )
}
