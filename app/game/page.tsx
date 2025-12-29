'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/shared/ui'
import { Loader } from '@/shared/ui'
import { useUserStore } from '@/stores'
import { useGames, useDeleteGame } from '@/hooks/queries/v2/use-games'
import { useTags, useInvalidateTags } from '@/hooks/queries/v2/use-tags'
import { useUsersForSelection } from '@/hooks/queries/v2/use-users-selection'
import { GameCreateForm } from '@/features/game-create/ui/game-create-form'
import { GameEditForm } from '@/features/game-edit/ui/game-edit-form'
import { WinnerSelectForm } from '@/features/winner-select/ui/winner-select-form'
import { GameList } from '@/widgets/game-list/ui/game-list'
import type { Game } from '@/lib/actions/games'

export default function GamePage() {
  const { user, fetchUser } = useUserStore()
  const { data: games = [], isLoading: gamesLoading } = useGames()
  const { data: users = [], isLoading: usersLoading } = useUsersForSelection()
  const { data: tags = [], isLoading: tagsLoading } = useTags()
  const invalidateTags = useInvalidateTags()
  const deleteGameMutation = useDeleteGame()

  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)

  const loading = gamesLoading || usersLoading || tagsLoading

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const canManageGame = (game: Game) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return game.creator_id === user.id
  }

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('정말 이 게임을 삭제하시겠습니까?')) return

    try {
      await deleteGameMutation.mutateAsync(gameId)
      if (selectedGame?.id === gameId) {
        setSelectedGame(null)
      }
      if (editingGame?.id === gameId) {
        setEditingGame(null)
      }
    } catch (error: any) {
      alert(error.message || '게임 삭제에 실패했습니다.')
    }
  }

  const handleEdit = (game: Game) => {
    setEditingGame(game)
    setShowCreateForm(false)
    setSelectedGame(null)
  }

  const handleSelectWinner = (game: Game) => {
    setSelectedGame(game)
    setShowCreateForm(false)
    setEditingGame(null)
    invalidateTags()
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
  }

  const handleEditSuccess = () => {
    setEditingGame(null)
  }

  const handleWinnerSelectSuccess = () => {
    setSelectedGame(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">게임 목록</h1>
          <p className="text-gray-600 mt-1">
            게임을 선택하고 우승자를 결정하세요.
          </p>
        </div>
        <div className="flex gap-2">
          {showCreateForm ? (
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              취소
            </Button>
          ) : (
            <Button onClick={() => setShowCreateForm(true)}>게임 생성</Button>
          )}
        </div>
      </div>

      {showCreateForm && (
        <GameCreateForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editingGame && (
        <GameEditForm
          game={editingGame}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingGame(null)}
        />
      )}

      {selectedGame && !showCreateForm && !editingGame && (
        <WinnerSelectForm
          game={selectedGame}
          users={users}
          tags={tags}
          onSuccess={handleWinnerSelectSuccess}
          onCancel={() => setSelectedGame(null)}
        />
      )}

      {!selectedGame && !showCreateForm && !editingGame && (
        <GameList
          games={games}
          canManageGame={canManageGame}
          onEdit={handleEdit}
          onDelete={handleDeleteGame}
          onSelectWinner={handleSelectWinner}
        />
      )}
    </div>
  )
}
