import { useQuery } from '@tanstack/react-query'
import * as usersActions from '@/lib/actions/users'

/**
 * 우승자 선택을 위한 유저 목록 (모든 유저 접근 가능)
 */
export function useUsersForSelection() {
  return useQuery({
    queryKey: ['users', 'selection'],
    queryFn: () => usersActions.getUsersForSelection(),
  })
}
