import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as giftsActions from '@/lib/actions/gifts'

export function useGifts(all?: boolean) {
  return useQuery({
    queryKey: ['gifts', all ? 'all' : 'mine'],
    queryFn: () => giftsActions.getGifts(all),
  })
}

export function useGift(id: string | null) {
  return useQuery({
    queryKey: ['gifts', id],
    queryFn: () => giftsActions.getGift(id!),
    enabled: !!id,
  })
}

export function useCreateGift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      tag,
      name,
      description,
      message,
    }: {
      tag: string
      name: string
      description?: string | null
      message?: string | null
    }) => giftsActions.createGift(tag, name, description, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useUpdateGift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      tag,
      name,
      description,
      message,
    }: {
      id: string
      tag: string
      name: string
      description?: string | null
      message?: string | null
    }) => giftsActions.updateGift(id, tag, name, description, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] })
      queryClient.invalidateQueries({ queryKey: ['gifts', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useDeleteGift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => giftsActions.deleteGift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['bag'] })
    },
  })
}
