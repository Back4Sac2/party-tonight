# 🎁 Party Tonight

친구들과 함께 즐기는 선물 게임 웹앱입니다.

## 📋 프로젝트 개요

여러 친구들이 한 기기 또는 여러 기기에서 접속해 사용할 수 있는 선물 게임 앱입니다. 유저는 선물을 추가하고 태그를 설정하며, 게임에서 우승한 사람이 태그를 선택해 선물을 획득합니다.

## 🛠 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **State Management**: Zustand + React Query
- **Code Quality**: ESLint + Prettier
- **Deployment**: Vercel

## 📁 프로젝트 구조

```
party_tonight/
├── app/                          # Next.js App Router 페이지
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 홈 페이지
│   ├── providers.tsx            # React Query Provider
│   ├── globals.css              # 전역 스타일
│   ├── gifts/                   # 선물 관리 페이지
│   │   └── page.tsx
│   └── games/                   # 게임 관련 페이지
│       ├── page.tsx             # 게임 목록
│       └── [id]/                # 동적 라우트
│           ├── page.tsx         # 게임 상세
│           └── select-tag/
│               └── page.tsx     # 태그 선택 페이지
│
├── components/                   # React 컴포넌트
│   ├── ui/                      # 기본 UI 컴포넌트 (Atomic)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   ├── domain/                  # 도메인별 컴포넌트
│   │   ├── gift/                # 선물 관련
│   │   │   ├── gift-list.tsx
│   │   │   ├── gift-card.tsx
│   │   │   └── gift-form.tsx
│   │   ├── tag/                 # 태그 관련
│   │   │   ├── tag-list.tsx
│   │   │   └── tag-form.tsx
│   │   └── game/                # 게임 관련
│   │       ├── game-list.tsx
│   │       ├── game-detail.tsx
│   │       ├── winner-selector.tsx
│   │       └── tag-selector.tsx
│   └── layout/                  # 레이아웃 컴포넌트
│       ├── header.tsx
│       └── footer.tsx
│
├── lib/                          # 유틸리티 및 설정
│   ├── supabase/
│   │   ├── client.ts            # Supabase 클라이언트
│   │   └── schema.sql           # 데이터베이스 스키마
│   ├── session.ts               # 세션 ID 관리
│   └── utils.ts                 # 공통 유틸리티
│
├── types/                        # TypeScript 타입 정의
│   ├── index.ts                 # 도메인 타입
│   └── database.ts              # Supabase DB 타입
│
├── repositories/                 # 데이터 접근 레이어
│   ├── session.repository.ts
│   ├── gift.repository.ts
│   ├── tag.repository.ts
│   ├── game.repository.ts
│   ├── game-result.repository.ts
│   └── index.ts
│
├── stores/                       # Zustand 상태 관리
│   ├── session.store.ts
│   └── index.ts
│
└── hooks/                        # React Hooks
    ├── use-session.ts           # 세션 훅
    └── queries/                 # React Query 훅
        ├── use-gifts.ts
        ├── use-tags.ts
        ├── use-games.ts
        ├── use-game-results.ts
        └── index.ts
```

## 🗄 데이터베이스 구조

### 테이블

1. **sessions** - 비로그인 사용자 세션
   - `id` (UUID, PK)
   - `created_at` (TIMESTAMPTZ)
   - `last_active_at` (TIMESTAMPTZ)

2. **gifts** - 선물
   - `id` (UUID, PK)
   - `session_id` (UUID, FK → sessions)
   - `name` (TEXT)
   - `description` (TEXT, nullable)
   - `image_url` (TEXT, nullable)
   - `created_at` (TIMESTAMPTZ)
   - `is_claimed` (BOOLEAN)
   - `claimed_by` (TEXT, nullable)
   - `claimed_at` (TIMESTAMPTZ, nullable)

3. **tags** - 태그
   - `id` (UUID, PK)
   - `session_id` (UUID, FK → sessions)
   - `name` (TEXT)
   - `color` (TEXT, nullable)
   - `created_at` (TIMESTAMPTZ)

4. **gift_tags** - 선물-태그 관계 (다대다)
   - `gift_id` (UUID, FK → gifts)
   - `tag_id` (UUID, FK → tags)
   - Primary Key: (gift_id, tag_id)

5. **games** - 게임 정의
   - `id` (UUID, PK)
   - `name` (TEXT)
   - `description` (TEXT)
   - `rules` (TEXT)
   - `image_url` (TEXT, nullable)
   - `created_at` (TIMESTAMPTZ)

6. **game_results** - 게임 결과 (우승자 기록)
   - `id` (UUID, PK)
   - `session_id` (UUID, FK → sessions)
   - `game_id` (UUID, FK → games)
   - `winner_name` (TEXT)
   - `played_at` (TIMESTAMPTZ)

7. **tag_selections** - 태그 선택 결과
   - `game_result_id` (UUID, FK → game_results)
   - `tag_id` (UUID, FK → tags)
   - `selected_at` (TIMESTAMPTZ)
   - Primary Key: (game_result_id, tag_id)

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정 (선택사항 - Mock 모드 사용 시 불필요)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 접근 제어 설정 (필수)
NEXT_PUBLIC_ACCESS_CODE=your_secret_code_123
```

**접근 제어 코드 설정**:

- `NEXT_PUBLIC_ACCESS_CODE`: 친구들에게만 공유할 입장 코드 (4~10자리 권장)
- 이 코드를 모르면 앱에 접근할 수 없습니다
- 프로덕션에서는 Vercel 환경 변수로 설정하세요

### 3. Supabase 데이터베이스 설정

1. Supabase 프로젝트 생성
2. `lib/supabase/schema.sql` 파일의 내용을 Supabase SQL Editor에서 실행
3. RLS (Row Level Security) 정책이 자동으로 설정됩니다

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🔧 코드 품질 관리

### ESLint

코드 린팅을 실행합니다:

```bash
npm run lint
```

자동 수정:

```bash
npm run lint:fix
```

### Prettier

코드 포맷팅을 실행합니다:

```bash
npm run format
```

포맷팅 검사만 실행:

```bash
npm run format:check
```

### VS Code 설정

프로젝트에 포함된 `.vscode/settings.json` 파일로 다음이 자동 설정됩니다:

- 저장 시 자동 포맷팅 (Prettier)
- 저장 시 자동 ESLint 수정
- TypeScript/JavaScript 파일에 Prettier 사용

## 📱 주요 기능

### 1. 세션 관리

- 비로그인 사용자를 위한 자동 세션 ID 생성
- 로컬 스토리지에 세션 ID 저장
- Supabase에 세션 정보 자동 등록

### 2. 선물 관리

- 선물 추가/수정/삭제
- 선물에 태그 연결
- 선물 획득 상태 관리

### 3. 태그 관리

- 태그 추가/수정/삭제
- 태그별 색상 설정
- 선물과 태그 다대다 관계

### 4. 게임 플로우

- 게임 목록 조회
- 게임 상세 정보 확인
- 우승자 선택
- 태그 선택 및 선물 획득

## 🎨 UI/UX 플로우

```
홈 페이지 (/)
├── 게임 목록 섹션
│   └── 게임 클릭 → 게임 상세 페이지 (/games/[id])
│       ├── 게임 설명 확인
│       └── 우승자 선택
│           └── 태그 선택 페이지 (/games/[id]/select-tag)
│               ├── 태그 목록 표시
│               ├── 태그 선택
│               └── 해당 태그의 선물 목록 표시
│
└── 선물 목록 섹션
    └── 선물 관리 페이지 (/gifts)
        ├── 선물 추가/수정/삭제
        └── 태그 추가/수정/삭제
```

## 🏗 아키텍처 패턴

### 컴포넌트 구조

- **Atomic Design + Domain 기반 혼합**
  - `components/ui/`: 재사용 가능한 기본 UI 컴포넌트
  - `components/domain/`: 비즈니스 로직이 있는 도메인 컴포넌트
  - `components/layout/`: 레이아웃 관련 컴포넌트

### 데이터 흐름

1. **Repository Layer**: Supabase와의 직접 통신
2. **React Query Hooks**: 서버 상태 관리 및 캐싱
3. **Zustand Stores**: 클라이언트 상태 관리 (세션 등)
4. **Components**: UI 렌더링 및 사용자 인터랙션

### 상태 관리 전략

- **서버 상태**: React Query (캐싱, 동기화, 에러 처리)
- **클라이언트 상태**: Zustand (세션 ID 등 간단한 상태)

## 📝 주요 화면 및 컴포넌트

### 홈 페이지 (`/`)

- **컴포넌트**: `GameList`, `GiftList`
- **기능**: 게임 목록 미리보기, 최근 선물 목록

### 선물 관리 페이지 (`/gifts`)

- **컴포넌트**: `GiftList`, `GiftForm`, `TagList`, `TagForm`
- **기능**: 선물/태그 추가, 수정, 삭제

### 게임 목록 페이지 (`/games`)

- **컴포넌트**: `GameList`
- **기능**: 모든 게임 목록 표시

### 게임 상세 페이지 (`/games/[id]`)

- **컴포넌트**: `GameDetail`, `WinnerSelector`
- **기능**: 게임 설명 확인, 우승자 선택

### 태그 선택 페이지 (`/games/[id]/select-tag`)

- **컴포넌트**: `TagSelector`, `TagList`, `GiftList`
- **기능**: 태그 선택, 선택한 태그의 선물 목록 표시

## 🔒 보안 고려사항

- Supabase RLS 정책으로 모든 사용자가 읽기/쓰기 가능 (비로그인 사용자 지원)
- 세션 ID는 로컬 스토리지에 저장
- 프로덕션 환경에서는 추가 보안 정책 고려 필요

## 🚢 배포

### Vercel 배포

1. GitHub에 프로젝트 푸시
2. Vercel에 프로젝트 연결
3. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 배포 완료!

## 📄 라이선스

MIT
