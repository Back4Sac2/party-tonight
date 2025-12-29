/**
 * 권한 체크 유틸리티
 */

import { getCurrentUserId } from './session'
import { supabaseServer } from '@/lib/supabase/server-client'

export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  name: string
  role: UserRole
  created_at: string
}

/**
 * 현재 로그인된 유저 정보 가져오기
 */
export async function getCurrentUser(): Promise<User | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null

  const { data, error } = await supabaseServer
    .from('users')
    .select('id, name, role, created_at')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as User
}

/**
 * 관리자 권한 확인
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}

/**
 * 선물 소유자 확인
 */
export async function isGiftOwner(giftId: string): Promise<boolean> {
  const userId = await getCurrentUserId()
  if (!userId) return false

  const { data, error } = await supabaseServer
    .from('gifts')
    .select('owner_id')
    .eq('id', giftId)
    .single()

  if (error || !data) return false
  return data.owner_id === userId
}

/**
 * 권한 체크 (소유자 또는 관리자)
 */
export async function canEditGift(giftId: string): Promise<boolean> {
  if (await isAdmin()) return true
  return await isGiftOwner(giftId)
}

/**
 * 게임 생성자 확인
 */
export async function isGameCreator(gameId: string): Promise<boolean> {
  const userId = await getCurrentUserId()
  if (!userId) return false

  const { data, error } = await supabaseServer
    .from('games')
    .select('creator_id')
    .eq('id', gameId)
    .single()

  if (error || !data) return false
  return data.creator_id === userId
}

/**
 * 게임 관리 권한 체크 (생성자 또는 관리자)
 */
export async function canManageGame(gameId: string): Promise<boolean> {
  if (await isAdmin()) return true
  return await isGameCreator(gameId)
}

/**
 * 선물 삭제 권한 체크 (소유자, 받은 사람, 또는 관리자)
 */
export async function canDeleteGift(giftId: string): Promise<boolean> {
  if (await isAdmin()) return true

  const userId = await getCurrentUserId()
  if (!userId) return false

  const { data, error } = await supabaseServer
    .from('gifts')
    .select('owner_id, recipient_id')
    .eq('id', giftId)
    .single()

  if (error || !data) return false
  return (
    (data as any).owner_id === userId || (data as any).recipient_id === userId
  )
}
