'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Loader,
} from '@/shared/ui'
import { useUserStore } from '@/stores'
import { useGifts, useDeleteGift } from '@/hooks/queries/v2/use-gifts'

export default function GiftsPage() {
  const { user, fetchUser } = useUserStore()
  const { data: gifts = [], isLoading } = useGifts()
  const deleteGiftMutation = useDeleteGift()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleDelete = async (giftId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      await deleteGiftMutation.mutateAsync(giftId)
    } catch (error: any) {
      alert(error.message || '삭제에 실패했습니다.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">내 선물 목록</h1>
          <p className="text-gray-600 mt-1">
            {user?.name}님의 선물 ({gifts.length}개)
          </p>
        </div>
        <Link href="/gifts/new">
          <Button>+ 새 선물 추가</Button>
        </Link>
      </div>

      {gifts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">아직 등록한 선물이 없습니다.</p>
            <Link href="/gifts/new">
              <Button>첫 선물 추가하기</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gifts.map(gift => (
            <Card key={gift.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {gift.revealed ? '🎁 공개됨' : '🎁'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">태그:</span>
                    <span className="ml-2 font-semibold">{gift.tag}</span>
                  </div>
                  {gift.revealed && (
                    <>
                      <div>
                        <span className="text-sm text-gray-500">선물명:</span>
                        <span className="ml-2">{gift.name}</span>
                      </div>
                      {gift.description && (
                        <div>
                          <span className="text-sm text-gray-500">설명:</span>
                          <p className="mt-1 text-sm">{gift.description}</p>
                        </div>
                      )}
                      {gift.message && (
                        <div>
                          <span className="text-sm text-gray-500">메시지:</span>
                          <p className="mt-1 text-sm italic">{gift.message}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/gifts/${gift.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      수정
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600"
                    onClick={() => handleDelete(gift.id)}
                  >
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
