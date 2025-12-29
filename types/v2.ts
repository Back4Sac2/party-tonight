// v2 타입 정의

export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  name: string
  password_hash: string
  role: UserRole
  created_at: string
}

export interface Gift {
  id: string
  owner_id: string
  tag: string // 공개되는 키워드
  name: string // 실제 선물명 (공개 후 보임)
  description: string | null
  message: string | null
  revealed: boolean
  created_at: string
}

export interface Game {
  id: string
  name: string
  description: string
  created_at: string
}

export interface Winner {
  id: string
  game_id: string
  winner_user_id: string
  created_at: string
}
