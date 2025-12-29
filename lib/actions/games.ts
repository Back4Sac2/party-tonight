'use server'

import { supabaseServer } from '@/lib/supabase/server-client'
import { getCurrentUserId } from '@/lib/auth/session'
import { canManageGame } from '@/lib/auth/permissions'

export interface Game {
  id: string
  name: string
  description: string
  tag: string | null
  creator_id: string | null
  created_at: string
}

export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabaseServer
    .from('games')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as Game[]
}

export async function getGame(id: string): Promise<Game | null> {
  const { data, error } = await supabaseServer
    .from('games')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Game | null
}

export async function createGame(
  name: string,
  description: string,
  tag?: string | null
): Promise<Game> {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('로그인이 필요합니다.')
  }

  if (!name || !description) {
    throw new Error('게임명과 설명은 필수입니다.')
  }

  const { data, error } = await supabaseServer
    .from('games')
    .insert({
      name,
      description,
      tag: tag || null,
      creator_id: userId,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Game
}

export async function updateGame(
  id: string,
  name: string,
  description: string,
  tag?: string | null
): Promise<Game> {
  const canManage = await canManageGame(id)
  if (!canManage) {
    throw new Error('게임 수정 권한이 없습니다.')
  }

  const { data, error } = await supabaseServer
    .from('games')
    .update({
      name,
      description,
      tag: tag !== undefined ? tag : undefined,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Game
}

export async function deleteGame(id: string): Promise<void> {
  const canManage = await canManageGame(id)
  if (!canManage) {
    throw new Error('게임 삭제 권한이 없습니다.')
  }

  const { error } = await supabaseServer.from('games').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}
