'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Menu, X, Droplet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Campaigns', href: '#campaigns' },
  { name: 'Emergency', href: '#emergency' },
  { name: 'Donors', href: '#donors' },
  { name: 'Register', href: '#register' },
]

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "pt-4" : "pt-8"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between transition-all duration-300",
        isScrolled 
          ? "glass rounded-full px-8 py-3 shadow-2xl shadow-black/5" 
          : "bg-transparent px-2 py-0"
      )}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg group-hover:scale-110 transition-transform">
            <Image src="/Images/DYFI-Logo.jpg" alt="DYFI Logo" fill className="object-contain p-1" />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "text-xl font-black leading-none tracking-tight transition-colors",
              isScrolled ? "text-slate-900" : "text-white"
            )}>DYFI PINARAYI</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Blood Connect</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors relative group",
                isScrolled ? "text-slate-600" : "text-white/80"
              )}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button 
            className="rounded-full font-bold px-8 h-12 bg-primary hover:bg-rose-600 shadow-lg shadow-primary/20"
            onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Become a Donor
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-white bg-slate-900/20 backdrop-blur-sm rounded-xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-24 left-6 right-6 glass rounded-[2.5rem] p-8 shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-black text-slate-900 flex items-center justify-between"
                >
                  {link.name}
                  <Droplet className="w-4 h-4 text-primary" />
                </Link>
              ))}
              <Button 
                className="w-full rounded-2xl h-14 font-black text-lg mt-4"
                onClick={() => {
                  setMobileMenuOpen(false)
                  document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Join Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
