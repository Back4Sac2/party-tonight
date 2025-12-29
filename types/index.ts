// 공통 타입 정의

export type SessionId = string
export type GameId = string
export type GiftId = string
export type TagId = string

// 세션 정보
export interface Session {
  id: SessionId
  created_at: string
  last_active_at: string
}

// 선물
export interface Gift {
  id: GiftId
  session_id: SessionId
  name: string
  description?: string
  image_url?: string
  created_at: string
  is_claimed: boolean
  claimed_by?: string
  claimed_at?: string
}

// 태그
export interface Tag {
  id: TagId
  session_id: SessionId
  name: string
  color?: string
  created_at: string
}

// 선물-태그 관계 (다대다)
export interface GiftTag {
  gift_id: GiftId
  tag_id: TagId
}

// 게임
export interface Game {
  id: GameId
  name: string
  description: string
  rules: string
  image_url?: string
  created_at: string
}

// 게임 결과 (우승자 기록)
export interface GameResult {
  id: string
  session_id: SessionId
  game_id: GameId
  winner_name: string
  played_at: string
}

// 태그 선택 결과
export interface TagSelection {
  game_result_id: string
  tag_id: TagId
  selected_at: string
}
