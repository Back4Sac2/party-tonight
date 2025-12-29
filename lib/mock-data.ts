import { Session, Gift, Tag, Game, GameResult } from '@/types'

// Mock 데이터 저장소 (메모리 기반)
class MockDataStore {
  private sessions: Map<string, Session> = new Map()
  private gifts: Map<string, Gift> = new Map()
  private tags: Map<string, Tag> = new Map()
  private giftTags: Map<string, Set<string>> = new Map() // gift_id -> Set<tag_id>
  private games: Map<string, Game> = new Map()
  private gameResults: Map<string, GameResult> = new Map()
  private tagSelections: Map<string, Set<string>> = new Map() // game_result_id -> Set<tag_id>

  // Sessions
  getSession(id: string): Session | undefined {
    return this.sessions.get(id)
  }

  createSession(id: string): Session {
    const now = new Date().toISOString()
    const session: Session = {
      id,
      created_at: now,
      last_active_at: now,
    }
    this.sessions.set(id, session)
    return session
  }

  updateSessionLastActive(id: string): void {
    const session = this.sessions.get(id)
    if (session) {
      session.last_active_at = new Date().toISOString()
    }
  }

  // Gifts
  getGiftsBySession(sessionId: string): Gift[] {
    return Array.from(this.gifts.values()).filter(
      (gift) => gift.session_id === sessionId
    )
  }

  createGift(sessionId: string, gift: Partial<Gift>): Gift {
    const id = `gift-${Date.now()}-${Math.random()}`
    const newGift: Gift = {
      id,
      session_id: sessionId,
      name: gift.name!,
      description: gift.description,
      image_url: gift.image_url,
      created_at: new Date().toISOString(),
      is_claimed: false,
    }
    this.gifts.set(id, newGift)
    return newGift
  }

  updateGift(id: string, updates: Partial<Gift>): Gift | undefined {
    const gift = this.gifts.get(id)
    if (gift) {
      Object.assign(gift, updates)
      return gift
    }
    return undefined
  }

  deleteGift(id: string): void {
    this.gifts.delete(id)
    this.giftTags.delete(id)
  }

  addGiftTag(giftId: string, tagId: string): void {
    if (!this.giftTags.has(giftId)) {
      this.giftTags.set(giftId, new Set())
    }
    this.giftTags.get(giftId)!.add(tagId)
  }

  removeGiftTag(giftId: string, tagId: string): void {
    this.giftTags.get(giftId)?.delete(tagId)
  }

  getGiftTags(giftId: string): string[] {
    return Array.from(this.giftTags.get(giftId) || [])
  }

  claimGift(giftId: string, winnerName: string): Gift | undefined {
    const gift = this.gifts.get(giftId)
    if (gift) {
      gift.is_claimed = true
      gift.claimed_by = winnerName
      gift.claimed_at = new Date().toISOString()
      return gift
    }
    return undefined
  }

  getGiftsByTag(sessionId: string, tagId: string): Gift[] {
    const giftIds = Array.from(this.giftTags.entries())
      .filter(([_, tagIds]) => tagIds.has(tagId))
      .map(([giftId]) => giftId)

    return giftIds
      .map((id) => this.gifts.get(id))
      .filter((gift): gift is Gift => gift !== undefined && gift.session_id === sessionId && !gift.is_claimed)
  }

  // Tags
  getTagsBySession(sessionId: string): Tag[] {
    return Array.from(this.tags.values()).filter(
      (tag) => tag.session_id === sessionId
    )
  }

  createTag(sessionId: string, tag: Partial<Tag>): Tag {
    const id = `tag-${Date.now()}-${Math.random()}`
    const newTag: Tag = {
      id,
      session_id: sessionId,
      name: tag.name!,
      color: tag.color,
      created_at: new Date().toISOString(),
    }
    this.tags.set(id, newTag)
    return newTag
  }

  updateTag(id: string, updates: Partial<Tag>): Tag | undefined {
    const tag = this.tags.get(id)
    if (tag) {
      Object.assign(tag, updates)
      return tag
    }
    return undefined
  }

  deleteTag(id: string): void {
    this.tags.delete(id)
    // 관련된 gift_tags도 정리
    for (const [giftId, tagIds] of this.giftTags.entries()) {
      tagIds.delete(id)
    }
  }

  // Games
  getAllGames(): Game[] {
    return Array.from(this.games.values())
  }

  getGame(id: string): Game | undefined {
    return this.games.get(id)
  }

  createGame(game: Partial<Game>): Game {
    const id = `game-${Date.now()}-${Math.random()}`
    const newGame: Game = {
      id,
      name: game.name!,
      description: game.description!,
      rules: game.rules!,
      image_url: game.image_url,
      created_at: new Date().toISOString(),
    }
    this.games.set(id, newGame)
    return newGame
  }

  // Game Results
  createGameResult(sessionId: string, gameId: string, winnerName: string): GameResult {
    const id = `result-${Date.now()}-${Math.random()}`
    const result: GameResult = {
      id,
      session_id: sessionId,
      game_id: gameId,
      winner_name: winnerName,
      played_at: new Date().toISOString(),
    }
    this.gameResults.set(id, result)
    return result
  }

  getGameResultsBySession(sessionId: string): GameResult[] {
    return Array.from(this.gameResults.values()).filter(
      (result) => result.session_id === sessionId
    )
  }

  selectTag(gameResultId: string, tagId: string): void {
    if (!this.tagSelections.has(gameResultId)) {
      this.tagSelections.set(gameResultId, new Set())
    }
    this.tagSelections.get(gameResultId)!.add(tagId)
  }
}

// 싱글톤 인스턴스
export const mockStore = new MockDataStore()

// 초기 Mock 데이터 설정
export function initializeMockData() {
  // 샘플 게임 추가
  mockStore.createGame({
    name: '가위바위보',
    description: '전통적인 가위바위보 게임',
    rules: '1. 모두 동시에 가위, 바위, 보 중 하나를 낸다\n2. 승자가 결정될 때까지 반복한다\n3. 최종 승자가 우승자이다',
  })

  mockStore.createGame({
    name: '숫자 맞추기',
    description: '1부터 100까지 숫자 맞추기',
    rules: '1. 한 사람이 1부터 100까지 숫자 중 하나를 생각한다\n2. 다른 사람들이 번갈아가며 숫자를 말한다\n3. 가장 가까운 사람이 우승자이다',
  })

  mockStore.createGame({
    name: '퀴즈 대회',
    description: '상식 퀴즈 대회',
    rules: '1. 문제를 하나씩 출제한다\n2. 가장 먼저 정답을 맞춘 사람이 우승자이다',
  })
}

