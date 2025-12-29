import { Gift, GiftId, SessionId, TagId } from '@/types'
import { mockStore } from '@/lib/mock-data'

export const giftRepositoryMock = {
  async getBySession(sessionId: SessionId): Promise<Gift[]> {
    return mockStore.getGiftsBySession(sessionId)
  },

  async create(
    sessionId: SessionId,
    gift: {
      name: string
      description?: string
      image_url?: string
    }
  ): Promise<Gift> {
    return mockStore.createGift(sessionId, gift)
  },

  async update(
    giftId: GiftId,
    updates: Partial<Pick<Gift, 'name' | 'description' | 'image_url'>>
  ): Promise<Gift> {
    const updated = mockStore.updateGift(giftId, updates)
    if (!updated) {
      throw new Error('Gift not found')
    }
    return updated
  },

  async delete(giftId: GiftId): Promise<void> {
    mockStore.deleteGift(giftId)
  },

  async addTag(giftId: GiftId, tagId: TagId): Promise<void> {
    mockStore.addGiftTag(giftId, tagId)
  },

  async removeTag(giftId: GiftId, tagId: TagId): Promise<void> {
    mockStore.removeGiftTag(giftId, tagId)
  },

  async getTags(giftId: GiftId): Promise<TagId[]> {
    return mockStore.getGiftTags(giftId)
  },

  async claim(giftId: GiftId, winnerName: string): Promise<Gift> {
    const claimed = mockStore.claimGift(giftId, winnerName)
    if (!claimed) {
      throw new Error('Gift not found')
    }
    return claimed
  },

  async getByTag(sessionId: SessionId, tagId: TagId): Promise<Gift[]> {
    return mockStore.getGiftsByTag(sessionId, tagId)
  },
}
