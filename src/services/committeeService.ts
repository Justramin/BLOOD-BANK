import { createClient } from '@/utils/supabase/client'
import { Committee } from '@/types'

const supabase = createClient()

export const committeeService = {
  async getAll() {
    const { data, error } = await supabase
      .from('committees')
      .select('*, units(count)')
      .order('name')
    if (error) throw error
    return data as Committee[]
  },

  async create(name: string) {
    console.log('DEBUG: Attempting to insert into table "committees" with name:', name)
    const { data, error } = await supabase
      .from('committees')
      .insert([{ name }])
      .select()
    
    if (error) {
      console.error('DEBUG: Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }
    
    console.log('DEBUG: Insertion successful, returned data:', data)
    
    if (!data || data.length === 0) {
      throw new Error('No data returned from creation - check RLS policies')
    }
    
    return data[0] as Committee
  },

  async update(id: string, name: string) {
    const { data, error } = await supabase
      .from('committees')
      .update({ name })
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0] as Committee
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('committees')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}

