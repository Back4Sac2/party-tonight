'use client'

import { useGifts } from '@/hooks/queries'
import { useSession } from '@/hooks/use-session'
import { GiftCard } from './gift-card'
import { Gift } from '@/types'

interface GiftListProps {
  onGiftClick?: (gift: Gift) => void
}

export function GiftList({ onGiftClick }: GiftListProps) {
  const { sessionId } = useSession()
  const { data: gifts, isLoading } = useGifts(sessionId)

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  if (!gifts || gifts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        아직 선물이 없습니다. 선물을 추가해보세요!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {gifts.map(gift => (
        <GiftCard
          key={gift.id}
          gift={gift}
          onClick={() => onGiftClick?.(gift)}
        />
      ))}
    </div>
  )
}
