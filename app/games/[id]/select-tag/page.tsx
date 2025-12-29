'use client'

import { useSearchParams } from 'next/navigation'
import { TagSelector } from '@/components/domain/game/tag-selector'

export default function SelectTagPage({ params }: { params: { id: string } }) {
  const { id } = params
  const searchParams = useSearchParams()
  const resultId = searchParams.get('resultId')

  if (!resultId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">게임 결과를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">태그 선택</h1>
        <p className="text-gray-600">
          우승자가 원하는 태그를 선택하여 선물을 획득하세요.
        </p>
      </div>
      <TagSelector gameResultId={resultId} />
    </div>
  )
}
