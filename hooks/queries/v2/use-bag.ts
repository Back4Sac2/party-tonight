import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as bagActions from '@/lib/actions/bag'

export function useBagGifts() {
  return useQuery({
    queryKey: ['bag'],
    queryFn: () => bagActions.getBagGifts(),
  })
}

export function useOpenGift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => bagActions.openGift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bag'] })
    },
  })
}
