import { Tag, TagId, SessionId } from '@/types'
import { mockStore } from '@/lib/mock-data'

export const tagRepositoryMock = {
  async getBySession(sessionId: SessionId): Promise<Tag[]> {
    return mockStore.getTagsBySession(sessionId)
  },

  async create(
    sessionId: SessionId,
    tag: {
      name: string
      color?: string
    }
  ): Promise<Tag> {
    return mockStore.createTag(sessionId, tag)
  },

  async update(
    tagId: TagId,
    updates: Partial<Pick<Tag, 'name' | 'color'>>
  ): Promise<Tag> {
    const updated = mockStore.updateTag(tagId, updates)
    if (!updated) {
      throw new Error('Tag not found')
    }
    return updated
  },

  async delete(tagId: TagId): Promise<void> {
    mockStore.deleteTag(tagId)
  },
}
