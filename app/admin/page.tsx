'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Loader,
} from '@/shared/ui'
import { useUserStore } from '@/stores'
import { useUsers } from '@/hooks/queries/v2/use-users'
import { useGifts } from '@/hooks/queries/v2/use-gifts'
import { useState } from 'react'

export default function AdminPage() {
  const router = useRouter()
  const { user, fetchUser } = useUserStore()
  const [activeTab, setActiveTab] = useState<'users' | 'gifts'>('users')
  const { data: users = [], isLoading: usersLoading } = useUsers()
  const { data: gifts = [], isLoading: giftsLoading } = useGifts(true)

  useEffect(() => {
    fetchUser().then(() => {
      if (user?.role !== 'admin') {
        router.push('/gifts')
      }
    })
  }, [fetchUser, router, user?.role])

  const loading = activeTab === 'users' ? usersLoading : giftsLoading

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              관리자 권한이 필요합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">관리자 페이지</h1>
        <p className="text-gray-600">모든 유저와 선물을 관리할 수 있습니다.</p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'users' ? 'default' : 'outline'}
          onClick={() => setActiveTab('users')}
        >
          유저 목록
        </Button>
        <Button
          variant={activeTab === 'gifts' ? 'default' : 'outline'}
          onClick={() => setActiveTab('gifts')}
        >
          모든 선물
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : activeTab === 'users' ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>전체 유저 ({users.length}명)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map(u => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{u.name}</span>
                      {u.role === 'admin' && (
                        <Badge
                          variant="default"
                          className="bg-blue-600 text-white"
                        >
                          ADMIN
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(u.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>전체 선물 ({gifts.length}개)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gifts.map(gift => (
                  <div
                    key={gift.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{gift.tag}</Badge>
                        <span className="font-medium">{gift.name}</span>
                        {gift.revealed && (
                          <Badge
                            variant="default"
                            className="bg-green-600 text-white"
                          >
                            공개됨
                          </Badge>
                        )}
                      </div>
                    </div>
                    {gift.description && (
                      <p className="text-sm text-gray-600">
                        {gift.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      생성일:{' '}
                      {new Date(gift.created_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
