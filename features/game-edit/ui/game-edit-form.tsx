'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui'
import { Input } from '@/shared/ui'
import { Button } from '@/shared/ui'
import { TagSelect } from '@/features/tag-select/ui/tag-select'
import { useUpdateGame } from '@/hooks/queries/v2/use-games'
import { useTags } from '@/hooks/queries/v2/use-tags'
import type { Game } from '@/lib/actions/games'

interface GameEditFormProps {
  game: Game
  onSuccess?: () => void
  onCancel?: () => void
}

export function GameEditForm({ game, onSuccess, onCancel }: GameEditFormProps) {
  const { data: tags = [] } = useTags()
  const updateGameMutation = useUpdateGame()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    setName(game.name)
    setDescription(game.description)
    setSelectedTag(game.tag || '')
  }, [game])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !description) {
      alert('게임명과 설명을 입력해주세요.')
      return
    }

    try {
      await updateGameMutation.mutateAsync({
        id: game.id,
        name,
        description,
        tag: selectedTag || null,
      })
      onSuccess?.()
    } catch (error: any) {
      alert(error.message || '게임 수정에 실패했습니다.')
    }
  }

  return (
    <Card className="p-3 mb-2">
      <CardHeader>
        <CardTitle>게임 수정</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              게임명 *
            </label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명 *
            </label>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          <TagSelect
            tags={tags}
            selectedTag={selectedTag}
            onSelect={setSelectedTag}
            allowEmpty
            emptyLabel="없음"
            label="태그 (선택)"
            description="우승자에게 줄 선물의 태그"
          />
          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                취소
              </Button>
            )}
            <Button
              type="submit"
              disabled={updateGameMutation.isPending}
              className="flex-1"
            >
              {updateGameMutation.isPending ? '수정 중...' : '수정'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
