-- ============================================
-- Party Tonight v2 - 새로운 데이터베이스 스키마
-- ============================================

-- 기존 테이블 삭제 (마이그레이션 시)
DROP TABLE IF EXISTS tag_selections CASCADE;
DROP TABLE IF EXISTS game_results CASCADE;
DROP TABLE IF EXISTS gift_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS gifts CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- ============================================
-- 1. users 테이블
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 2. gifts 테이블
-- ============================================
CREATE TABLE gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag TEXT NOT NULL, -- 공개되는 키워드 (우승자가 보는 것)
  name TEXT NOT NULL, -- 실제 선물명 (태그 선택 후 공개)
  description TEXT, -- 선물 설명
  message TEXT, -- 선물 메시지
  revealed BOOLEAN NOT NULL DEFAULT FALSE, -- 공개 여부
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gifts_owner_id ON gifts(owner_id);
CREATE INDEX idx_gifts_tag ON gifts(tag);
CREATE INDEX idx_gifts_revealed ON gifts(revealed);

-- ============================================
-- 3. games 테이블
-- ============================================
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 4. winners 테이블
-- ============================================
CREATE TABLE winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  winner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_winners_game_id ON winners(game_id);
CREATE INDEX idx_winners_winner_user_id ON winners(winner_user_id);

-- ============================================
-- 5. RLS (Row Level Security) 설정
-- ============================================

-- users 테이블
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 자신의 정보를 읽을 수 있음
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR true);

-- 모든 사용자가 자신의 정보를 업데이트할 수 있음
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- 하지만 비로그인 환경이므로 RLS는 비활성화하고 서버에서 권한 체크
-- 실제로는 서버 사이드에서 권한을 체크하므로 RLS는 모든 접근 허용
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- gifts 테이블
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on gifts" ON gifts
  FOR ALL USING (true) WITH CHECK (true);

-- games 테이블
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on games" ON games
  FOR ALL USING (true) WITH CHECK (true);

-- winners 테이블
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on winners" ON winners
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 6. 초기 데이터 (게임)
-- ============================================

INSERT INTO games (name, description)
VALUES
  ('가위바위보', '전통적인 가위바위보 게임'),
  ('숫자 맞추기', '1부터 100까지 숫자 맞추기'),
  ('퀴즈 대회', '상식 퀴즈 대회'),
  ('보물찾기', '방 안에 숨겨진 보물 찾기'),
  ('그림 맞추기', '그림 보고 단어 맞추기'),
  ('노래 맞추기', '음악 듣고 노래 제목 맞추기')
ON CONFLICT DO NOTHING;

