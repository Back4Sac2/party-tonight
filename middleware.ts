import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ENTER_PATH = '/enter'

// 보호하지 않을 경로들
const PUBLIC_PATHS = [
  '/enter',
  '/api',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public 경로는 통과
  if (
    PUBLIC_PATHS.some(path => pathname.startsWith(path)) ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image')
  ) {
    return NextResponse.next()
  }

  // 1단계: 접근 코드 확인 (access_granted 쿠키)
  const accessGranted = request.cookies.get('access_granted')?.value

  // 2단계: 사용자 로그인 확인 (userId 쿠키)
  const userId = request.cookies.get('party_tonight_user_id')?.value

  // 접근 코드나 로그인이 없으면 /enter로 리다이렉트
  // /enter 페이지에서 접근 코드와 로그인을 모두 처리
  if (!accessGranted || !userId) {
    const enterUrl = new URL(ENTER_PATH, request.url)
    enterUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(enterUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
