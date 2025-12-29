/**
 * Supabase 연결 테스트 유틸리티
 * 개발 환경에서 연결 상태를 확인할 때 사용
 */

import { supabase } from './client'
import { isMockMode } from '@/lib/config'

export async function testSupabaseConnection() {
  if (isMockMode) {
    console.warn(
      '⚠️ Mock mode is enabled. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to use real Supabase.'
    )
    return { success: false, message: 'Mock mode enabled' }
  }

  if (!supabase) {
    console.error('❌ Supabase client is not initialized')
    return { success: false, message: 'Supabase client not initialized' }
  }

  try {
    // 간단한 쿼리로 연결 테스트
    const { data, error } = await supabase
      .from('games')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Supabase connection error:', error)
      return { success: false, message: error.message, error }
    }

    console.log('✅ Supabase connection successful!')
    return { success: true, message: 'Connected to Supabase' }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
    }
  }
}

// 게임 데이터 확인
export async function checkGamesData() {
  if (isMockMode || !supabase) {
    return { count: 0, games: [] }
  }

  try {
    const { data, error } = await supabase.from('games').select('*').limit(10)

    if (error) {
      console.error('❌ Failed to fetch games:', error)
      return { count: 0, games: [], error }
    }

    console.log(`✅ Found ${data?.length || 0} games in database`)
    return { count: data?.length || 0, games: data || [] }
  } catch (error) {
    console.error('❌ Error checking games:', error)
    return { count: 0, games: [], error }
  }
}
