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

  // 쿠키 확인 (userId)
  const userId = request.cookies.get('party_tonight_user_id')?.value

  // 로그인하지 않았으면 /enter로 리다이렉트
  if (!userId) {
    const enterUrl = new URL(ENTER_PATH, request.url)
    enterUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(enterUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
