import { createClient } from '@/utils/supabase/client'
import { Unit } from '@/types'

const supabase = createClient()

export const unitService = {
  async getAll() {
    const { data, error } = await supabase
      .from('units')
      .select('*, committees(name)')
      .order('name')
    if (error) throw error
    return data as Unit[]
  },

  async getByCommittee(committeeId: string) {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('committee_id', committeeId)
      .order('name')
    if (error) throw error
    return data as Unit[]
  },

  async create(committee_id: string, name: string) {
    const { data, error } = await supabase
      .from('units')
      .insert([{ committee_id, name }])
      .select()
    
    if (error) {
      console.error('Supabase error creating unit:', error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned from creation')
    }

    return data[0] as Unit
  },

  async update(id: string, name: string, committee_id: string) {
    const { data, error } = await supabase
      .from('units')
      .update({ name, committee_id })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Unit
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('units')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}

