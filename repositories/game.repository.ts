import { supabase } from '@/lib/supabase/client'
import { Game, GameId } from '@/types'
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

export const gameRepository = {
  /**
   * 모든 게임을 가져옵니다
   */
  async getAll(): Promise<Game[]> {
    const db = getDb()
    const { data, error } = await db
      .from('games')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Game[]
  },

  /**
   * 게임을 ID로 가져옵니다
   */
  async getById(gameId: GameId): Promise<Game | null> {
    const db = getDb()
    const { data, error } = await db
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data as Game
  },
}
