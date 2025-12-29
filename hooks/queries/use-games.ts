import { useQuery } from '@tanstack/react-query'
import { gameRepository } from '@/repositories'
import { GameId } from '@/types'

export function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: () => gameRepository.getAll(),
  })
}

export function useGame(gameId: GameId | null) {
  return useQuery({
    queryKey: ['game', gameId],
    queryFn: () => gameRepository.getById(gameId!),
    enabled: !!gameId,
  })
}
