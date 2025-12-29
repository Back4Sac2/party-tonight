import { useEffect } from 'react'
import { useSessionStore } from '@/stores'
import { sessionRepository } from '@/repositories'

/**
 * 세션을 초기화하고 Supabase에 등록하는 훅
 */
export function useSession() {
  const { sessionId, initialize } = useSessionStore()

  useEffect(() => {
    if (!sessionId) {
      initialize()
    }
  }, [sessionId, initialize])

  useEffect(() => {
    if (sessionId) {
      // Supabase에 세션 등록 또는 업데이트
      sessionRepository.getOrCreate(sessionId).catch(console.error)
    }
  }, [sessionId])

  return { sessionId }
}
