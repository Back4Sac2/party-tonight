'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui'
import { Loader } from '@/shared/ui'
import { useGacha } from '@/hooks/queries/v2/use-gacha'
import { GachaTypeSelect } from '@/features/gacha-type-select/ui/gacha-type-select'
import { GachaNumberInput } from '@/features/gacha-number-input/ui/gacha-number-input'
import { GachaResult } from '@/features/gacha-result/ui/gacha-result'
import type {
  GachaType,
  GachaResult as GachaResultType,
} from '@/lib/actions/gacha'

export default function GachaPage() {
  const [selectedType, setSelectedType] = useState<GachaType | null>(null)
  const [numberRange, setNumberRange] = useState<{
    min: number
    max: number
  } | null>(null)
  const [result, setResult] = useState<GachaResultType | null>(null)

  const gachaMutation = useGacha()

  const handleGacha = async () => {
    if (!selectedType) {
      alert('가챠 타입을 선택해주세요.')
      return
    }

    if (selectedType === 'number' && !numberRange) {
      alert('숫자 범위를 설정해주세요.')
      return
    }

    try {
      const gachaResult = await gachaMutation.mutateAsync({
        type: selectedType,
        options:
          selectedType === 'number' && numberRange
            ? { min: numberRange.min, max: numberRange.max }
            : undefined,
      })
      setResult(gachaResult)
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : '가챠 실행 중 오류가 발생했습니다.'
      )
    }
  }

  const handleNumberRangeConfirm = (min: number, max: number) => {
    setNumberRange({ min, max })
  }

  const handleReset = () => {
    setSelectedType(null)
    setNumberRange(null)
    setResult(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🎲 가챠</h1>
        <p className="text-gray-600">
          원하는 타입을 선택하고 가챠를 돌려보세요!
        </p>
      </div>

      <div className="space-y-6">
        <GachaTypeSelect
          selectedType={selectedType}
          onSelectType={setSelectedType}
        />

        {selectedType === 'number' && (
          <GachaNumberInput
            onConfirm={handleNumberRangeConfirm}
            disabled={gachaMutation.isPending}
          />
        )}

        {selectedType && (
          <div className="flex gap-4">
            <Button
              onClick={handleGacha}
              disabled={
                gachaMutation.isPending ||
                (selectedType === 'number' && !numberRange)
              }
              variant="primary"
              className="flex-1"
            >
              {gachaMutation.isPending ? (
                <>
                  <Loader className="mr-2" />
                  가챠 중...
                </>
              ) : (
                '🎲 가챠 돌리기'
              )}
            </Button>
            {result && (
              <Button onClick={handleReset} variant="outline">
                다시하기
              </Button>
            )}
          </div>
        )}

        <GachaResult result={result} isLoading={gachaMutation.isPending} />
      </div>
    </div>
  )
}
