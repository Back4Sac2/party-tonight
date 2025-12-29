import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { isMockMode } from '@/lib/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Mock 모드가 아닐 때만 Supabase 클라이언트 생성
// Supabase 타입 추론 이슈로 인해 any로 캐스팅
export const supabase = isMockMode
  ? null
  : (createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false, // 비로그인 환경이므로 세션 저장 안 함
      },
    }) as any)
