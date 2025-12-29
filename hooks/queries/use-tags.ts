import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tagRepository } from '@/repositories'
import { Tag, SessionId, TagId } from '@/types'

export function useTags(sessionId: SessionId | null) {
  return useQuery({
    queryKey: ['tags', sessionId],
    queryFn: () => tagRepository.getBySession(sessionId!),
    enabled: !!sessionId,
  })
}

export function useCreateTag(sessionId: SessionId | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tag: { name: string; color?: string }) =>
      tagRepository.create(sessionId!, tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags', sessionId] })
    },
  })
}

export function useUpdateTag(sessionId: SessionId | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tagId, updates }: { tagId: TagId; updates: Partial<Tag> }) =>
      tagRepository.update(tagId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags', sessionId] })
    },
  })
}

export function useDeleteTag(sessionId: SessionId | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tagId: TagId) => tagRepository.delete(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags', sessionId] })
    },
  })
}
