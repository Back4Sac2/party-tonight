'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui'
import { Badge } from '@/shared/ui'
import { Button } from '@/shared/ui'
import type { Game } from '@/lib/actions/games'

interface GameCardProps {
  game: Game
  canManage: boolean
  onEdit: (game: Game) => void
  onDelete: (gameId: string) => void
  onSelectWinner: (game: Game) => void
}

export function GameCard({
  game,
  canManage,
  onEdit,
  onDelete,
  onSelectWinner,
}: GameCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-2">{game.name}</CardTitle>
            <CardDescription className="mb-3">{game.description}</CardDescription>
            {game.tag && (
              <Badge variant="outline" className="mt-2">
                태그: {game.tag}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {canManage && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(game)}
              className="flex-1"
            >
              수정
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(game.id)}
              className="flex-1 text-red-600 hover:text-red-700 hover:border-red-600"
            >
              삭제
            </Button>
          </div>
        )}
        {canManage && (
          <Button onClick={() => onSelectWinner(game)} className="w-full">
            우승자 선택
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
