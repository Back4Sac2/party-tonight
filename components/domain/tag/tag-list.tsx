'use client'

import { useTags } from '@/hooks/queries'
import { useSession } from '@/hooks/use-session'
import { Tag } from '@/types'
import { Badge } from '@/components/ui/badge'

interface TagListProps {
  selectedTagIds?: string[]
  onTagClick?: (tag: Tag) => void
  showSelectedOnly?: boolean
}

export function TagList({
  selectedTagIds = [],
  onTagClick,
  showSelectedOnly = false,
}: TagListProps) {
  const { sessionId } = useSession()
  const { data: tags, isLoading } = useTags(sessionId)

  if (isLoading) {
    return <div className="text-center py-4">로딩 중...</div>
  }

  if (!tags || tags.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        아직 태그가 없습니다.
      </div>
    )
  }

  const displayTags = showSelectedOnly
    ? tags.filter(tag => selectedTagIds.includes(tag.id))
    : tags

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map(tag => {
        const isSelected = selectedTagIds.includes(tag.id)
        return (
          <Badge
            key={tag.id}
            variant={isSelected ? 'default' : 'outline'}
            className="cursor-pointer"
            style={tag.color ? { backgroundColor: tag.color } : undefined}
            onClick={() => onTagClick?.(tag)}
          >
            {tag.name}
          </Badge>
        )
      })}
    </div>
  )
}
