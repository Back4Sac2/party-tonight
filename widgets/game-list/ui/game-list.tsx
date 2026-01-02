'use client'

import { GameCard } from '@/entities/game/ui/game-card'
import type { Game } from '@/lib/actions/games'

interface GameListProps {
  games: Game[]
  canManageGame: (game: Game) => boolean
  onEdit: (game: Game) => void
  onDelete: (gameId: string) => void
  onSelectWinner: (game: Game) => void
}

export function GameList({
  games,
  canManageGame,
  onEdit,
  onDelete,
  onSelectWinner,
}: GameListProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">등록된 게임이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map(game => (
        <GameCard
          key={game.id}
          game={game}
          canManage={canManageGame(game)}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelectWinner={onSelectWinner}
        />
      ))}
    </div>
  )
}
