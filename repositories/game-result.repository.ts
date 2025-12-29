import { supabase } from '@/lib/supabase/client'
import { GameResult, SessionId, GameId, TagId } from '@/types'
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

export const gameResultRepository = {
  /**
   * 게임 결과를 생성합니다
   */
  async create(
    sessionId: SessionId,
    gameId: GameId,
    winnerName: string
  ): Promise<GameResult> {
    const db = getDb()
    // @ts-expect-error - Supabase 타입 추론 이슈
    const { data, error } = await db
      .from('game_results')
      .insert({
        session_id: sessionId,
        game_id: gameId,
        winner_name: winnerName,
      })
      .select()
      .single()

    if (error) throw error
    return data as GameResult
  },

  /**
   * 게임 결과에 태그 선택을 저장합니다
   */
  async selectTag(gameResultId: string, tagId: TagId): Promise<void> {
    const db = getDb()
    // @ts-expect-error - Supabase 타입 추론 이슈
    const { error } = await db.from('tag_selections').insert({
      game_result_id: gameResultId,
      tag_id: tagId,
    })

    if (error) throw error
  },

  /**
   * 세션의 모든 게임 결과를 가져옵니다
   */
  async getBySession(sessionId: SessionId): Promise<GameResult[]> {
    const db = getDb()
    const { data, error } = await db
      .from('game_results')
      .select('*')
      .eq('session_id', sessionId)
      .order('played_at', { ascending: false })

    if (error) throw error
    return data as GameResult[]
  },
}
