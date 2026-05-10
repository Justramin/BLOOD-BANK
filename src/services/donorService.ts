import { createClient } from '@/utils/supabase/client'
import { Donor } from '@/types'

const supabase = createClient()

export const donorService = {
  async getAll() {
    const { data, error } = await supabase
      .from('donors')
      .select('*, committees(name), units(name)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Donor[]
  },

  async create(donor: Omit<Donor, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('donors')
      .insert([donor])
      .select()

    if (error) {
      console.error('Supabase error creating donor:', error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned from creation')
    }

    return data[0] as Donor
  },

  async update(id: string, donor: Partial<Omit<Donor, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('donors')
      .update(donor)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Donor
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('donors')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async getByPhone(phone: string) {
    const { data, error } = await supabase
      .from('donors')
      .select('*, committees(name), units(name)')
      .eq('phone', phone)
      .maybeSingle()
    if (error) throw error
    return data as Donor | null
  },

  async getStats() {
    const { data: donors, error } = await supabase
      .from('donors')
      .select('blood_group, available')

    if (error) throw error

    const stats = (donors || []).reduce((acc: any, donor) => {
      acc[donor.blood_group] = (acc[donor.blood_group] || 0) + 1
      return acc
    }, {
      'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
      'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0
    })

    const availableCount = donors.filter(d => d.available).length
    const totalCount = donors.length

    return {
      bloodGroups: stats,
      availableDonors: availableCount,
      totalDonors: totalCount
    }
  }
}
