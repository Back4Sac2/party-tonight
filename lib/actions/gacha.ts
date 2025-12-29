'use server'

import { getUsersForSelection } from './users'
import { getTags } from './tags'
import { getGames } from './games'

export type GachaType = 'user' | 'tag' | 'game' | 'number'

export interface GachaResult {
  type: GachaType
  result: string | number
  metadata?: {
    user?: { id: string; name: string }
    tag?: string
    game?: { id: string; name: string }
    numberRange?: { min: number; max: number }
  }
}

/**
 * 유저 가챠
 */
export async function gachaUser(): Promise<GachaResult> {
  const users = await getUsersForSelection()
  if (users.length === 0) {
    throw new Error('가챠할 유저가 없습니다.')
  }

  const randomIndex = Math.floor(Math.random() * users.length)
  const selectedUser = users[randomIndex]

  return {
    type: 'user',
    result: selectedUser.name,
    metadata: {
      user: {
        id: selectedUser.id,
        name: selectedUser.name,
      },
    },
  }
}

/**
 * 태그 가챠
 */
export async function gachaTag(): Promise<GachaResult> {
  const tags = await getTags()
  if (tags.length === 0) {
    throw new Error('가챠할 태그가 없습니다.')
  }

  const randomIndex = Math.floor(Math.random() * tags.length)
  const selectedTag = tags[randomIndex]

  return {
    type: 'tag',
    result: selectedTag,
    metadata: {
      tag: selectedTag,
    },
  }
}

/**
 * 게임 가챠
 */
export async function gachaGame(): Promise<GachaResult> {
  const games = await getGames()
  if (games.length === 0) {
    throw new Error('가챠할 게임이 없습니다.')
  }

  const randomIndex = Math.floor(Math.random() * games.length)
  const selectedGame = games[randomIndex]

  return {
    type: 'game',
    result: selectedGame.name,
    metadata: {
      game: {
        id: selectedGame.id,
        name: selectedGame.name,
      },
    },
  }
}

/**
 * 숫자 가챠
 */
export async function gachaNumber(
  min: number,
  max: number
): Promise<GachaResult> {
  if (min >= max) {
    throw new Error('최소값은 최대값보다 작아야 합니다.')
  }

  if (min < 0 || max < 0) {
    throw new Error('숫자는 0 이상이어야 합니다.')
  }

  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min

  return {
    type: 'number',
    result: randomNumber,
    metadata: {
      numberRange: {
        min,
        max,
      },
    },
  }
}

/**
 * 가챠 실행 (타입에 따라 자동으로 적절한 함수 호출)
 */
export async function executeGacha(
  type: GachaType,
  options?: { min?: number; max?: number }
): Promise<GachaResult> {
  switch (type) {
    case 'user':
      return gachaUser()
    case 'tag':
      return gachaTag()
    case 'game':
      return gachaGame()
    case 'number':
      if (!options?.min || !options?.max) {
        throw new Error('숫자 가챠는 최소값과 최대값이 필요합니다.')
      }
      return gachaNumber(options.min, options.max)
    default:
      throw new Error('알 수 없는 가챠 타입입니다.')
  }
}
