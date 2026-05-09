export type Committee = {
  id: string
  name: string
  created_at: string
  updated_at?: string
  units?: { count: number }[]
}


export type Unit = {
  id: string
  committee_id: string
  name: string
  created_at: string
  updated_at?: string
  committees?: Committee
}

export type Donor = {
  id: string
  committee_id: string
  unit_id: string
  name: string
  blood_group: string
  dob: string
  phone: string
  last_blood_donating_date: string | null
  available: boolean
  created_at: string
  updated_at?: string
  committees?: Committee
  units?: Unit
}

export type OrganizationSettings = {
  organization_name: string
  secretary_name: string
  secretary_phone: string
  president_name: string
  president_phone: string
  treasurer_name: string
  treasurer_phone: string
}

export type BloodGroupStats = {
  [key: string]: number
}

