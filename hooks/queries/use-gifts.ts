import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { giftRepository } from '@/repositories'
import { Gift, SessionId, GiftId, TagId } from '@/types'

export function useGifts(sessionId: SessionId | null) {
  return useQuery({
    queryKey: ['gifts', sessionId],
    queryFn: () => giftRepository.getBySession(sessionId!),
    enabled: !!sessionId,
  })
}

export function useCreateGift(sessionId: SessionId | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (gift: {
      name: string
      description?: string
      image_url?: string
    }) => giftRepository.create(sessionId!, gift),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', sessionId] })
    },
  })
}

export function useUpdateGift(sessionId: SessionId | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      giftId,
      updates,
    }: {
      giftId: GiftId
      updates: Partial<Gift>
    }) => giftRepository.update(giftId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', sessionId] })
    },
  })
}

export function useDeleteGift(sessionId: SessionId | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (giftId: GiftId) => giftRepository.delete(giftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', sessionId] })
    },
  })
}

export function useGiftTags(giftId: GiftId) {
  return useQuery({
    queryKey: ['gift-tags', giftId],
    queryFn: () => giftRepository.getTags(giftId),
    enabled: !!giftId,
  })
}

export function useAddGiftTag(sessionId: SessionId | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ giftId, tagId }: { giftId: GiftId; tagId: TagId }) =>
      giftRepository.addTag(giftId, tagId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['gift-tags', variables.giftId],
      })
      queryClient.invalidateQueries({ queryKey: ['gifts', sessionId] })
    },
  })
}

export function useRemoveGiftTag(sessionId: SessionId | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ giftId, tagId }: { giftId: GiftId; tagId: TagId }) =>
      giftRepository.removeTag(giftId, tagId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['gift-tags', variables.giftId],
      })
      queryClient.invalidateQueries({ queryKey: ['gifts', sessionId] })
    },
  })
}

export function useClaimGift(sessionId: SessionId | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      giftId,
      winnerName,
    }: {
      giftId: GiftId
      winnerName: string
    }) => giftRepository.claim(giftId, winnerName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', sessionId] })
    },
  })
}

export function useGiftsByTag(sessionId: SessionId | null, tagId: TagId) {
  return useQuery({
    queryKey: ['gifts-by-tag', sessionId, tagId],
    queryFn: () => giftRepository.getByTag(sessionId!, tagId),
    enabled: !!sessionId && !!tagId,
  })
}
