-- ============================================
-- Party Tonight v2 - 스키마 업데이트
-- 게임 관리, 가방 시스템 추가
-- ============================================

-- 1. games 테이블에 creator_id, tag 추가
ALTER TABLE games
ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS tag TEXT;

CREATE INDEX IF NOT EXISTS idx_games_creator_id ON games(creator_id);
CREATE INDEX IF NOT EXISTS idx_games_tag ON games(tag);

-- 2. winners 테이블에 tag 추가 (우승자가 받은 태그)
ALTER TABLE winners
ADD COLUMN IF NOT EXISTS tag TEXT;

CREATE INDEX IF NOT EXISTS idx_winners_tag ON winners(tag);

-- 3. gifts 테이블에 recipient_id 추가 (선물을 받은 사람)
ALTER TABLE gifts
ADD COLUMN IF NOT EXISTS recipient_id UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_gifts_recipient_id ON gifts(recipient_id);

-- 4. 기존 게임들에 creator_id 설정 (NULL로 두거나 관리자로 설정)
-- 필요시 수동으로 업데이트

