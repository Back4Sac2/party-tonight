import { supabase } from '@/lib/supabase/client'
import { Gift, GiftId, SessionId, TagId } from '@/types'
import { Database } from '@/types/database'
import { createClient } from '@supabase/supabase-js'

function getDb() {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. This should not happen in real mode.'
    )
  }
  // Supabase 타입 추론 이슈로 인해 any로 캐스팅
  return supabase as any
}

export const giftRepository = {
  /**
   * 세션의 모든 선물을 가져옵니다
   */
  async getBySession(sessionId: SessionId): Promise<Gift[]> {
    const db = getDb()
    const { data, error } = await db
      .from('gifts')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Gift[]
  },

  /**
   * 선물을 생성합니다
   */
  async create(
    sessionId: SessionId,
    gift: {
      name: string
      description?: string
      image_url?: string
    }
  ): Promise<Gift> {
    const db = getDb()
    const { data, error } = await db
      .from('gifts')
      .insert({
        session_id: sessionId,
        ...gift,
      })
      .select()
      .single()

    if (error) throw error
    return data as Gift
  },

  /**
   * 선물을 업데이트합니다
   */
  async update(
    giftId: GiftId,
    updates: Partial<Pick<Gift, 'name' | 'description' | 'image_url'>>
  ): Promise<Gift> {
    const db = getDb()
    const { data, error } = await db
      .from('gifts')
      .update(updates)
      .eq('id', giftId)
      .select()
      .single()

    if (error) throw error
    return data as Gift
  },

  /**
   * 선물을 삭제합니다
   */
  async delete(giftId: GiftId): Promise<void> {
    const db = getDb()
    const { error } = await db.from('gifts').delete().eq('id', giftId)

    if (error) throw error
  },

  /**
   * 선물에 태그를 추가합니다
   */
  async addTag(giftId: GiftId, tagId: TagId): Promise<void> {
    const db = getDb()
    const { error } = await db
      .from('gift_tags')
      .insert({ gift_id: giftId, tag_id: tagId })

    if (error) throw error
  },

  /**
   * 선물에서 태그를 제거합니다
   */
  async removeTag(giftId: GiftId, tagId: TagId): Promise<void> {
    const db = getDb()
    const { error } = await db
      .from('gift_tags')
      .delete()
      .eq('gift_id', giftId)
      .eq('tag_id', tagId)

    if (error) throw error
  },

  /**
   * 선물의 모든 태그를 가져옵니다
   */
  async getTags(giftId: GiftId): Promise<TagId[]> {
    const db = getDb()
    const { data, error } = await db
      .from('gift_tags')
      .select('tag_id')
      .eq('gift_id', giftId)

    if (error) throw error
    return (data as any[]).map(item => item.tag_id)
  },

  /**
   * 선물을 획득 처리합니다
   */
  async claim(giftId: GiftId, winnerName: string): Promise<Gift> {
    const db = getDb()
    const { data, error } = await db
      .from('gifts')
      .update({
        is_claimed: true,
        claimed_by: winnerName,
        claimed_at: new Date().toISOString(),
      })
      .eq('id', giftId)
      .select()
      .single()

    if (error) throw error
    return data as Gift
  },

  /**
   * 태그로 선물을 필터링합니다
   */
  async getByTag(sessionId: SessionId, tagId: TagId): Promise<Gift[]> {
    const db = getDb()
    // 먼저 해당 태그와 연결된 선물 ID들을 가져옵니다
    const { data: giftTags, error: giftTagsError } = await db
      .from('gift_tags')
      .select('gift_id')
      .eq('tag_id', tagId)

    if (giftTagsError) throw giftTagsError

    if (!giftTags || giftTags.length === 0) {
      return []
    }

    const giftIds = (giftTags as any[]).map(gt => gt.gift_id)

    // 해당 선물들을 가져옵니다
    const { data, error } = await db
      .from('gifts')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_claimed', false)
      .in('id', giftIds)

    if (error) throw error
    return data as Gift[]
  },
}
