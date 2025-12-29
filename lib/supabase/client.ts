import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { isMockMode } from '@/lib/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Mock 모드가 아닐 때만 Supabase 클라이언트 생성
export const supabase = isMockMode
  ? null
  : createClient<Database>(supabaseUrl!, supabaseAnonKey!)
