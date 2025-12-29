'use client'

import { useSession } from '@/hooks/use-session'
import { GiftList } from '@/components/domain/gift/gift-list'
import { GameList } from '@/components/domain/game/game-list'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { sessionId } = useSession()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🎁 Party Tonight</h1>
        <p className="text-gray-600 mb-6">
          친구들과 함께 즐기는 선물 게임에 오신 것을 환영합니다!
        </p>
        {sessionId && (
          <p className="text-sm text-gray-500">
            세션 ID: {sessionId.slice(0, 8)}...
          </p>
        )}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">게임 목록</h2>
          <Link href="/games">
            <Button variant="outline" size="sm">
              전체 보기
            </Button>
          </Link>
        </div>
        <GameList />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">최근 선물</h2>
          <Link href="/gifts">
            <Button variant="outline" size="sm">
              전체 보기
            </Button>
          </Link>
        </div>
        <GiftList />
      </section>
    </div>
  )
}
