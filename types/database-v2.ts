// Supabase Database 타입 정의 (v2)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          password_hash: string
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          password_hash: string
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          password_hash?: string
          role?: 'user' | 'admin'
          created_at?: string
        }
      }
      gifts: {
        Row: {
          id: string
          owner_id: string
          tag: string
          name: string
          description: string | null
          message: string | null
          revealed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          tag: string
          name: string
          description?: string | null
          message?: string | null
          revealed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          tag?: string
          name?: string
          description?: string | null
          message?: string | null
          revealed?: boolean
          created_at?: string
        }
      }
      games: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
        }
      }
      winners: {
        Row: {
          id: string
          game_id: string
          winner_user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          winner_user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          winner_user_id?: string
          created_at?: string
        }
      }
    }
  }
}
