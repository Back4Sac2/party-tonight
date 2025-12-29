/**
 * 접근 권한 관련 유틸리티 함수
 */

const ACCESS_COOKIE_NAME = 'access_granted'
const ACCESS_COOKIE_VALUE = 'true'

/**
 * 클라이언트에서 접근 권한이 있는지 확인
 */
export function hasAccess(): boolean {
  if (typeof window === 'undefined') return false

  const cookies = document.cookie.split(';')
  const accessCookie = cookies.find(cookie =>
    cookie.trim().startsWith(`${ACCESS_COOKIE_NAME}=`)
  )
  return accessCookie?.includes(ACCESS_COOKIE_VALUE) ?? false
}

/**
 * 접근 권한 쿠키 설정
 */
export function setAccessCookie(): void {
  if (typeof window === 'undefined') return

  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1) // 1년 후 만료

  document.cookie = `${ACCESS_COOKIE_NAME}=${ACCESS_COOKIE_VALUE}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

/**
 * 접근 권한 쿠키 제거
 */
export function removeAccessCookie(): void {
  if (typeof window === 'undefined') return

  document.cookie = `${ACCESS_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

