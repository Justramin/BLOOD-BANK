'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Droplet, Lock, Mail, ShieldCheck, Activity, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Login successful!')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-rose-600/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="flex flex-col items-center mb-10 space-y-4">
          <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center premium-shadow rotate-3">
             <div className="w-16 h-16 relative">
                <Image src="/images/DYFI-Logo.jpg" alt="DYFI Logo" fill className="object-contain" />
             </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">DYFI <span className="text-primary italic">BLOOD</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Admin Portal Access</p>
          </div>
        </div>

        <Card className="border-none premium-shadow rounded-[3rem] overflow-hidden bg-white">
          <CardHeader className="p-10 pb-4 text-center">
            <CardTitle className="text-2xl font-black tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Enter your credentials to access the management suite.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="p-10 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Administrator Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="admin@pinarayiconnect.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-14 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl font-bold text-lg transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Security Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-12 h-14 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl font-bold text-lg transition-all"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-10 pt-0">
              <Button 
                type="submit" 
                className="w-full h-16 text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 group" 
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In Now'}
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </form>
          <div className="bg-slate-50 p-6 flex items-center justify-center gap-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                SSL Secured
             </div>
             <div className="w-[1px] h-3 bg-slate-200" />
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Activity className="w-3 h-3" />
                Live Protection
             </div>
          </div>
        </Card>
        
        <div className="mt-12 text-center space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} DYFI Pinarayi Block Committee
          </p>
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            Authorized Personnel Only
          </p>
        </div>
      </motion.div>
    </div>
  )
}
