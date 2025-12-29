import { supabase } from '@/lib/supabase/client'
import { Session } from '@/types'
import { Database } from '@/types/database'
import { createClient } from '@supabase/supabase-js'

function getDb() {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. This should not happen in real mode.'
    )
  }
  return supabase as ReturnType<typeof createClient<Database>>
}

export const sessionRepository = {
  /**
   * 세션을 생성합니다
   */
  async create(sessionId: string): Promise<Session> {
    const db = getDb()
    const { data, error } = await db
      .from('sessions')
      .insert({ id: sessionId })
      .select()
      .single()

    if (error) throw error
    return data as Session
  },

  /**
   * 세션을 가져옵니다 (없으면 생성)
   */
  async getOrCreate(sessionId: string): Promise<Session> {
    const db = getDb()
    const { data: existing } = await db
      .from('sessions')
      .select()
      .eq('id', sessionId)
      .single()

    if (existing) {
      // last_active_at 업데이트
      await db
        .from('sessions')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', sessionId)
      return existing as Session
    }

    return this.create(sessionId)
  },

  /**
   * 세션의 마지막 활동 시간을 업데이트합니다
   */
  async updateLastActive(sessionId: string): Promise<void> {
    const db = getDb()
    const { error } = await db
      .from('sessions')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', sessionId)

    if (error) throw error
  },
}
