'use server'

import { supabaseServer } from '@/lib/supabase/server-client'

export async function getTags(): Promise<string[]> {
  const { data, error } = await supabaseServer
    .from('gifts')
    .select('tag')
    .is('recipient_id', null) // 아직 받지 않은 선물만
    .order('tag')

  if (error) {
    throw new Error(error.message)
  }

  // 중복 제거 및 정렬 (null/undefined/빈 문자열 제거)
  const validTags = (data || [])
    .map((g: any) => g.tag)
    .filter(
      (tag: string | null | undefined) =>
        tag && typeof tag === 'string' && tag.trim() !== ''
    )

  return Array.from(new Set(validTags)).sort() as string[]
}
