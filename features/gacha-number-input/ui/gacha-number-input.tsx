'use client'

import { useState } from 'react'
import { Input } from '@/shared/ui'
import { Button } from '@/shared/ui'

interface GachaNumberInputProps {
  onConfirm: (min: number, max: number) => void
  disabled?: boolean
}

export function GachaNumberInput({
  onConfirm,
  disabled,
}: GachaNumberInputProps) {
  const [min, setMin] = useState<string>('1')
  const [max, setMax] = useState<string>('100')

  const handleConfirm = () => {
    const minNum = parseInt(min, 10)
    const maxNum = parseInt(max, 10)

    if (isNaN(minNum) || isNaN(maxNum)) {
      alert('숫자를 입력해주세요.')
      return
    }

    if (minNum >= maxNum) {
      alert('최소값은 최대값보다 작아야 합니다.')
      return
    }

    if (minNum < 0 || maxNum < 0) {
      alert('숫자는 0 이상이어야 합니다.')
      return
    }

    onConfirm(minNum, maxNum)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">숫자 범위 설정</h3>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">최소값</label>
          <Input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="최소값"
            disabled={disabled}
            min="0"
          />
        </div>
        <div className="text-2xl font-bold pb-2">~</div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">최대값</label>
          <Input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="최대값"
            disabled={disabled}
            min="0"
          />
        </div>
        <Button
          onClick={handleConfirm}
          disabled={disabled}
          variant="primary"
        >
          확인
        </Button>
      </div>
    </div>
  )
}

