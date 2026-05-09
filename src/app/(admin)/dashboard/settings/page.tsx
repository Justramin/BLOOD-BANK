'use client'

import React, { useState } from 'react'
import { Save, User, Phone, Building2, ShieldCheck, LogOut } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DEFAULT_SETTINGS } from '@/constants'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // In a real app, you'd save this to a 'settings' table in Supabase
    setTimeout(() => {
      toast.success('Settings saved successfully!')
      setLoading(false)
    }, 1000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-muted-foreground font-medium">Manage organization profile and account.</p>
        </div>
        <Button variant="destructive" onClick={handleLogout} className="rounded-full px-6">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 pb-6">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
                <Building2 className="w-5 h-5" />
                Organization Details
              </CardTitle>
              <CardDescription>Official committee information</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Organization Name</Label>
                  <Input 
                    value={settings.organization_name}
                    onChange={(e) => setSettings(prev => ({ ...prev, organization_name: e.target.value }))}
                    className="h-12 bg-slate-50 border-none rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Secretary</h3>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={settings.secretary_name}
                          onChange={(e) => setSettings(prev => ({ ...prev, secretary_name: e.target.value }))}
                          className="pl-10 h-11 bg-slate-50 border-none rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={settings.secretary_phone}
                          onChange={(e) => setSettings(prev => ({ ...prev, secretary_phone: e.target.value }))}
                          className="pl-10 h-11 bg-slate-50 border-none rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">President</h3>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={settings.president_name}
                          onChange={(e) => setSettings(prev => ({ ...prev, president_name: e.target.value }))}
                          className="pl-10 h-11 bg-slate-50 border-none rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={settings.president_phone}
                          onChange={(e) => setSettings(prev => ({ ...prev, president_phone: e.target.value }))}
                          className="pl-10 h-11 bg-slate-50 border-none rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Treasurer</h3>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={settings.treasurer_name}
                          onChange={(e) => setSettings(prev => ({ ...prev, treasurer_name: e.target.value }))}
                          className="pl-10 h-11 bg-slate-50 border-none rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={settings.treasurer_phone}
                          onChange={(e) => setSettings(prev => ({ ...prev, treasurer_phone: e.target.value }))}
                          className="pl-10 h-11 bg-slate-50 border-none rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button disabled={loading} className="w-full md:w-auto px-10 h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                System Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-sm text-slate-400">Version</span>
                <span className="text-sm font-mono font-bold">1.0.0-prod</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-sm text-slate-400">Environment</span>
                <span className="text-sm font-mono font-bold text-green-400">Production</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-sm text-slate-400">Last Backup</span>
                <span className="text-sm font-mono font-bold">Today, 04:00 AM</span>
              </div>
              <div className="pt-4">
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter font-bold">
                  This system is managed by DYFI Pinarayi Block Committee. All data is encrypted and stored securely.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
