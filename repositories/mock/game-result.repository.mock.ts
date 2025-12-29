import { GameResult, SessionId, GameId, TagId } from '@/types'
import { mockStore } from '@/lib/mock-data'

export const gameResultRepositoryMock = {
  async create(
    sessionId: SessionId,
    gameId: GameId,
    winnerName: string
  ): Promise<GameResult> {
    return mockStore.createGameResult(sessionId, gameId, winnerName)
  },

  async selectTag(gameResultId: string, tagId: TagId): Promise<void> {
    mockStore.selectTag(gameResultId, tagId)
  },

  async getBySession(sessionId: SessionId): Promise<GameResult[]> {
    return mockStore.getGameResultsBySession(sessionId)
  },
}
