import { create } from 'zustand'
import { hasAccess, setAccessCookie, removeAccessCookie } from '@/lib/access'

interface AccessState {
  isGranted: boolean
  checkAccess: () => void
  grantAccess: () => void
  revokeAccess: () => void
}

export const useAccessStore = create<AccessState>((set) => ({
  isGranted: false,
  checkAccess: () => {
    const granted = hasAccess()
    set({ isGranted: granted })
  },
  grantAccess: () => {
    setAccessCookie()
    set({ isGranted: true })
  },
  revokeAccess: () => {
    removeAccessCookie()
    set({ isGranted: false })
  },
}))

