// Agreement form data — mirrors all form fields
export interface AgreementFormData {
  // Agreement details
  agrDate: string
  room: '203' | '112' | '114' | ''
  // Client / company
  company: string        // CCCCCC — always uppercase
  director: string       // DDDDDD — always uppercase
  position: 'Director' | 'Partner' | 'Proprietor' | 'Karta' | 'Trustee' | ''
  // Director personal info
  relation: 'S/O' | 'D/O' | 'W/O' | ''
  fatherName: string     // FFFFFF
  address: string        // RRRRRR
  pan: string            // PPPPPP
  mobile: string         // MMMMMM
  // Plan / fee
  planType: 'BR' | 'GST' | 'Mailing Address' | ''
  fee: string            // numeric amount only, INR prefix added in output
  hideAmount: boolean
  // NOC
  nocDate: string
  // Client contact
  clientEmail: string
  clientPhone: string
}

// Saved agreement record (from Supabase)
export interface Agreement {
  id: string
  created_at: string
  client_id: string | null
  room: string
  plan_type: string
  fee: string | null
  agr_date: string
  noc_date: string
  gdoc_url: string | null
  gdoc_id: string | null
  status: 'draft' | 'sent' | 'signed'
  created_by: string
  // joined
  client?: Client
}

// Client record (from Supabase)
export interface Client {
  id: string
  created_at: string
  name: string           // director name
  company_name: string
  email: string
  phone: string
  pan: string | null
  address: string | null
  position: string | null
  relation: string | null
  father_name: string | null
}

// Google Doc creation response
export interface GDocResult {
  success: boolean
  fileId?: string
  url?: string
  title?: string
  error?: string
}
