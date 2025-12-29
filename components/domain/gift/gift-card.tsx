'use client'

import { Gift } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface GiftCardProps {
  gift: Gift
  onClick?: () => void
}

export function GiftCard({ gift, onClick }: GiftCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-shadow hover:shadow-md ${
        gift.is_claimed ? 'opacity-60' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{gift.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {gift.description && (
          <p className="text-sm text-gray-600 mb-2">{gift.description}</p>
        )}
        {gift.is_claimed && (
          <Badge variant="secondary" className="mt-2">
            획득됨: {gift.claimed_by}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
