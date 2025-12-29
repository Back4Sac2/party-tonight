'use client'

import { useState } from 'react'
import { useCreateGift } from '@/hooks/queries'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface GiftFormProps {
  onSuccess?: () => void
}

export function GiftForm({ onSuccess }: GiftFormProps) {
  const { sessionId } = useSession()
  const createGift = useCreateGift(sessionId)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await createGift.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      })
      setName('')
      setDescription('')
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create gift:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="gift-name" className="block text-sm font-medium mb-1">
          선물 이름 *
        </label>
        <Input
          id="gift-name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="예: 스타벅스 기프트카드"
          required
        />
      </div>
      <div>
        <label
          htmlFor="gift-description"
          className="block text-sm font-medium mb-1"
        >
          설명 (선택)
        </label>
        <Input
          id="gift-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="선물에 대한 설명을 입력하세요"
        />
      </div>
      <Button type="submit" disabled={createGift.isPending}>
        {createGift.isPending ? '추가 중...' : '선물 추가'}
      </Button>
    </form>
  )
}
