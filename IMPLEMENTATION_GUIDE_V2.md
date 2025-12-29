# Party Tonight v2 - 구현 가이드

## 📋 전체 요약

요구사항에 맞춰 전체 시스템을 재설계했습니다. 주요 변경사항:

- ✅ 태그가 선물의 속성으로 변경 (독립 엔티티 아님)
- ✅ 유저 시스템 추가 (간단한 비밀번호 기반)
- ✅ 권한 시스템 (admin/user)
- ✅ 서버 사이드 권한 체크
- ✅ 선물 공개 시스템 (revealed)

## 🗄 1. 데이터베이스 스키마

### SQL 파일 위치

- `lib/supabase/schema-v2.sql` - 전체 스키마 및 초기 데이터

### 실행 방법

1. Supabase 대시보드 → SQL Editor
2. `schema-v2.sql` 파일 내용 복사
3. 실행

### 테이블 구조

#### users

```sql
- id (UUID, PK)
- name (TEXT, UNIQUE) - 유저명
- password_hash (TEXT) - SHA-256 해시
- role ('user' | 'admin')
- created_at
```

#### gifts

```sql
- id (UUID, PK)
- owner_id (UUID, FK → users)
- tag (TEXT) - 공개되는 키워드
- name (TEXT) - 실제 선물명
- description (TEXT, nullable)
- message (TEXT, nullable)
- revealed (BOOLEAN) - 공개 여부
- created_at
```

#### games

```sql
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- created_at
```

#### winners

```sql
- id (UUID, PK)
- game_id (UUID, FK → games)
- winner_user_id (UUID, FK → users)
- created_at
```

## 📁 2. 폴더 구조

```
party_tonight/
├── app/
│   ├── api/                          # API Routes (서버 사이드)
│   │   ├── auth/
│   │   │   ├── login/route.ts       # POST: 로그인/등록
│   │   │   ├── logout/route.ts      # POST: 로그아웃
│   │   │   └── me/route.ts          # GET: 현재 유저
│   │   ├── gifts/
│   │   │   ├── route.ts             # GET: 목록, POST: 생성
│   │   │   └── [id]/route.ts        # GET/PUT/DELETE
│   │   ├── games/route.ts            # GET: 게임 목록
│   │   ├── winners/route.ts         # POST: 우승자 등록
│   │   ├── reveal/
│   │   │   ├── tags/route.ts        # GET: 태그 목록
│   │   │   └── select/route.ts      # POST: 태그 선택
│   │   └── users/route.ts           # GET: 유저 목록 (관리자)
│   │
│   ├── enter/page.tsx                # 로그인/등록
│   ├── gifts/
│   │   ├── page.tsx                  # 내 선물 목록
│   │   ├── new/page.tsx             # 새 선물 등록
│   │   └── [id]/edit/page.tsx       # 선물 수정
│   ├── game/page.tsx                 # 게임 및 우승자 선택
│   └── reveal/page.tsx               # 태그 선택 및 선물 공개
│
├── lib/
│   ├── auth/
│   │   ├── password.ts               # 비밀번호 해시/검증
│   │   ├── session.ts                # 쿠키 세션 관리
│   │   └── permissions.ts            # 권한 체크
│   └── supabase/
│       ├── server-client.ts           # 서버 Supabase 클라이언트
│       └── schema-v2.sql              # 스키마
│
└── stores/
    └── user.store.ts                  # 유저 상태 관리
```

## 🔐 3. 인증 시스템

### 로그인/등록 흐름

```typescript
// app/api/auth/login/route.ts

1. 유저명 + 비밀번호 받기
2. 관리자 체크 (password === MASTER_KEY)
   - 관리자면 role='admin'으로 생성/로그인
3. 일반 유저
   - 존재하면: 비밀번호 검증 후 로그인
   - 없으면: 자동 등록
4. 세션 쿠키 설정 (party_tonight_user_id)
5. 유저 정보 반환
```

### 세션 관리

```typescript
// lib/auth/session.ts

- getCurrentUserId(): 쿠키에서 userId 가져오기
- setSessionCookie(userId): 쿠키 설정 (30일)
- clearSessionCookie(): 쿠키 제거
```

## 🔒 4. 권한 체크

### 권한 체크 함수

```typescript
// lib/auth/permissions.ts

- getCurrentUser(): 현재 유저 정보
- isAdmin(): 관리자 여부
- isGiftOwner(giftId): 선물 소유자 여부
- canEditGift(giftId): 수정 가능 여부 (소유자 또는 관리자)
```

### API에서 권한 체크 예시

```typescript
// app/api/gifts/[id]/route.ts

export async function PUT(request, { params }) {
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

## 🛣 5. API 라우트 설계

### 인증 API

| Method | Endpoint           | 설명           | 권한        |
| ------ | ------------------ | -------------- | ----------- |
| POST   | `/api/auth/login`  | 로그인/등록    | 공개        |
| POST   | `/api/auth/logout` | 로그아웃       | 로그인 필요 |
| GET    | `/api/auth/me`     | 현재 유저 정보 | 로그인 필요 |

### 선물 API

| Method | Endpoint          | 설명         | 권한               |
| ------ | ----------------- | ------------ | ------------------ |
| GET    | `/api/gifts`      | 내 선물 목록 | 로그인 필요        |
| POST   | `/api/gifts`      | 새 선물 생성 | 로그인 필요        |
| GET    | `/api/gifts/[id]` | 선물 상세    | 로그인 필요        |
| PUT    | `/api/gifts/[id]` | 선물 수정    | 소유자 또는 관리자 |
| DELETE | `/api/gifts/[id]` | 선물 삭제    | 소유자 또는 관리자 |

### 게임 API

| Method | Endpoint     | 설명      | 권한        |
| ------ | ------------ | --------- | ----------- |
| GET    | `/api/games` | 게임 목록 | 로그인 필요 |

### 우승자 API

| Method | Endpoint       | 설명        | 권한        |
| ------ | -------------- | ----------- | ----------- |
| POST   | `/api/winners` | 우승자 등록 | 로그인 필요 |

### 공개 API

| Method | Endpoint             | 설명                   | 권한        |
| ------ | -------------------- | ---------------------- | ----------- |
| GET    | `/api/reveal/tags`   | 공개 가능한 태그 목록  | 로그인 필요 |
| POST   | `/api/reveal/select` | 태그 선택 및 선물 공개 | 로그인 필요 |

### 유저 API

| Method | Endpoint     | 설명      | 권한     |
| ------ | ------------ | --------- | -------- |
| GET    | `/api/users` | 유저 목록 | 관리자만 |

## 📄 6. 페이지 구조

### `/enter` - 로그인/등록

- **컴포넌트**: `EnterPage`
- **기능**:
  - 유저명 + 비밀번호 입력
  - 없으면 자동 생성
  - `MASTER_KEY` 입력 시 관리자
- **리다이렉트**: 성공 시 `/gifts`

### `/gifts` - 내 선물 목록

- **컴포넌트**: `GiftsPage`
- **기능**:
  - 현재 유저의 선물 목록
  - 수정/삭제 버튼 (소유자만)
  - 공개 여부 표시

### `/gifts/new` - 새 선물 등록

- **컴포넌트**: `NewGiftPage`
- **입력 필드**: tag, name, description, message

### `/gifts/[id]/edit` - 선물 수정

- **컴포넌트**: `EditGiftPage`
- **권한**: 소유자 또는 관리자만
- **기능**: 선물 정보 수정

### `/game` - 게임 및 우승자 선택

- **컴포넌트**: `GamePage`
- **기능**:
  - 게임 목록 표시
  - 게임 선택 → 우승자 선택
  - 우승자 등록 후 `/reveal?winner=userId`로 이동

### `/reveal` - 선물 공개

- **컴포넌트**: `RevealPage`
- **기능**:
  - 공개 가능한 태그 목록 표시
  - 태그 선택 → 선물 공개
  - 공개된 선물 상세 정보 표시

## 🎯 7. Reveal 로직 상세

### 흐름

```
1. GET /api/reveal/tags
   ↓
   revealed=false인 선물의 태그만 조회
   중복 제거하여 반환
   ↓
2. 사용자가 태그 선택
   ↓
3. POST /api/reveal/select { tag: "실용적인" }
   ↓
   - tag='실용적인' AND revealed=false인 선물 찾기
   - 첫 번째 선물을 revealed=true로 변경
   - 공개된 선물 정보 반환
   ↓
4. UI에 공개된 선물 표시
   - 태그 목록에서 선택된 태그 제거
   - 선물 상세 정보 표시
```

### 주의사항

- 같은 태그의 선물이 여러 개 있을 수 있음
- 첫 번째로 찾은 선물만 공개
- 공개된 선물은 다시 공개할 수 없음

## 🔧 8. 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 관리자 마스터 키
MASTER_KEY=your-admin-password

# 접근 제어 (기존)
NEXT_PUBLIC_ACCESS_CODE=1234
```

## 📝 9. 컴포넌트 목록

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

## 🚀 10. 시작하기

### 1. 데이터베이스 설정

```bash
# Supabase SQL Editor에서 실행
# lib/supabase/schema-v2.sql
```

### 2. 환경 변수 설정

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
MASTER_KEY=admin123
NEXT_PUBLIC_ACCESS_CODE=1234
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 테스트

1. `/enter` 접속
2. 유저명 + 비밀번호 입력 (없으면 자동 생성)
3. `/gifts`에서 선물 등록
4. `/game`에서 게임 선택 및 우승자 등록
5. `/reveal`에서 태그 선택 및 선물 공개

## ✅ 체크리스트

- [x] 데이터베이스 스키마 설계
- [x] 인증 시스템 구현
- [x] 권한 체크 시스템
- [x] API 라우트 구현
- [x] 페이지 구조 설계
- [x] Reveal 로직 구현
- [x] 타입 정의
- [x] 상태 관리 (Zustand)

## 🔄 마이그레이션 가이드

기존 v1에서 v2로 마이그레이션:

1. **데이터 백업** (필요시)
2. **새 스키마 실행** (`schema-v2.sql`)
3. **환경 변수 추가** (`MASTER_KEY`)
4. **기존 코드 제거** (선택사항)
   - `repositories/` (v1 구조)
   - `components/domain/` (v1 구조)
5. **테스트**

## 💡 주요 개선사항

1. **단순화된 태그 시스템**: 독립 엔티티 → 선물 속성
2. **유저 시스템**: 세션 기반 → 유저 기반
3. **권한 시스템**: 서버 사이드 권한 체크
4. **선물 공개**: revealed 플래그로 관리
5. **API 중심**: 클라이언트는 API만 호출
