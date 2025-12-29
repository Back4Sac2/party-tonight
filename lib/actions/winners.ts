'use server'

import { supabaseServer } from '@/lib/supabase/server-client'
import { getCurrentUserId } from '@/lib/auth/session'
import { canManageGame } from '@/lib/auth/permissions'

export interface Winner {
  id: string
  game_id: string
  winner_user_id: string
  tag: string
  created_at: string
}

export async function createWinner(
  gameId: string,
  winnerUserId: string,
  tag: string
): Promise<Winner> {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('로그인이 필요합니다.')
  }

  if (!gameId || !winnerUserId || !tag) {
    throw new Error('게임 ID, 우승자 ID, 태그가 필요합니다.')
  }

  // 권한 체크: 게임 생성자 또는 관리자만 가능
  const canManage = await canManageGame(gameId)
  if (!canManage) {
    throw new Error(
      '우승자 선택 권한이 없습니다. 게임 생성자 또는 관리자만 가능합니다.'
    )
  }

  // 게임에서 태그 확인
  const { data: game } = await supabaseServer
    .from('games')
    .select('tag')
    .eq('id', gameId)
    .single()

  if (!game) {
    throw new Error('게임을 찾을 수 없습니다.')
  }

  // 태그가 일치하는 선물 찾기
  const { data: gift } = await supabaseServer
    .from('gifts')
    .select('*')
    .eq('tag', tag)
    .eq('revealed', false)
    .is('recipient_id', null)
    .limit(1)
    .single()

  if (!gift) {
    throw new Error('해당 태그의 선물을 찾을 수 없습니다.')
  }

  // 우승자 등록
  // @ts-expect-error - Supabase 타입 추론 이슈
  const { data: winner, error: winnerError } = await supabaseServer
    .from('winners')
    .insert({
      game_id: gameId,
      winner_user_id: winnerUserId,
      tag,
    })
    .select()
    .single()

  if (winnerError) {
    throw new Error(winnerError.message)
  }

  // 선물에 recipient_id 설정 (가방에 추가)
  const { error: giftError } = await supabaseServer
    .from('gifts')
    .update({ recipient_id: winnerUserId })
    .eq('id', gift.id)

  if (giftError) {
    throw new Error(giftError.message)
  }

  return winner as Winner
}
