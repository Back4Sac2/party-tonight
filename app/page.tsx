'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/stores'

export default function HomePage() {
  const router = useRouter()
  const { user } = useUserStore()

  useEffect(() => {
    // UserInitializer에서 이미 fetchUser 호출하므로 user만 확인
    if (user) {
      router.replace('/gifts')
    }
  }, [user, router])

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">🎁 Party Tonight</h1>
      <p className="text-gray-600">로딩 중...</p>
    </div>
  )
}
