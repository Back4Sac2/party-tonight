'use client'

import { useGame } from '@/hooks/queries'
import { GameDetail } from '@/components/domain/game/game-detail'
import { WinnerSelector } from '@/components/domain/game/winner-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GameDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { data: game, isLoading } = useGame(id)

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  if (!game) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">게임을 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <GameDetail game={game} />
      <Card>
        <CardHeader>
          <CardTitle>우승자 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <WinnerSelector gameId={id} />
        </CardContent>
      </Card>
    </div>
  )
}
