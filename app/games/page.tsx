'use client'

import { GameList } from '@/components/domain/game/game-list'

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">게임 목록</h1>
        <p className="text-gray-600">게임을 선택하고 우승자를 결정하세요.</p>
      </div>
      <GameList />
    </div>
  )
}
