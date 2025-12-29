import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as winnersActions from '@/lib/actions/winners'

export function useCreateWinner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      gameId,
      winnerUserId,
      tag,
    }: {
      gameId: string
      winnerUserId: string
      tag: string
    }) => winnersActions.createWinner(gameId, winnerUserId, tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['bag'] })
    },
  })
}
