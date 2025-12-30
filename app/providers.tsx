'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useAccessStore, useUserStore } from '@/stores'

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

  return (
    <QueryClientProvider client={queryClient}>
      <AccessInitializer />
      <UserInitializer />
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

function UserInitializer() {
  const fetchUser = useUserStore(state => state.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return null
}
