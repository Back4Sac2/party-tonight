'use client'

import { Button } from '@/shared/ui'

interface TagSelectProps {
  tags: string[]
  selectedTag: string
  onSelect: (tag: string) => void
  allowEmpty?: boolean
  emptyLabel?: string
  required?: boolean
  label?: string
  description?: string
}

export function TagSelect({
  tags,
  selectedTag,
  onSelect,
  allowEmpty = false,
  emptyLabel = '없음',
  required = false,
  label = '태그 선택',
  description,
}: TagSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {description && (
          <span className="text-xs text-gray-500 ml-2 font-normal">
            {description}
          </span>
        )}
      </label>
      {tags.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">
          사용 가능한 태그가 없습니다. 먼저 선물을 등록해주세요.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {allowEmpty && (
            <Button
              variant={selectedTag === '' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onSelect('')}
              className={
                selectedTag === ''
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : ''
              }
            >
              {emptyLabel}
            </Button>
          )}
          {tags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onSelect(tag)}
              className={
                selectedTag === tag
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : ''
              }
            >
              {tag}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
