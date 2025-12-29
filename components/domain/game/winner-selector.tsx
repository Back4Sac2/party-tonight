'use client'

import { useState } from 'react'
import { useCreateGameResult } from '@/hooks/queries'
import { useSession } from '@/hooks/use-session'
import { GameId } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

interface WinnerSelectorProps {
  gameId: GameId
}

export function WinnerSelector({ gameId }: WinnerSelectorProps) {
  const { sessionId } = useSession()
  const createGameResult = useCreateGameResult(sessionId)
  const router = useRouter()
  const [winnerName, setWinnerName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!winnerName.trim()) return

    try {
      const result = await createGameResult.mutateAsync({
        gameId,
        winnerName: winnerName.trim(),
      })
      router.push(`/games/${gameId}/select-tag?resultId=${result.id}`)
    } catch (error) {
      console.error('Failed to create game result:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="winner-name" className="block text-sm font-medium mb-1">
          우승자 이름 *
        </label>
        <Input
          id="winner-name"
          value={winnerName}
          onChange={e => setWinnerName(e.target.value)}
          placeholder="우승자의 이름을 입력하세요"
          required
        />
      </div>
      <Button type="submit" disabled={createGameResult.isPending}>
        {createGameResult.isPending ? '처리 중...' : '우승자 선택'}
      </Button>
    </form>
  )
}
