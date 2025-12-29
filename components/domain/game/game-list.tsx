'use client'

import { useGames } from '@/hooks/queries'
import { Game } from '@/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export function GameList() {
  const { data: games, isLoading } = useGames()
  const router = useRouter()

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  if (!games || games.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">게임이 없습니다.</div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {games.map(game => (
        <Card
          key={game.id}
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => router.push(`/games/${game.id}`)}
        >
          <CardHeader>
            <CardTitle>{game.name}</CardTitle>
            <CardDescription>{game.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-2">{game.rules}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
