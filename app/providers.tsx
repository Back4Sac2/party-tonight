'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useSession } from '@/hooks/use-session'
import { isMockMode } from '@/lib/config'
import { initializeMockData } from '@/lib/mock-data'
import { useAccessStore } from '@/stores'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  // Mock 모드일 때 초기 데이터 설정
  useEffect(() => {
    if (isMockMode && typeof window !== 'undefined') {
      initializeMockData()
      console.log('🎭 Mock mode enabled - Using in-memory data store')
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AccessInitializer />
      <SessionInitializer />
      {children}
    </QueryClientProvider>
  )
}

function AccessInitializer() {
  const checkAccess = useAccessStore(state => state.checkAccess)

  useEffect(() => {
    checkAccess()
  }, [checkAccess])

  return null
}

function SessionInitializer({ children }: { children?: React.ReactNode }) {
  useSession()
  return <>{children}</>
}
