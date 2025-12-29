'use server'

import { supabaseServer } from '@/lib/supabase/server-client'
import { getCurrentUserId } from '@/lib/auth/session'
import { isAdmin, canEditGift, canDeleteGift } from '@/lib/auth/permissions'

export interface Gift {
  id: string
  owner_id: string
  tag: string
  name: string
  description: string | null
  message: string | null
  revealed: boolean
  recipient_id: string | null
  created_at: string
}

export async function getGifts(all?: boolean): Promise<Gift[]> {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('로그인이 필요합니다.')
  }

  const admin = await isAdmin()

  if (admin && all) {
    const { data, error } = await supabaseServer
      .from('gifts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return (data || []) as Gift[]
  }

  const { data, error } = await supabaseServer
    .from('gifts')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as Gift[]
}

export async function getGift(id: string): Promise<Gift | null> {
  const { data, error } = await supabaseServer
    .from('gifts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Gift | null
}

export async function createGift(
  tag: string,
  name: string,
  description?: string | null,
  message?: string | null
): Promise<Gift> {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('로그인이 필요합니다.')
  }

  if (!tag || !name) {
    throw new Error('태그와 선물명은 필수입니다.')
  }

  const { data, error } = await supabaseServer
    .from('gifts')
    .insert({
      owner_id: userId,
      tag,
      name,
      description: description || null,
      message: message || null,
      revealed: false,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Gift
}

export async function updateGift(
  id: string,
  tag: string,
  name: string,
  description?: string | null,
  message?: string | null
): Promise<Gift> {
  const canEdit = await canEditGift(id)
  if (!canEdit) {
    throw new Error('수정 권한이 없습니다.')
  }

  const { data, error } = await supabaseServer
    .from('gifts')
    .update({
      tag: tag || undefined,
      name: name || undefined,
      description: description !== undefined ? description : undefined,
      message: message !== undefined ? message : undefined,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Gift
}

export async function deleteGift(id: string): Promise<void> {
  const canDelete = await canDeleteGift(id)
  if (!canDelete) {
    throw new Error('삭제 권한이 없습니다.')
  }

  const { error } = await supabaseServer.from('gifts').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}
