'use client'

import { useEffect } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Loader,
} from '@/shared/ui'
import { useUserStore } from '@/stores'
import { useBagGifts, useOpenGift } from '@/hooks/queries/v2/use-bag'
import { useDeleteGift } from '@/hooks/queries/v2/use-gifts'

export default function BagPage() {
  const { user, fetchUser } = useUserStore()
  const { data: gifts = [], isLoading } = useBagGifts()
  const openGiftMutation = useOpenGift()
  const deleteGiftMutation = useDeleteGift()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleOpenGift = async (giftId: string) => {
    try {
      await openGiftMutation.mutateAsync(giftId)
    } catch (error: any) {
      alert(error.message || '선물을 열 수 없습니다.')
    }
  }

  const handleDeleteGift = async (giftId: string) => {
    if (!confirm('정말 이 선물을 삭제하시겠습니까?')) return

    try {
      await deleteGiftMutation.mutateAsync(giftId)
    } catch (error: any) {
      alert(error.message || '선물 삭제에 실패했습니다.')
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
      <div>
        <h1 className="text-3xl font-bold">🎒 내 가방</h1>
        <p className="text-gray-600 mt-1">
          게임에서 받은 선물들을 확인하고 열어보세요.
        </p>
      </div>

      {gifts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 py-8">
              아직 받은 선물이 없습니다.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gifts.map(gift => (
            <Card
              key={gift.id}
              className={gift.revealed ? 'border-2 border-blue-500' : ''}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{gift.tag}</Badge>
                  {gift.revealed && (
                    <Badge
                      variant="default"
                      className="bg-green-600 text-white"
                    >
                      열림
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {gift.revealed ? (
                  <>
                    <div>
                      <span className="text-sm text-gray-500">선물명:</span>
                      <p className="text-xl font-bold mt-1">{gift.name}</p>
                    </div>
                    {gift.description && (
                      <div>
                        <span className="text-sm text-gray-500">설명:</span>
                        <p className="mt-1">{gift.description}</p>
                      </div>
                    )}
                    {gift.message && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500">메시지:</span>
                        <p className="mt-1 italic">{gift.message}</p>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteGift(gift.id)}
                      className="w-full text-red-600 hover:text-red-700 hover:border-red-600"
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-4">
                        아직 열지 않은 선물입니다
                      </p>
                      <Button
                        onClick={() => handleOpenGift(gift.id)}
                        disabled={openGiftMutation.isPending}
                        className="w-full"
                      >
                        {openGiftMutation.isPending
                          ? '여는 중...'
                          : '🎁 선물 열기'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
