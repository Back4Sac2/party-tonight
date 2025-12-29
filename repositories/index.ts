import { isMockMode } from '@/lib/config'
import * as realRepos from './index.real'
import * as mockRepos from './mock'

// 환경 변수에 따라 실제 repository 또는 mock repository 사용
export const sessionRepository = isMockMode
  ? mockRepos.sessionRepositoryMock
  : realRepos.sessionRepository

export const giftRepository = isMockMode
  ? mockRepos.giftRepositoryMock
  : realRepos.giftRepository

export const tagRepository = isMockMode
  ? mockRepos.tagRepositoryMock
  : realRepos.tagRepository

export const gameRepository = isMockMode
  ? mockRepos.gameRepositoryMock
  : realRepos.gameRepository

export const gameResultRepository = isMockMode
  ? mockRepos.gameResultRepositoryMock
  : realRepos.gameResultRepository
