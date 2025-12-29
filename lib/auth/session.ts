/**
 * 세션 관리 유틸리티
 * cookies() API를 사용하여 서버 사이드에서 세션 관리
 */

import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'party_tonight_user_id'
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30일

/**
 * 현재 로그인된 유저 ID 가져오기
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value
  return userId || null
}

/**
 * 세션 쿠키 설정
 */
export async function setSessionCookie(userId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: '/',
  })
}

/**
 * 세션 쿠키 제거
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
