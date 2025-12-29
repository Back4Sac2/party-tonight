-- Supabase Database Schema
-- 이 SQL 파일은 Supabase 대시보드에서 실행하거나 마이그레이션으로 관리할 수 있습니다.

-- 세션 테이블 (비로그인 사용자 세션)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 게임 테이블 (미리 정의된 게임들)
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  rules TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 선물 테이블
CREATE TABLE IF NOT EXISTS gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_claimed BOOLEAN NOT NULL DEFAULT FALSE,
  claimed_by TEXT,
  claimed_at TIMESTAMPTZ
);

-- 태그 테이블
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 선물-태그 관계 테이블 (다대다)
CREATE TABLE IF NOT EXISTS gift_tags (
  gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (gift_id, tag_id)
);

-- 게임 결과 테이블 (우승자 기록)
CREATE TABLE IF NOT EXISTS game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  winner_name TEXT NOT NULL,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 태그 선택 결과 테이블
CREATE TABLE IF NOT EXISTS tag_selections (
  game_result_id UUID NOT NULL REFERENCES game_results(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  selected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (game_result_id, tag_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_gifts_session_id ON gifts(session_id);
CREATE INDEX IF NOT EXISTS idx_tags_session_id ON tags(session_id);
CREATE INDEX IF NOT EXISTS idx_gift_tags_gift_id ON gift_tags(gift_id);
CREATE INDEX IF NOT EXISTS idx_gift_tags_tag_id ON gift_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_game_results_session_id ON game_results(session_id);
CREATE INDEX IF NOT EXISTS idx_game_results_game_id ON game_results(game_id);
CREATE INDEX IF NOT EXISTS idx_sessions_last_active_at ON sessions(last_active_at);

-- RLS (Row Level Security) 정책 설정
-- 모든 테이블에 대해 읽기/쓰기 허용 (비로그인 사용자 지원)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_selections ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽고 쓸 수 있도록 정책 설정
CREATE POLICY "Allow all operations on sessions" ON sessions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on gifts" ON gifts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on tags" ON tags
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on gift_tags" ON gift_tags
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on games" ON games
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on game_results" ON game_results
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on tag_selections" ON tag_selections
  FOR ALL USING (true) WITH CHECK (true);

