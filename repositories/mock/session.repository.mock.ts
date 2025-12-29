import { Session } from '@/types'
import { mockStore } from '@/lib/mock-data'

export const sessionRepositoryMock = {
  async create(sessionId: string): Promise<Session> {
    return mockStore.createSession(sessionId)
  },

  async getOrCreate(sessionId: string): Promise<Session> {
    const existing = mockStore.getSession(sessionId)
    if (existing) {
      mockStore.updateSessionLastActive(sessionId)
      return existing
    }
    return this.create(sessionId)
  },

  async updateLastActive(sessionId: string): Promise<void> {
    mockStore.updateSessionLastActive(sessionId)
  },
}
