'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/ui'

interface RevealedGift {
  id: string
  tag: string
  name: string
  description: string | null
  message: string | null
}

function RevealPageContent() {
  const searchParams = useSearchParams()
  const winnerId = searchParams.get('winner')
  const [tags, setTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [revealedGift, setRevealedGift] = useState<RevealedGift | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      const response = await fetch('/api/reveal/tags')
      if (response.ok) {
        const data = await response.json()
        setTags(data.tags || [])
      }
    } catch (error) {
      console.error('Failed to load tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTag = async (tag: string) => {
    if (selectedTag) return // 이미 선택된 경우

    setSelectedTag(tag)
    try {
      const response = await fetch('/api/reveal/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag }),
      })

      if (response.ok) {
        const data = await response.json()
        setRevealedGift(data.gift)
        // 태그 목록 새로고침 (선택된 태그 제거)
        loadTags()
      } else {
        const data = await response.json()
        alert(data.error || '선물 공개에 실패했습니다.')
        setSelectedTag('')
      }
    } catch (error) {
      console.error('Failed to reveal gift:', error)
      alert('선물 공개에 실패했습니다.')
      setSelectedTag('')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🎁 선물 공개</h1>
        <p className="text-gray-600 mt-1">
          원하는 태그를 선택하여 선물을 확인하세요.
        </p>
      </div>

      {revealedGift ? (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="text-2xl">축하합니다! 🎉</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">태그:</span>
              <Badge className="ml-2">{revealedGift.tag}</Badge>
            </div>
            <div>
              <span className="text-sm text-gray-500">선물명:</span>
              <p className="text-xl font-bold mt-1">{revealedGift.name}</p>
            </div>
            {revealedGift.description && (
              <div>
                <span className="text-sm text-gray-500">설명:</span>
                <p className="mt-1">{revealedGift.description}</p>
              </div>
            )}
            {revealedGift.message && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <span className="text-sm text-gray-500">메시지:</span>
                <p className="mt-1 italic">{revealedGift.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>태그 선택</CardTitle>
          </CardHeader>
          <CardContent>
            {tags.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                공개 가능한 선물이 없습니다.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    className="cursor-pointer text-base px-4 py-2"
                    onClick={() => handleSelectTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function RevealPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-8">
          <p>로딩 중...</p>
        </div>
      }
    >
      <RevealPageContent />
    </Suspense>
  )
}
