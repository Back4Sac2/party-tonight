'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAccessStore } from '@/stores'

export function Header() {
  const router = useRouter()
  const revokeAccess = useAccessStore((state) => state.revokeAccess)

  const handleLogout = () => {
    revokeAccess()
    router.push('/enter')
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            🎁 Party Tonight
          </Link>
          <nav className="flex gap-2 sm:gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                홈
              </Button>
            </Link>
            <Link href="/gifts">
              <Button variant="ghost" size="sm">
                선물
              </Button>
            </Link>
            <Link href="/games">
              <Button variant="ghost" size="sm">
                게임
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500"
            >
              나가기
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
