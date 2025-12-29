'use client'

import { useState } from 'react'
import { useCreateTag } from '@/hooks/queries'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TagFormProps {
  onSuccess?: () => void
}

export function TagForm({ onSuccess }: TagFormProps) {
  const { sessionId } = useSession()
  const createTag = useCreateTag(sessionId)
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await createTag.mutateAsync({ name: name.trim() })
      setName('')
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create tag:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="tag-name" className="block text-sm font-medium mb-1">
          태그 이름 *
        </label>
        <Input
          id="tag-name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="예: 실용적인"
          required
        />
      </div>
      <Button type="submit" disabled={createTag.isPending}>
        {createTag.isPending ? '추가 중...' : '태그 추가'}
      </Button>
    </form>
  )
}
