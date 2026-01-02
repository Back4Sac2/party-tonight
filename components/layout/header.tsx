'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui'
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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/gifts" className="text-sm font-semibold text-gray-700">
            Party Tonight
          </Link>
          <nav className="flex gap-1.5 sm:gap-2 items-center">
            <Link href="/gifts" title="선물">
              <Button
                variant="ghost"
                size="sm"
                className="text-lg p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                🎁
              </Button>
            </Link>
            <Link href="/game" title="게임">
              <Button
                variant="ghost"
                size="sm"
                className="text-lg p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                🎮
              </Button>
            </Link>
            <Link href="/bag" title="가방">
              <Button
                variant="ghost"
                size="sm"
                className="text-lg p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                🎒
              </Button>
            </Link>
            <Link href="/gacha" title="가챠">
              <Button
                variant="ghost"
                size="sm"
                className="text-lg p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                🎲
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin" title="관리자">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-lg p-1.5 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-blue-600"
                >
                  ⚙️
                </Button>
              </Link>
            )}
            {user && (
              <span className="text-xs text-gray-500 hidden sm:inline mr-1">
                {user.name}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
            >
              로그아웃
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
