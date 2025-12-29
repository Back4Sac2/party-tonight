import { v4 as uuidv4 } from 'uuid'

const SESSION_ID_KEY = 'party_tonight_session_id'

/**
 * 세션 ID를 가져오거나 생성합니다.
 * 로컬 스토리지에 저장되어 있으면 반환하고, 없으면 새로 생성합니다.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 새 세션 ID 생성
    return uuidv4()
  }

  let sessionId = localStorage.getItem(SESSION_ID_KEY)

  if (!sessionId) {
    sessionId = uuidv4()
    localStorage.setItem(SESSION_ID_KEY, sessionId)
  }

  return sessionId
}

/**
 * 세션 ID를 가져옵니다 (없으면 null 반환)
 */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem(SESSION_ID_KEY)
}

/**
 * 세션 ID를 제거합니다 (로그아웃 또는 세션 종료 시)
 */
export function clearSessionId(): void {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.removeItem(SESSION_ID_KEY)
}

/**
 * 세션 ID를 설정합니다
 */
export function setSessionId(sessionId: string): void {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem(SESSION_ID_KEY, sessionId)
}
