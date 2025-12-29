import { create } from 'zustand'
import { SessionId } from '@/types'
import { getOrCreateSessionId } from '@/lib/session'

interface SessionState {
  sessionId: SessionId | null
  initialize: () => void
  setSessionId: (id: SessionId) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>(set => ({
  sessionId: null,
  initialize: () => {
    const id = getOrCreateSessionId()
    set({ sessionId: id })
  },
  setSessionId: (id: SessionId) => {
    set({ sessionId: id })
  },
  clearSession: () => {
    set({ sessionId: null })
  },
}))
