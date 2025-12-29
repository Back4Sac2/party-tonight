import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as tagsActions from '@/lib/actions/tags'

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsActions.getTags(),
    staleTime: 0, // 항상 최신 데이터 가져오기
  })
}

export function useInvalidateTags() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['tags'] })
}
