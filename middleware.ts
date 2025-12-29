import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ACCESS_COOKIE_NAME = 'access_granted'
const ACCESS_COOKIE_VALUE = 'true'
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

  // 쿠키 확인
  const accessGranted = request.cookies.get(ACCESS_COOKIE_NAME)?.value

  // 접근 권한이 없으면 /enter로 리다이렉트
  if (accessGranted !== ACCESS_COOKIE_VALUE) {
    const enterUrl = new URL(ENTER_PATH, request.url)
    // 원래 가려던 URL을 쿼리 파라미터로 저장 (리다이렉트 후 복귀용)
    enterUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(enterUrl)
  }

  // 접근 권한이 있으면 통과
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

