'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/stores'

export default function HomePage() {
  const router = useRouter()
  const { user, fetchUser } = useUserStore()

  useEffect(() => {
    fetchUser()
    if (user) {
      router.replace('/gifts')
    }
  }, [user, router, fetchUser])

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">🎁 Party Tonight</h1>
      <p className="text-gray-600">로딩 중...</p>
    </div>
  )
}
