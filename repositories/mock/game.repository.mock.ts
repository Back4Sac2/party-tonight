import { Game, GameId } from '@/types'
import { mockStore } from '@/lib/mock-data'

export const gameRepositoryMock = {
  async getAll(): Promise<Game[]> {
    return mockStore.getAllGames()
  },

  async getById(gameId: GameId): Promise<Game | null> {
    return mockStore.getGame(gameId) || null
  },
}
