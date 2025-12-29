# 프로젝트 구조 상세 설명

## 📂 전체 폴더 구조

```
party_tonight/
│
├── 📁 app/                          # Next.js 14 App Router
│   ├── layout.tsx                  # 루트 레이아웃 (Header, Footer 포함)
│   ├── page.tsx                    # 홈 페이지 (/)
│   ├── providers.tsx               # React Query Provider 래퍼
│   ├── globals.css                 # Tailwind CSS 전역 스타일
│   │
│   ├── 📁 gifts/                   # 선물 관리 라우트
│   │   └── page.tsx                # /gifts - 선물 관리 페이지
│   │
│   └── 📁 games/                   # 게임 관련 라우트
│       ├── page.tsx                # /games - 게임 목록 페이지
│       └── 📁 [id]/                # 동적 라우트 (게임 ID)
│           ├── page.tsx            # /games/[id] - 게임 상세 페이지
│           └── 📁 select-tag/
│               ├── page.tsx        # /games/[id]/select-tag - 태그 선택 페이지
│               └── loading.tsx    # 로딩 UI
│
├── 📁 components/                   # React 컴포넌트
│   │
│   ├── 📁 ui/                      # Atomic Design - 기본 UI 컴포넌트
│   │   ├── button.tsx             # 버튼 컴포넌트 (variants: primary, secondary, outline, ghost)
│   │   ├── card.tsx               # 카드 컴포넌트 (Header, Content, Footer 포함)
│   │   ├── input.tsx              # 입력 필드 컴포넌트
│   │   └── badge.tsx              # 배지 컴포넌트 (태그 표시용)
│   │
│   ├── 📁 domain/                  # Domain-Driven Design - 도메인별 컴포넌트
│   │   │
│   │   ├── 📁 gift/                # 선물 도메인
│   │   │   ├── gift-list.tsx      # 선물 목록 표시
│   │   │   ├── gift-card.tsx      # 개별 선물 카드
│   │   │   └── gift-form.tsx      # 선물 추가/수정 폼
│   │   │
│   │   ├── 📁 tag/                 # 태그 도메인
│   │   │   ├── tag-list.tsx       # 태그 목록 표시 (선택 가능)
│   │   │   └── tag-form.tsx       # 태그 추가 폼
│   │   │
│   │   └── 📁 game/                # 게임 도메인
│   │       ├── game-list.tsx      # 게임 목록 표시
│   │       ├── game-detail.tsx   # 게임 상세 정보
│   │       ├── winner-selector.tsx # 우승자 선택 폼
│   │       └── tag-selector.tsx  # 태그 선택 및 선물 표시
│   │
│   └── 📁 layout/                  # 레이아웃 컴포넌트
│       ├── header.tsx             # 상단 네비게이션 바
│       └── footer.tsx             # 하단 푸터
│
├── 📁 lib/                          # 유틸리티 및 설정
│   │
│   ├── 📁 supabase/
│   │   ├── client.ts              # Supabase 클라이언트 인스턴스
│   │   └── schema.sql             # 데이터베이스 스키마 (마이그레이션용)
│   │
│   ├── session.ts                  # 세션 ID 관리 (로컬 스토리지)
│   └── utils.ts                    # 공통 유틸리티 (cn 함수 등)
│
├── 📁 types/                        # TypeScript 타입 정의
│   ├── index.ts                   # 도메인 타입 (Gift, Tag, Game 등)
│   └── database.ts                # Supabase 데이터베이스 타입
│
├── 📁 repositories/                 # Repository Pattern - 데이터 접근 레이어
│   ├── session.repository.ts      # 세션 CRUD
│   ├── gift.repository.ts         # 선물 CRUD + 태그 연결
│   ├── tag.repository.ts          # 태그 CRUD
│   ├── game.repository.ts         # 게임 조회
│   ├── game-result.repository.ts  # 게임 결과 생성 및 태그 선택
│   └── index.ts                   # 통합 export
│
├── 📁 stores/                       # Zustand 상태 관리
│   ├── session.store.ts           # 세션 ID 상태 관리
│   └── index.ts                   # 통합 export
│
├── 📁 hooks/                        # React Custom Hooks
│   │
│   ├── use-session.ts             # 세션 초기화 및 Supabase 등록
│   │
│   └── 📁 queries/                 # React Query Hooks
│       ├── use-gifts.ts           # 선물 관련 쿼리/뮤테이션
│       ├── use-tags.ts            # 태그 관련 쿼리/뮤테이션
│       ├── use-games.ts           # 게임 관련 쿼리
│       ├── use-game-results.ts    # 게임 결과 관련 쿼리/뮤테이션
│       └── index.ts               # 통합 export
│
├── 📄 package.json                 # 프로젝트 의존성
├── 📄 tsconfig.json                # TypeScript 설정
├── 📄 tailwind.config.ts           # Tailwind CSS 설정
├── 📄 next.config.js               # Next.js 설정
├── 📄 .env.example                 # 환경 변수 예시
└── 📄 README.md                    # 프로젝트 문서
```

## 🏗 아키텍처 레이어

### 1. Presentation Layer (UI)

- **위치**: `app/`, `components/`
- **역할**: 사용자 인터페이스 렌더링 및 사용자 인터랙션 처리
- **특징**:
  - Server Components와 Client Components 분리
  - Domain 기반 컴포넌트 구조
  - 재사용 가능한 UI 컴포넌트

### 2. Application Layer (Hooks)

- **위치**: `hooks/`
- **역할**: 비즈니스 로직 및 상태 관리
- **특징**:
  - React Query로 서버 상태 관리
  - Zustand로 클라이언트 상태 관리
  - Custom Hooks로 로직 재사용

### 3. Domain Layer (Repositories)

- **위치**: `repositories/`
- **역할**: 데이터 접근 추상화
- **특징**:
  - Supabase와의 직접 통신
  - 도메인별 Repository 분리
  - 타입 안전성 보장

### 4. Infrastructure Layer

- **위치**: `lib/`
- **역할**: 외부 서비스 연동 및 유틸리티
- **특징**:
  - Supabase 클라이언트 설정
  - 세션 관리 유틸리티
  - 공통 헬퍼 함수

## 🔄 데이터 흐름

```
사용자 액션
    ↓
Component (UI)
    ↓
Custom Hook (React Query / Zustand)
    ↓
Repository (데이터 접근)
    ↓
Supabase (데이터베이스)
    ↓
응답 반환
    ↓
상태 업데이트 (React Query 캐시)
    ↓
UI 리렌더링
```

## 📊 상태 관리 전략

### 서버 상태 (React Query)

- **용도**: 선물, 태그, 게임, 게임 결과 등 서버 데이터
- **장점**:
  - 자동 캐싱
  - 백그라운드 동기화
  - 에러 처리
  - 로딩 상태 관리

### 클라이언트 상태 (Zustand)

- **용도**: 세션 ID 등 간단한 클라이언트 상태
- **장점**:
  - 가벼움
  - 간단한 API
  - 타입 안전성

## 🎯 컴포넌트 설계 원칙

### 1. Atomic Design

- **UI 컴포넌트**: `components/ui/`
  - 재사용 가능한 기본 컴포넌트
  - 스타일링만 담당
  - 비즈니스 로직 없음

### 2. Domain-Driven Design

- **도메인 컴포넌트**: `components/domain/`
  - 비즈니스 로직 포함
  - 도메인별로 그룹화
  - 재사용 가능하지만 특정 도메인에 특화

### 3. Layout Components

- **레이아웃 컴포넌트**: `components/layout/`
  - 페이지 구조 담당
  - 네비게이션, 푸터 등

## 🔐 세션 관리 플로우

```
1. 앱 시작
   ↓
2. useSession() 훅 실행
   ↓
3. getOrCreateSessionId() 호출
   ↓
4. 로컬 스토리지 확인
   ├─ 있음 → 기존 세션 ID 사용
   └─ 없음 → 새 UUID 생성 후 저장
   ↓
5. Zustand Store에 세션 ID 저장
   ↓
6. Supabase에 세션 등록/업데이트
   ↓
7. 모든 데이터 요청에 세션 ID 포함
```

## 🎮 게임 플로우 상세

```
1. 게임 목록 페이지 (/games)
   └─ 게임 클릭
      ↓
2. 게임 상세 페이지 (/games/[id])
   ├─ 게임 설명 확인
   └─ 우승자 이름 입력
      ↓
3. 게임 결과 생성 (game_results 테이블)
   ↓
4. 태그 선택 페이지 (/games/[id]/select-tag)
   ├─ 태그 목록 표시
   ├─ 태그 선택
   └─ 선택한 태그의 선물 목록 표시
      ↓
5. 태그 선택 저장 (tag_selections 테이블)
   ↓
6. 선물 획득 처리 (gifts.is_claimed = true)
```

## 📱 모바일 우선 설계

- **Tailwind CSS**: Mobile First 반응형 디자인
- **Grid Layout**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **터치 친화적**: 버튼 크기 및 간격 최적화
- **간단한 네비게이션**: 모바일에서도 사용하기 쉬운 구조

## 🚀 성능 최적화

1. **React Query 캐싱**: 불필요한 API 호출 방지
2. **Server Components**: 가능한 곳에서 서버 컴포넌트 사용
3. **코드 스플리팅**: Next.js 자동 코드 스플리팅
4. **이미지 최적화**: Next.js Image 컴포넌트 사용 (필요시)

## 🔧 확장 가능성

### 추가 가능한 기능

- 선물 이미지 업로드 (Supabase Storage)
- 실시간 업데이트 (Supabase Realtime)
- 게임 히스토리 페이지
- 통계 대시보드
- 다크 모드
- 다국어 지원

### 구조 확장

- `middleware.ts`: 인증/리다이렉션 로직
- `app/api/`: API Routes (필요시)
- `lib/validations/`: Zod 스키마 검증
- `lib/constants/`: 상수 정의
