'use client'

import { Button } from '@/shared/ui'
import type { User } from '@/lib/actions/users'

interface UserSelectProps {
  users: User[]
  selectedUserId: string
  onSelect: (userId: string) => void
  required?: boolean
  label?: string
}

export function UserSelect({
  users,
  selectedUserId,
  onSelect,
  required = false,
  label = '유저 선택',
}: UserSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {users.map(user => (
          <Button
            key={user.id}
            variant={selectedUserId === user.id ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onSelect(user.id)}
            className={
              selectedUserId === user.id
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : ''
            }
          >
            {user.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
