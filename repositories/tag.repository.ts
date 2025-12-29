import { supabase } from '@/lib/supabase/client'
import { Tag, TagId, SessionId } from '@/types'
import { Database } from '@/types/database'
import { createClient } from '@supabase/supabase-js'

function getDb() {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. This should not happen in real mode.')
  }
  return supabase as ReturnType<typeof createClient<Database>>
}

export const tagRepository = {
  /**
   * 세션의 모든 태그를 가져옵니다
   */
  async getBySession(sessionId: SessionId): Promise<Tag[]> {
    const db = getDb()
    const { data, error } = await db
      .from('tags')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Tag[]
  },

  /**
   * 태그를 생성합니다
   */
  async create(
    sessionId: SessionId,
    tag: {
      name: string
      color?: string
    }
  ): Promise<Tag> {
    const db = getDb()
    const { data, error } = await db
      .from('tags')
      .insert({
        session_id: sessionId,
        ...tag,
      })
      .select()
      .single()

    if (error) throw error
    return data as Tag
  },

  /**
   * 태그를 업데이트합니다
   */
  async update(
    tagId: TagId,
    updates: Partial<Pick<Tag, 'name' | 'color'>>
  ): Promise<Tag> {
    const db = getDb()
    const { data, error } = await db
      .from('tags')
      .update(updates)
      .eq('id', tagId)
      .select()
      .single()

    if (error) throw error
    return data as Tag
  },

  /**
   * 태그를 삭제합니다
   */
  async delete(tagId: TagId): Promise<void> {
    const db = getDb()
    const { error } = await db.from('tags').delete().eq('id', tagId)

    if (error) throw error
  },
}
