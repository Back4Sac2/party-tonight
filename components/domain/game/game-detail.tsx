'use client'

import { Game } from '@/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

interface GameDetailProps {
  game: Game
}

export function GameDetail({ game }: GameDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{game.name}</CardTitle>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">게임 규칙</h3>
            <p className="text-gray-700 whitespace-pre-line">{game.rules}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
