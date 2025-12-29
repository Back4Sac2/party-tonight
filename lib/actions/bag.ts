'use server'

import { supabaseServer } from '@/lib/supabase/server-client'
import { getCurrentUserId } from '@/lib/auth/session'

export interface BagGift {
  id: string
  tag: string
  name: string
  description: string | null
  message: string | null
  revealed: boolean
  created_at: string
}

export async function getBagGifts(): Promise<BagGift[]> {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('로그인이 필요합니다.')
  }

  const { data, error } = await supabaseServer
    .from('gifts')
    .select('*')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as BagGift[]
}

export async function openGift(id: string): Promise<BagGift> {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('로그인이 필요합니다.')
  }

  // 받은 선물인지 확인
  const { data: gift, error: fetchError } = await supabaseServer
    .from('gifts')
    .select('*')
    .eq('id', id)
    .eq('recipient_id', userId)
    .single()

  if (fetchError || !gift) {
    throw new Error('선물을 찾을 수 없거나 권한이 없습니다.')
  }

  // 이미 열린 선물인지 확인
  if ((gift as any).revealed) {
    return gift as BagGift
  }

  // 선물 공개
  const { data: updatedGift, error: updateError } = await supabaseServer
    .from('gifts')
    .update({ revealed: true })
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    throw new Error(updateError.message)
  }

  return updatedGift as BagGift
}
