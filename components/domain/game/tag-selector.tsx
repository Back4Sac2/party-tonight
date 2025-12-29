'use client'

import { useState } from 'react'
import { useTags, useSelectTag, useGiftsByTag } from '@/hooks/queries'
import { useSession } from '@/hooks/use-session'
import { Tag } from '@/types'
import { TagList } from '../tag/tag-list'
import { GiftList } from '../gift/gift-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TagSelectorProps {
  gameResultId: string
}

export function TagSelector({ gameResultId }: TagSelectorProps) {
  const { sessionId } = useSession()
  const { data: tags } = useTags(sessionId)
  const selectTag = useSelectTag(sessionId)
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null)
  const { data: availableGifts } = useGiftsByTag(sessionId, selectedTagId || '')

  const handleTagSelect = async (tag: Tag) => {
    if (selectedTagId === tag.id) return

    try {
      await selectTag.mutateAsync({
        gameResultId,
        tagId: tag.id,
      })
      setSelectedTagId(tag.id)
    } catch (error) {
      console.error('Failed to select tag:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>태그를 선택하세요</CardTitle>
        </CardHeader>
        <CardContent>
          <TagList
            selectedTagIds={selectedTagId ? [selectedTagId] : []}
            onTagClick={handleTagSelect}
          />
        </CardContent>
      </Card>

      {selectedTagId && availableGifts && (
        <Card>
          <CardHeader>
            <CardTitle>선택한 태그의 선물</CardTitle>
          </CardHeader>
          <CardContent>
            {availableGifts.length > 0 ? (
              <GiftList />
            ) : (
              <p className="text-gray-500 text-center py-4">
                이 태그에 해당하는 선물이 없습니다.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
