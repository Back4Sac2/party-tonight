'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Badge } from '@/shared/ui'
import { useUserStore } from '@/stores'

export function Header() {
  const router = useRouter()
  const { user, fetchUser, logout } = useUserStore()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleLogout = async () => {
    await logout()
  }

  const isAdmin = user?.role === 'admin'

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/gifts" className="text-xl font-bold">
            🎁 Party Tonight
          </Link>
          <nav className="flex gap-2 sm:gap-4 items-center">
            <Link href="/gifts">
              <Button variant="ghost" size="sm">
                선물
              </Button>
            </Link>
            <Link href="/game">
              <Button variant="ghost" size="sm">
                게임
              </Button>
            </Link>
            <Link href="/bag">
              <Button variant="ghost" size="sm">
                가방
              </Button>
            </Link>
            <Link href="/gacha">
              <Button variant="ghost" size="sm">
                🎲 가챠
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  관리자
                </Button>
              </Link>
            )}
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {user.name}
                </span>
                {isAdmin && (
                  <Badge variant="default" className="bg-blue-600 text-white">
                    ADMIN
                  </Badge>
                )}
              </div>
            )}
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
