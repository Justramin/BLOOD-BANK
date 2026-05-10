import { createClient } from '@/utils/supabase/client'
import { Donation } from '@/types'

const supabase = createClient()

export const donationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('donations')
      .select('*, donors(*, committees(name), units(name))')
      .order('donation_date', { ascending: false })
    if (error) throw error
    return data as (Donation & { donor: any })[]
  },

  async create(donation: Omit<Donation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('donations')
      .insert([donation])
      .select()
      .single()
    if (error) throw error
    return data as Donation
  }
}
