# Party Tonight v2 - 아키텍처 문서

## 📋 전체 구조 개요

### 핵심 변경사항

- 태그가 독립 엔티티에서 선물의 속성으로 변경
- 유저 시스템 추가 (간단한 비밀번호 기반)
- 권한 시스템 (admin/user)
- 서버 사이드 권한 체크
- 선물 공개 시스템 (revealed)

## 🗄 데이터베이스 스키마

### 테이블 구조

#### 1. users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### 2. gifts

```sql
CREATE TABLE gifts (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES users(id),
  tag TEXT NOT NULL,              -- 공개되는 키워드
  name TEXT NOT NULL,             -- 실제 선물명 (공개 후 보임)
  description TEXT,               -- 선물 설명
  message TEXT,                    -- 선물 메시지
  revealed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### 3. games

```sql
CREATE TABLE games (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### 4. winners

```sql
CREATE TABLE winners (
  id UUID PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games(id),
  winner_user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 📁 폴더 구조

```
party_tonight/
├── app/
│   ├── api/                          # API Routes
│   │   ├── auth/
│   │   │   ├── login/route.ts       # 로그인/등록
│   │   │   ├── logout/route.ts      # 로그아웃
│   │   │   └── me/route.ts          # 현재 유저 정보
│   │   ├── gifts/
│   │   │   ├── route.ts             # GET: 목록, POST: 생성
│   │   │   └── [id]/route.ts        # GET/PUT/DELETE: 개별 선물
│   │   ├── games/
│   │   │   └── route.ts             # GET: 게임 목록
│   │   ├── winners/
│   │   │   └── route.ts             # POST: 우승자 등록
│   │   ├── reveal/
│   │   │   ├── tags/route.ts        # GET: 공개 가능한 태그 목록
│   │   │   └── select/route.ts      # POST: 태그 선택 및 선물 공개
│   │   └── users/
│   │       └── route.ts             # GET: 유저 목록 (관리자만)
│   │
│   ├── enter/
│   │   └── page.tsx                 # 로그인/등록 페이지
│   ├── gifts/
│   │   ├── page.tsx                 # 내 선물 목록
│   │   ├── new/
│   │   │   └── page.tsx             # 새 선물 등록
│   │   └── [id]/edit/
│   │       └── page.tsx             # 선물 수정
│   ├── game/
│   │   └── page.tsx                 # 게임 목록 및 우승자 선택
│   └── reveal/
│       └── page.tsx                 # 태그 선택 및 선물 공개
│
├── lib/
│   ├── auth/
│   │   ├── password.ts              # 비밀번호 해시/검증
│   │   ├── session.ts                # 세션 쿠키 관리
│   │   └── permissions.ts            # 권한 체크 유틸리티
│   └── supabase/
│       ├── client.ts                 # 클라이언트 Supabase (사용 안 함)
│       ├── server-client.ts          # 서버 Supabase 클라이언트
│       └── schema-v2.sql             # 새로운 스키마
│
└── stores/
    └── user.store.ts                 # 유저 상태 관리 (Zustand)
```

## 🔐 인증 및 권한 시스템

### 인증 흐름

1. **로그인/등록** (`/enter`)
   - 유저명 + 비밀번호 입력
   - 없으면 자동 생성
   - 관리자는 `MASTER_KEY` 입력 시 `role=admin`

2. **세션 관리**
   - `cookies()` API로 `party_tonight_user_id` 쿠키 저장
   - httpOnly 쿠키로 보안 강화
   - 30일 유지

3. **권한 체크**
   - 서버 사이드에서 권한 확인
   - `lib/auth/permissions.ts`의 함수들 사용

### 권한 체크 예시

```typescript
// 선물 수정 권한 체크
import { canEditGift } from '@/lib/auth/permissions'

export async function PUT(request: NextRequest, { params }) {
  const { id } = await params

  // 권한 체크
  const canEdit = await canEditGift(id)
  if (!canEdit) {
    return NextResponse.json(
      { error: '수정 권한이 없습니다.' },
      { status: 403 }
    )
  }

  // 수정 로직...
}
```

## 🛣 API 라우트 설계

### 인증 API

#### `POST /api/auth/login`

- **요청**: `{ name: string, password: string }`
- **응답**: `{ success: true, user: { id, name, role } }`
- **기능**: 로그인/등록, 관리자 체크

#### `POST /api/auth/logout`

- **응답**: `{ success: true }`
- **기능**: 세션 쿠키 제거

#### `GET /api/auth/me`

- **응답**: `{ user: { id, name, role } | null }`
- **기능**: 현재 로그인된 유저 정보

### 선물 API

#### `GET /api/gifts`

- **응답**: `{ gifts: Gift[] }`
- **기능**: 현재 유저의 선물 목록

#### `POST /api/gifts`

- **요청**: `{ tag, name, description?, message? }`
- **응답**: `{ gift: Gift }`
- **기능**: 새 선물 생성

#### `GET /api/gifts/[id]`

- **응답**: `{ gift: Gift }`
- **기능**: 선물 상세 정보

#### `PUT /api/gifts/[id]`

- **요청**: `{ tag?, name?, description?, message? }`
- **응답**: `{ gift: Gift }`
- **권한**: 소유자 또는 관리자만

#### `DELETE /api/gifts/[id]`

- **응답**: `{ success: true }`
- **권한**: 소유자 또는 관리자만

### 게임 API

#### `GET /api/games`

- **응답**: `{ games: Game[] }`
- **기능**: 게임 목록

### 우승자 API

#### `POST /api/winners`

- **요청**: `{ game_id, winner_user_id }`
- **응답**: `{ winner: Winner }`
- **기능**: 우승자 등록

### 공개 API

#### `GET /api/reveal/tags`

- **응답**: `{ tags: string[] }`
- **기능**: 공개되지 않은 선물의 태그 목록 (중복 제거)

#### `POST /api/reveal/select`

- **요청**: `{ tag: string }`
- **응답**: `{ gift: Gift }`
- **기능**: 태그 선택 시 해당 태그의 선물 공개 (`revealed=true`)

### 유저 API

#### `GET /api/users`

- **응답**: `{ users: User[] }`
- **권한**: 관리자만
- **기능**: 모든 유저 목록 (게임 우승자 선택 시 사용)

## 📄 페이지 구조

### 1. `/enter` - 로그인/등록

- **컴포넌트**: `EnterPage`
- **기능**: 유저명 + 비밀번호 입력
- **로직**:
  - 없으면 자동 생성
  - `MASTER_KEY` 입력 시 관리자 권한
  - 성공 시 `/gifts`로 리다이렉트

### 2. `/gifts` - 내 선물 목록

- **컴포넌트**: `GiftsPage`
- **기능**:
  - 현재 유저의 선물 목록 표시
  - 수정/삭제 버튼 (소유자만)
  - 공개 여부 표시

### 3. `/gifts/new` - 새 선물 등록

- **컴포넌트**: `NewGiftPage`
- **기능**: tag, name, description, message 입력

### 4. `/gifts/[id]/edit` - 선물 수정

- **컴포넌트**: `EditGiftPage`
- **권한**: 소유자 또는 관리자만
- **기능**: 선물 정보 수정

### 5. `/game` - 게임 목록 및 우승자 선택

- **컴포넌트**: `GamePage`
- **기능**:
  - 게임 목록 표시
  - 게임 선택 → 우승자 선택
  - 우승자 등록 후 `/reveal`로 리다이렉트

### 6. `/reveal` - 선물 공개

- **컴포넌트**: `RevealPage`
- **기능**:
  - 공개 가능한 태그 목록 표시
  - 태그 선택 → 선물 공개
  - 공개된 선물 상세 정보 표시

## 🎯 Reveal 로직 설계

### 흐름

1. **태그 목록 조회** (`GET /api/reveal/tags`)
   - `revealed=false`인 선물의 태그만 조회
   - 중복 제거하여 반환

2. **태그 선택** (`POST /api/reveal/select`)
   - 선택한 태그로 `revealed=false`인 선물 찾기
   - 첫 번째 선물을 `revealed=true`로 변경
   - 공개된 선물 정보 반환

3. **UI 업데이트**
   - 선택된 태그는 목록에서 제거
   - 공개된 선물 정보 표시

### 주의사항

- 같은 태그의 선물이 여러 개 있을 수 있음
- 첫 번째로 찾은 선물만 공개
- 공개된 선물은 다시 공개할 수 없음

## 🔒 보안 고려사항

1. **비밀번호 해시**: SHA-256 사용 (프로덕션에서는 bcrypt 권장)
2. **세션 쿠키**: httpOnly, secure (프로덕션)
3. **권한 체크**: 모든 수정/삭제 API에서 서버 사이드 체크
4. **RLS**: Supabase RLS는 모든 접근 허용, 서버에서 권한 제어

## 🚀 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 관리자 마스터 키
MASTER_KEY=your-admin-password

# 접근 제어 (기존)
NEXT_PUBLIC_ACCESS_CODE=1234
```

## 📝 컴포넌트 목록

### 페이지 컴포넌트

- `EnterPage` - 로그인/등록
- `GiftsPage` - 선물 목록
- `NewGiftPage` - 선물 등록
- `EditGiftPage` - 선물 수정
- `GamePage` - 게임 및 우승자 선택
- `RevealPage` - 선물 공개

### 공통 컴포넌트

- `Header` - 네비게이션 (유저 정보 표시)
- `Card`, `Button`, `Input`, `Badge` - UI 컴포넌트

## 🔄 상태 관리

- **Zustand**: `useUserStore`로 유저 정보 관리
- **React Query**: 필요 시 API 데이터 캐싱 (선택사항)

## ✅ 마이그레이션 체크리스트

1. [ ] `schema-v2.sql` 실행
2. [ ] 환경 변수 `MASTER_KEY` 설정
3. [ ] 기존 Mock 데이터 제거 또는 유지
4. [ ] API 라우트 테스트
5. [ ] 권한 체크 테스트
6. [ ] Reveal 로직 테스트
