'use server'

import { supabaseServer } from '@/lib/supabase/server-client'
import { isAdmin } from '@/lib/auth/permissions'

export interface User {
  id: string
  name: string
  role: 'user' | 'admin'
  created_at: string
}

/**
 * 모든 유저 목록 (관리자만 - 관리자 페이지용)
 */
export async function getUsers(): Promise<User[]> {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('관리자 권한이 필요합니다.')
  }

  const { data, error } = await supabaseServer
    .from('users')
    .select('id, name, role, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as User[]
}

/**
 * 우승자 선택을 위한 유저 목록 (모든 유저 접근 가능)
 */
export async function getUsersForSelection(): Promise<User[]> {
  const { data, error } = await supabaseServer
    .from('users')
    .select('id, name, role, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as User[]
}
