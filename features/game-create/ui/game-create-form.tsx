'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui'
import { Input } from '@/shared/ui'
import { Button } from '@/shared/ui'
import { TagSelect } from '@/features/tag-select/ui/tag-select'
import { useCreateGame } from '@/hooks/queries/v2/use-games'
import { useTags } from '@/hooks/queries/v2/use-tags'

interface GameCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function GameCreateForm({ onSuccess, onCancel }: GameCreateFormProps) {
  const { data: tags = [] } = useTags()
  const createGameMutation = useCreateGame()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !description) {
      alert('게임명과 설명을 입력해주세요.')
      return
    }

    try {
      await createGameMutation.mutateAsync({
        name,
        description,
        tag: selectedTag || null,
      })
      setName('')
      setDescription('')
      setSelectedTag('')
      onSuccess?.()
    } catch (error: any) {
      alert(error.message || '게임 생성에 실패했습니다.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>새 게임 생성</CardTitle>
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
              placeholder="예: 가위바위보"
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
              placeholder="게임 설명을 입력하세요"
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
              disabled={createGameMutation.isPending}
              className="flex-1"
            >
              {createGameMutation.isPending ? '생성 중...' : '생성'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
