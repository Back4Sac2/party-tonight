import { useQuery } from '@tanstack/react-query'
import * as usersActions from '@/lib/actions/users'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersActions.getUsers(),
  })
}
