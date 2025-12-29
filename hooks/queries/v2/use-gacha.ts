import { useMutation } from '@tanstack/react-query'
import * as gachaActions from '@/lib/actions/gacha'
import type { GachaType, GachaResult } from '@/lib/actions/gacha'

export function useGacha() {
  return useMutation<
    GachaResult,
    Error,
    { type: GachaType; options?: { min?: number; max?: number } }
  >({
    mutationFn: ({ type, options }) =>
      gachaActions.executeGacha(type, options),
  })
}

