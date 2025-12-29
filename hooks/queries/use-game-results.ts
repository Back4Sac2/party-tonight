import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gameResultRepository } from '@/repositories'
import { SessionId, GameId, TagId } from '@/types'

export function useGameResults(sessionId: SessionId | null) {
  return useQuery({
    queryKey: ['game-results', sessionId],
    queryFn: () => gameResultRepository.getBySession(sessionId!),
    enabled: !!sessionId,
  })
}

export function useCreateGameResult(sessionId: SessionId | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      gameId,
      winnerName,
    }: {
      gameId: GameId
      winnerName: string
    }) => gameResultRepository.create(sessionId!, gameId, winnerName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-results', sessionId] })
    },
  })
}

export function useSelectTag(sessionId: SessionId | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      gameResultId,
      tagId,
    }: {
      gameResultId: string
      tagId: TagId
    }) => gameResultRepository.selectTag(gameResultId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-results', sessionId] })
      queryClient.invalidateQueries({ queryKey: ['gifts', sessionId] })
    },
  })
}
