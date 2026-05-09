'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Droplet,
  Building2,
  Heart,
  Activity,
  ShieldCheck,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { motion } from 'framer-motion'
import Image from 'next/image'

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Committees', href: '/dashboard/committees', icon: MapPin },
  { name: 'Units', href: '/dashboard/units', icon: Building2 },
  { name: 'Donors', href: '/dashboard/donors', icon: Users },
  { name: 'System Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const SidebarContent = ({ className, isMobile = false }: { className?: string, isMobile?: boolean }) => (
    <div className={cn("flex flex-col h-full bg-white lg:bg-slate-50/30 backdrop-blur-xl border-r border-slate-100", className)}>
      {/* Brand Section */}
      <div className="p-8 pb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 relative shadow-xl shadow-primary/10 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Image src="/images/DYFI-Logo.jpg" alt="DYFI Logo" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black leading-tight tracking-tighter text-slate-900">DYFI <span className="text-primary italic">BLOOD</span></span>
            <span className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <div className="px-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Management</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setIsOpen(false)}
              className={cn(
                "group flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20 translate-x-1" 
                  : "text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-lg hover:shadow-slate-200/50"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-500 group-hover:scale-110",
                  isActive ? "text-primary" : "text-slate-400 group-hover:text-primary"
                )} />
                <span className="font-bold tracking-tight">{item.name}</span>
              </div>
              {isActive && (
                <motion.div layoutId="active-indicator">
                  <ChevronRight className="w-4 h-4 text-primary" />
                </motion.div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer Support Card */}
      <div className="p-6">
        <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-4 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-black tracking-tight">Need Support?</div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Emergency Developer <br />Assistance
              </p>
            </div>
            <Button size="sm" variant="outline" className="w-full rounded-xl bg-white/5 border-white/10 hover:bg-white hover:text-slate-900 font-bold h-9 text-[10px] uppercase tracking-widest">
              Contact Dev
            </Button>
          </div>
        </div>
        
        <Link 
          href="/"
          className="mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-600 transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative shadow-lg shadow-primary/10">
            <Image src="/images/DYFI-Logo.jpg" alt="DYFI Logo" fill className="object-contain" />
          </div>
          <span className="font-black text-slate-900 tracking-tighter">DYFI <span className="text-primary">BLOOD</span></span>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="rounded-2xl bg-slate-50 w-12 h-12" />}>
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 border-none">
            <SidebarContent className="border-none" isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
