import { create } from 'zustand'

export interface User {
  id: string
  name: string
  role: 'user' | 'admin'
}

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set({ user }),
  fetchUser: async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      if (response.ok && data.user) {
        set({ user: data.user })
      } else {
        set({ user: null })
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      set({ user: null })
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
