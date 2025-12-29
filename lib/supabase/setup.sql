-- ============================================
-- Supabase 전체 설정 스크립트
-- ============================================
-- 이 파일은 Supabase SQL Editor에서 순서대로 실행하세요
-- 또는 schema.sql과 seed.sql을 각각 실행하세요

-- ============================================
-- 1단계: 스키마 생성
-- ============================================

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

-- ============================================
-- 2단계: 인덱스 생성
-- ============================================

CREATE INDEX IF NOT EXISTS idx_gifts_session_id ON gifts(session_id);
CREATE INDEX IF NOT EXISTS idx_tags_session_id ON tags(session_id);
CREATE INDEX IF NOT EXISTS idx_gift_tags_gift_id ON gift_tags(gift_id);
CREATE INDEX IF NOT EXISTS idx_gift_tags_tag_id ON gift_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_game_results_session_id ON game_results(session_id);
CREATE INDEX IF NOT EXISTS idx_game_results_game_id ON game_results(game_id);
CREATE INDEX IF NOT EXISTS idx_sessions_last_active_at ON sessions(last_active_at);

-- ============================================
-- 3단계: RLS (Row Level Security) 설정
-- ============================================

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_selections ENABLE ROW LEVEL SECURITY;

-- 기존 정책이 있으면 삭제 (재실행 시)
DROP POLICY IF EXISTS "Allow all operations on sessions" ON sessions;
DROP POLICY IF EXISTS "Allow all operations on gifts" ON gifts;
DROP POLICY IF EXISTS "Allow all operations on tags" ON tags;
DROP POLICY IF EXISTS "Allow all operations on gift_tags" ON gift_tags;
DROP POLICY IF EXISTS "Allow all operations on games" ON games;
DROP POLICY IF EXISTS "Allow all operations on game_results" ON game_results;
DROP POLICY IF EXISTS "Allow all operations on tag_selections" ON tag_selections;

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

-- ============================================
-- 4단계: 초기 데이터 삽입
-- ============================================

-- 샘플 게임 데이터 삽입
INSERT INTO games (name, description, rules, created_at)
VALUES
  (
    '가위바위보',
    '전통적인 가위바위보 게임',
    '1. 모두 동시에 가위, 바위, 보 중 하나를 낸다
2. 승자가 결정될 때까지 반복한다
3. 최종 승자가 우승자이다',
    NOW()
  ),
  (
    '숫자 맞추기',
    '1부터 100까지 숫자 맞추기',
    '1. 한 사람이 1부터 100까지 숫자 중 하나를 생각한다
2. 다른 사람들이 번갈아가며 숫자를 말한다
3. 가장 가까운 사람이 우승자이다',
    NOW()
  ),
  (
    '퀴즈 대회',
    '상식 퀴즈 대회',
    '1. 문제를 하나씩 출제한다
2. 가장 먼저 정답을 맞춘 사람이 우승자이다',
    NOW()
  ),
  (
    '보물찾기',
    '방 안에 숨겨진 보물 찾기',
    '1. 보물을 한 곳에 숨긴다
2. 힌트를 하나씩 제공한다
3. 가장 먼저 찾은 사람이 우승자이다',
    NOW()
  ),
  (
    '그림 맞추기',
    '그림 보고 단어 맞추기',
    '1. 한 사람이 그림을 그린다
2. 다른 사람들이 그림을 보고 단어를 맞춘다
3. 가장 먼저 맞춘 사람이 우승자이다',
    NOW()
  ),
  (
    '노래 맞추기',
    '음악 듣고 노래 제목 맞추기',
    '1. 노래 일부를 재생한다
2. 노래 제목을 맞춘다
3. 가장 먼저 맞춘 사람이 우승자이다',
    NOW()
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- 완료 메시지
-- ============================================

-- 데이터 확인 (선택사항)
-- SELECT COUNT(*) as game_count FROM games;
-- SELECT * FROM games ORDER BY created_at;

