import { create } from 'zustand'

export interface User {
  id: string
  name: string
  role: 'user' | 'admin'
}

interface UserState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  setUser: user => set({ user }),
  fetchUser: async () => {
    // 이미 로딩 중이면 중복 호출 방지
    const state = get()
    if (state.isLoading) return

    set({ isLoading: true })
    try {
      const response = await fetch('/api/auth/me', {
        cache: 'no-store', // 항상 최신 데이터 가져오기
      })
      const data = await response.json()
      if (response.ok && data.user) {
        set({ user: data.user, isLoading: false })
      } else {
        set({ user: null, isLoading: false })
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      set({ user: null, isLoading: false })
    }
  },
  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      set({ user: null })
      window.location.href = '/enter'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  },
}))
