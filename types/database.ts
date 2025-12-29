// Supabase Database 타입 정의
// 이 파일은 Supabase에서 자동 생성되거나 수동으로 관리할 수 있습니다.

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
      sessions: {
        Row: {
          id: string
          created_at: string
          last_active_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          last_active_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          last_active_at?: string
        }
      }
      gifts: {
        Row: {
          id: string
          session_id: string
          name: string
          description: string | null
          image_url: string | null
          created_at: string
          is_claimed: boolean
          claimed_by: string | null
          claimed_at: string | null
        }
        Insert: {
          id?: string
          session_id: string
          name: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          is_claimed?: boolean
          claimed_by?: string | null
          claimed_at?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          is_claimed?: boolean
          claimed_by?: string | null
          claimed_at?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          session_id: string
          name: string
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          name: string
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          name?: string
          color?: string | null
          created_at?: string
        }
      }
      gift_tags: {
        Row: {
          gift_id: string
          tag_id: string
        }
        Insert: {
          gift_id: string
          tag_id: string
        }
        Update: {
          gift_id?: string
          tag_id?: string
        }
      }
      games: {
        Row: {
          id: string
          name: string
          description: string
          rules: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          rules: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          rules?: string
          image_url?: string | null
          created_at?: string
        }
      }
      game_results: {
        Row: {
          id: string
          session_id: string
          game_id: string
          winner_name: string
          played_at: string
        }
        Insert: {
          id?: string
          session_id: string
          game_id: string
          winner_name: string
          played_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          game_id?: string
          winner_name?: string
          played_at?: string
        }
      }
      tag_selections: {
        Row: {
          game_result_id: string
          tag_id: string
          selected_at: string
        }
        Insert: {
          game_result_id: string
          tag_id: string
          selected_at?: string
        }
        Update: {
          game_result_id?: string
          tag_id?: string
          selected_at?: string
        }
      }
    }
  }
}
