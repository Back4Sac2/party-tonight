import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database-v2'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase 클라이언트 생성
// Supabase 타입 추론 이슈로 인해 any로 캐스팅
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? (createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
      }) as any)
    : null
