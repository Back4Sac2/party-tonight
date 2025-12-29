/**
 * 서버 사이드 Supabase 클라이언트
 * Route Handlers에서 사용
 */

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database-v2'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Supabase 타입 추론 이슈로 인해 any로 캐스팅
export const supabaseServer = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
) as any
