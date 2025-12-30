'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui'
import { useCreateGift } from '@/hooks/queries/v2/use-gifts'

export default function NewGiftPage() {
  const router = useRouter()
  const [tag, setTag] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const createGiftMutation = useCreateGift()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createGiftMutation.mutateAsync({
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

  const error = createGiftMutation.error
    ? (createGiftMutation.error as Error).message
    : ''
  const isSubmitting = createGiftMutation.isPending

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">새 선물 등록</h1>
        <p className="text-gray-600 mt-1">
          선물 정보를 입력하세요. 태그는 우승자가 보게 됩니다.
        </p>
      </div>

      <Card className="p-3 mb-2">
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
                <span className="text-xs text-gray-500 ml-2">
                  우승자가 보는 키워드
                </span>
              </label>
              <Input
                id="tag"
                type="text"
                value={tag}
                onChange={e => setTag(e.target.value)}
                placeholder="예: 실용적인, 예쁜, 재미있는"
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
                <span className="text-xs text-gray-500 ml-2">
                  태그 선택 후 공개됨
                </span>
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="예: 스타벅스 기프트카드"
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
                placeholder="선물에 대한 설명"
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
                placeholder="우승자에게 전할 메시지"
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
                {isSubmitting ? '등록 중...' : '등록하기'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
