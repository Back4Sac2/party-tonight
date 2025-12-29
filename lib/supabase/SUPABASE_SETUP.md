# Supabase 데이터베이스 설정 가이드

## 📋 설정 순서

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: party-tonight (또는 원하는 이름)
   - **Database Password**: 안전한 비밀번호 설정 (기억해두세요!)
   - **Region**: 가장 가까운 리전 선택
4. 프로젝트 생성 완료까지 대기 (약 2분)

### 2. 환경 변수 설정

프로젝트가 생성되면:

1. **Settings** → **API** 메뉴로 이동
2. 다음 정보를 복사:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** 키 (또는 **Publishable API Key**) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - ⚠️ **Database Password가 아닙니다!**
     - "anon" 또는 "public" 키를 사용하세요
     - `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 형태의 긴 문자열입니다

3. 프로젝트 루트의 `.env.local` 파일에 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon public 키)
NEXT_PUBLIC_ACCESS_CODE=1234
```

**참고**:

- ✅ **anon public key** (사용할 것) - 클라이언트에서 사용하는 공개 키
- ❌ **Database Password** (사용하지 않음) - 데이터베이스 직접 접근용
- ❌ **service_role key** (사용하지 않음) - 서버 전용 비밀 키 (노출 금지!)

### 3. 데이터베이스 스키마 생성

1. Supabase 대시보드에서 **SQL Editor** 메뉴로 이동
2. **New Query** 클릭
3. 다음 중 하나를 선택:

#### 방법 1: 전체 설정 (권장)

`lib/supabase/setup.sql` 파일의 전체 내용을 복사하여 실행

#### 방법 2: 단계별 설정

1. `lib/supabase/schema.sql` 파일 내용 실행 (스키마 생성)
2. `lib/supabase/seed.sql` 파일 내용 실행 (초기 데이터)

3. **Run** 버튼 클릭하여 실행
4. 성공 메시지 확인

### 4. 데이터 확인

SQL Editor에서 다음 쿼리로 확인:

```sql
-- 게임 목록 확인
SELECT * FROM games ORDER BY created_at;

-- 테이블 목록 확인
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- RLS 정책 확인
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

## 🔍 문제 해결

### 테이블이 이미 존재하는 경우

```sql
-- 기존 테이블 삭제 (주의: 모든 데이터가 삭제됩니다!)
DROP TABLE IF EXISTS tag_selections CASCADE;
DROP TABLE IF EXISTS game_results CASCADE;
DROP TABLE IF EXISTS gift_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS gifts CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
```

그 후 `setup.sql`을 다시 실행하세요.

### RLS 정책 오류

정책이 이미 존재하면 오류가 발생할 수 있습니다. `setup.sql`에는 `DROP POLICY IF EXISTS`가 포함되어 있어 재실행 시 자동으로 처리됩니다.

### 게임 데이터 중복 방지

`ON CONFLICT DO NOTHING`을 사용하여 중복 삽입을 방지했습니다. 여러 번 실행해도 안전합니다.

## 📊 테이블 구조 요약

```
sessions (세션)
  ├── id (UUID, PK)
  ├── created_at
  └── last_active_at

games (게임)
  ├── id (UUID, PK)
  ├── name
  ├── description
  ├── rules
  └── created_at

gifts (선물)
  ├── id (UUID, PK)
  ├── session_id (FK → sessions)
  ├── name
  ├── description
  ├── is_claimed
  └── claimed_by

tags (태그)
  ├── id (UUID, PK)
  ├── session_id (FK → sessions)
  ├── name
  └── color

gift_tags (선물-태그 관계)
  ├── gift_id (FK → gifts)
  └── tag_id (FK → tags)

game_results (게임 결과)
  ├── id (UUID, PK)
  ├── session_id (FK → sessions)
  ├── game_id (FK → games)
  └── winner_name

tag_selections (태그 선택)
  ├── game_result_id (FK → game_results)
  └── tag_id (FK → tags)
```

## 🚀 다음 단계

1. 환경 변수 설정 완료 확인
2. 개발 서버 재시작: `npm run dev`
3. 브라우저에서 앱 접속하여 테스트
4. 게임 목록이 표시되는지 확인

## 💡 유용한 쿼리

### 게임 추가

```sql
INSERT INTO games (name, description, rules)
VALUES (
  '게임 이름',
  '게임 설명',
  '게임 규칙'
);
```

### 세션별 선물 확인

```sql
SELECT g.*, s.created_at as session_created
FROM gifts g
JOIN sessions s ON g.session_id = s.id
WHERE s.id = 'your-session-id';
```

### 게임 결과 통계

```sql
SELECT
  g.name as game_name,
  COUNT(gr.id) as play_count
FROM games g
LEFT JOIN game_results gr ON g.id = gr.game_id
GROUP BY g.id, g.name
ORDER BY play_count DESC;
```
