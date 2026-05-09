'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Search, 
  Droplet,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Activity,
  Heart,
  ShieldCheck,
  AlertCircle,
  Settings,
  User
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { donorService } from '@/services/donorService'
import { committeeService } from '@/services/committeeService'
import { unitService } from '@/services/unitService'
import { BLOOD_GROUPS } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({ committees: 0, units: 0 })

  useEffect(() => {
    async function loadData() {
      try {
        const [donorStats, committees, units] = await Promise.all([
          donorService.getStats(),
          committeeService.getAll(),
          unitService.getAll()
        ])
        setStats(donorStats)
        setCounts({
          committees: committees.length,
          units: units.length
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const StatCard = ({ title, value, icon: Icon, color, description, trend }: any) => (
    <Card className="border-none premium-shadow hover:scale-[1.02] transition-all duration-500 group overflow-hidden relative bg-white">
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full transition-transform duration-700 group-hover:scale-150 opacity-10",
        color === 'primary' ? "bg-primary" : "bg-slate-400"
      )} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className={cn(
          "p-3 rounded-2xl transition-all duration-500 group-hover:rotate-12",
          color === 'primary' ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600"
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-black tracking-tighter text-slate-900">{value}</div>
          {trend && <span className="text-[10px] font-bold text-emerald-600">+{trend}%</span>}
        </div>
        <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-8 p-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-[2rem]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[400px] w-full rounded-[2.5rem]" />
          <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <Activity className="w-3 h-3" />
            Live Overview
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Admin <span className="text-primary italic">Dashboard</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-2" render={<Link href="/dashboard/settings" />}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button className="rounded-2xl h-12 px-6 font-bold shadow-xl shadow-primary/20" render={<Link href="/dashboard/donors" />}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Donor
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard 
          title="Total Donors" 
          value={stats?.totalDonors || 0} 
          icon={Users} 
          color="primary"
          description="Overall registered donors in the system"
          trend={12}
        />
        <StatCard 
          title="Active Committees" 
          value={counts.committees} 
          icon={MapPin} 
          color="slate"
          description="Committees under Pinarayi block"
        />
        <StatCard 
          title="Unit Committees" 
          value={counts.units} 
          icon={Building2} 
          color="slate"
          description="Total active units registered"
        />
        <StatCard 
          title="Available Now" 
          value={stats?.availableDonors || 0} 
          icon={CheckCircle2} 
          color="primary"
          description="Donors ready for emergency donation"
        />
      </motion.div>


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Blood Group Distribution */}
        <Card className="lg:col-span-2 border-none premium-shadow overflow-hidden rounded-[2.5rem] bg-white">
          <CardHeader className="bg-slate-50/50 pb-8 pt-10 px-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Droplet className="w-6 h-6 text-primary fill-current" />
                  Blood Inventory
                </CardTitle>
                <CardDescription className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Current availability by group</CardDescription>
              </div>
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {BLOOD_GROUPS.map((group) => (
                <div 
                  key={group} 
                  className="flex flex-col items-center p-6 rounded-[2rem] bg-slate-50 hover:bg-white hover:scale-105 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 border-2 border-transparent hover:border-primary/10 group cursor-default"
                >
                  <span className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors mb-1">{group}</span>
                  <span className="text-lg font-black text-slate-400 group-hover:text-slate-900 transition-colors">{stats?.bloodGroups[group] || 0}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-black mt-1">Donors</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Search Card */}
        <Card className="border-none premium-shadow rounded-[2.5rem] overflow-hidden flex flex-col bg-slate-900 text-white group">
          <CardHeader className="pb-8 pt-10 px-10 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10 space-y-1">
              <CardTitle className="text-2xl font-black flex items-center gap-2">
                <Search className="w-6 h-6 text-primary" />
                Quick Search
              </CardTitle>
              <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Locate emergency donors fast</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-10 pb-10 pt-4 flex-1 flex flex-col justify-between space-y-8 relative z-10">
            <div className="space-y-4">
              <p className="text-slate-400 font-medium text-sm leading-relaxed">
                Enter a blood group or location to filter donors who are currently available.
              </p>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-primary" />
                <Input 
                  placeholder="e.g. O+ve or Pinarayi..." 
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary/50 transition-all text-white placeholder:text-slate-600 font-bold" 
                />
              </div>
            </div>
            <div className="space-y-4">
              <Button render={<Link href="/dashboard/donors" />} className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                Search Database
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center justify-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Verified Results
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="border-none premium-shadow rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-50 px-10 py-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Actions
                </CardTitle>
                <CardDescription className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Latest system updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm" render={<Link href="/dashboard/donors" />} className="text-primary font-black hover:bg-primary/5 rounded-xl px-4">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900">New Donor Registered</div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">A+ve • Pinarayi Unit</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">2h ago</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health / Support */}
        <Card className="border-none premium-shadow rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="px-10 py-8">
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              System Trust
            </CardTitle>
          </CardHeader>
          <CardContent className="px-10 pb-10 space-y-6">
            <div className="p-6 rounded-[2rem] bg-emerald-50 border-2 border-emerald-100/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <AlertCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="font-black text-emerald-900">All Systems Operational</div>
              </div>
              <p className="text-sm font-medium text-emerald-700 leading-relaxed">
                Database is synchronized with Supabase. Backups are scheduled daily at midnight.
              </p>
            </div>
            <div className="flex items-center gap-4 px-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                    <Image src={`/images/${i}.jpeg`} alt="Admin" width={40} height={40} className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Admin Support</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available 24/7</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
