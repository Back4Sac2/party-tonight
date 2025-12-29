'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui'
import { Button } from '@/shared/ui'
import { TagSelect } from '@/features/tag-select/ui/tag-select'
import { UserSelect } from '@/features/user-select/ui/user-select'
import { useCreateWinner } from '@/hooks/queries/v2/use-winners'
import { useInvalidateTags } from '@/hooks/queries/v2/use-tags'
import type { Game } from '@/lib/actions/games'
import type { User } from '@/lib/actions/users'

interface WinnerSelectFormProps {
  game: Game
  users: User[]
  tags: string[]
  onSuccess?: () => void
  onCancel?: () => void
}

export function WinnerSelectForm({
  game,
  users,
  tags,
  onSuccess,
  onCancel,
}: WinnerSelectFormProps) {
  const createWinnerMutation = useCreateWinner()
  const invalidateTags = useInvalidateTags()
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedWinner, setSelectedWinner] = useState('')

  useEffect(() => {
    setSelectedTag(game.tag || '')
  }, [game])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedWinner || !selectedTag) {
      alert('우승자와 태그를 모두 선택해주세요.')
      return
    }

    try {
      await createWinnerMutation.mutateAsync({
        gameId: game.id,
        winnerUserId: selectedWinner,
        tag: selectedTag,
      })
      alert(
        '우승자가 등록되었습니다. 우승자는 가방에서 선물을 확인할 수 있습니다.'
      )
      invalidateTags()
      onSuccess?.()
    } catch (error: any) {
      alert(error.message || '우승자 등록에 실패했습니다.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>우승자 선택</CardTitle>
        <CardDescription>{game.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TagSelect
            tags={tags}
            selectedTag={selectedTag}
            onSelect={setSelectedTag}
            required
            label="태그 선택"
            description="우승자에게 줄 선물의 태그"
          />
          <UserSelect
            users={users}
            selectedUserId={selectedWinner}
            onSelect={setSelectedWinner}
            required
            label="우승자 선택"
          />
          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                취소
              </Button>
            )}
            <Button
              type="submit"
              disabled={
                !selectedWinner ||
                !selectedTag ||
                createWinnerMutation.isPending
              }
              className="flex-1"
            >
              {createWinnerMutation.isPending ? '등록 중...' : '우승자 확정'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
