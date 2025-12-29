'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Loader,
} from '@/shared/ui'
import { useGift, useUpdateGift } from '@/hooks/queries/v2/use-gifts'
import { useState } from 'react'

function EditGiftPageContent() {
  const router = useRouter()
  const params = useParams()
  const giftId = params.id as string

  const { data: gift, isLoading } = useGift(giftId)
  const updateGiftMutation = useUpdateGift()
  const [tag, setTag] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (gift) {
      setTag(gift.tag || '')
      setName(gift.name || '')
      setDescription(gift.description || '')
      setMessage(gift.message || '')
    }
  }, [gift])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateGiftMutation.mutateAsync({
        id: giftId,
        tag: tag.trim(),
        name: name.trim(),
        description: description.trim() || null,
        message: message.trim() || null,
      })
      router.push('/gifts')
    } catch (error: any) {
      // 에러는 mutation에서 처리됨
    }
  }

  const error = updateGiftMutation.error
    ? (updateGiftMutation.error as Error).message
    : ''
  const isSubmitting = updateGiftMutation.isPending

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    )
  }

  if (error && !gift) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/gifts')}>목록으로</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">선물 수정</h1>
        <p className="text-gray-600 mt-1">
          선물 정보를 수정하세요.{' '}
          {gift?.revealed && (
            <span className="text-orange-600">(이미 공개된 선물입니다)</span>
          )}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>선물 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="tag"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                태그 (키워드) *
              </label>
              <Input
                id="tag"
                type="text"
                value={tag}
                onChange={e => setTag(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                선물명 *
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                설명 (선택)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                메시지 (선택)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? '수정 중...' : '수정하기'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function EditGiftPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-8">
          <p>로딩 중...</p>
        </div>
      }
    >
      <EditGiftPageContent />
    </Suspense>
  )
}
