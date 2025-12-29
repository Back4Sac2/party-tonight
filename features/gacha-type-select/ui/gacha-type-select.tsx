'use client'

import { Button } from '@/shared/ui'
import type { GachaType } from '@/lib/actions/gacha'

interface GachaTypeSelectProps {
  selectedType: GachaType | null
  onSelectType: (type: GachaType) => void
}

export function GachaTypeSelect({
  selectedType,
  onSelectType,
}: GachaTypeSelectProps) {
  const types: { value: GachaType; label: string; emoji: string }[] = [
    { value: 'user', label: '유저', emoji: '👤' },
    { value: 'tag', label: '태그', emoji: '🏷️' },
    { value: 'game', label: '게임', emoji: '🎮' },
    { value: 'number', label: '숫자', emoji: '🔢' },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">가챠 타입 선택</h3>
      <div className="grid grid-cols-2 gap-4">
        {types.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? 'primary' : 'outline'}
            onClick={() => onSelectType(type.value)}
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <span className="text-2xl">{type.emoji}</span>
            <span>{type.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

