'use client'

import { Card } from '@/shared/ui'
import type { GachaResult } from '@/lib/actions/gacha'

interface GachaResultProps {
  result: GachaResult | null
  isLoading?: boolean
}

export function GachaResult({ result, isLoading }: GachaResultProps) {
  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <div className="text-4xl mb-4">🎲</div>
        <div className="text-xl font-semibold">가챠 중...</div>
      </Card>
    )
  }

  if (!result) {
    return null
  }

  const getEmoji = () => {
    switch (result.type) {
      case 'user':
        return '👤'
      case 'tag':
        return '🏷️'
      case 'game':
        return '🎮'
      case 'number':
        return '🔢'
    }
  }

  const getTitle = () => {
    switch (result.type) {
      case 'user':
        return '뽑힌 유저'
      case 'tag':
        return '뽑힌 태그'
      case 'game':
        return '뽑힌 게임'
      case 'number':
        return '뽑힌 숫자'
    }
  }

  return (
    <Card className="p-8 text-center">
      <div className="text-6xl mb-4">{getEmoji()}</div>
      <div className="text-sm text-gray-500 mb-2">{getTitle()}</div>
      <div className="text-4xl font-bold mb-4">{result.result}</div>
      {result.metadata?.numberRange && (
        <div className="text-sm text-gray-500">
          범위: {result.metadata.numberRange.min} ~{' '}
          {result.metadata.numberRange.max}
        </div>
      )}
    </Card>
  )
}

