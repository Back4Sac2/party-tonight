import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as gamesActions from '@/lib/actions/games'

export function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: () => gamesActions.getGames(),
  })
}

export function useGame(id: string | null) {
  return useQuery({
    queryKey: ['games', id],
    queryFn: () => gamesActions.getGame(id!),
    enabled: !!id,
  })
}

export function useCreateGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      name,
      description,
      tag,
    }: {
      name: string
      description: string
      tag?: string | null
    }) => gamesActions.createGame(name, description, tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })
}

export function useUpdateGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      name,
      description,
      tag,
    }: {
      id: string
      name: string
      description: string
      tag?: string | null
    }) => gamesActions.updateGame(id, name, description, tag),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['games', variables.id] })
    },
  })
}

export function useDeleteGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => gamesActions.deleteGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })
}
