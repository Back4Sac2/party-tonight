# Feature-Sliced Design (FSD) 아키텍처

## 📁 폴더 구조

```
party_tonight/
├── app/                          # Next.js App Router
│   ├── game/page.tsx            # 게임 페이지 (페이지 레이어)
│   ├── gifts/page.tsx           # 선물 페이지
│   └── ...
│
├── shared/                       # 공통 레이어
│   └── ui/                      # 기본 UI 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── loader.tsx
│       └── index.ts
│
├── entities/                     # 엔티티 레이어 (비즈니스 엔티티)
│   └── game/
│       ├── ui/
│       │   └── game-card.tsx    # 게임 카드 컴포넌트
│       └── index.ts
│
├── features/                    # 기능 레이어 (사용자 기능)
│   ├── tag-select/              # 태그 선택 기능
│   │   ├── ui/
│   │   │   └── tag-select.tsx
│   │   └── index.ts
│   ├── user-select/             # 유저 선택 기능
│   │   ├── ui/
│   │   │   └── user-select.tsx
│   │   └── index.ts
│   ├── game-create/             # 게임 생성 기능
│   │   ├── ui/
│   │   │   └── game-create-form.tsx
│   │   └── index.ts
│   ├── game-edit/               # 게임 수정 기능
│   │   ├── ui/
│   │   │   └── game-edit-form.tsx
│   │   └── index.ts
│   └── winner-select/           # 우승자 선택 기능
│       ├── ui/
│       │   └── winner-select-form.tsx
│       └── index.ts
│
├── widgets/                     # 위젯 레이어 (복합 컴포넌트)
│   └── game-list/
│       ├── ui/
│       │   └── game-list.tsx
│       └── index.ts
│
├── lib/                         # 공통 라이브러리
│   ├── actions/                 # 서버 액션
│   ├── auth/                    # 인증 관련
│   └── ...
│
└── hooks/                       # React 훅
    └── queries/v2/              # React Query 훅
```

## 🏗️ 레이어 설명

### 1. **shared/** - 공통 레이어

- 모든 레이어에서 사용 가능
- 재사용 가능한 기본 UI 컴포넌트
- 유틸리티 함수, 타입 정의

### 2. **entities/** - 엔티티 레이어

- 비즈니스 엔티티 (Game, Gift, User 등)
- 엔티티별 UI 컴포넌트
- 엔티티별 비즈니스 로직

### 3. **features/** - 기능 레이어

- 사용자가 수행하는 기능 단위
- 독립적으로 동작하는 기능 컴포넌트
- 예: 태그 선택, 게임 생성, 우승자 선택

### 4. **widgets/** - 위젯 레이어

- 여러 features/entities를 조합한 복합 컴포넌트
- 예: 게임 목록 (게임 카드 + 게임 관리 기능)

### 5. **app/** - 페이지 레이어

- Next.js App Router 페이지
- 위젯과 기능을 조합하여 페이지 구성
- 최소한의 로직만 포함

## 📦 컴포넌트 구조

### 예시: 게임 페이지

```tsx
// app/game/page.tsx (페이지 레이어)
export default function GamePage() {
  // 데이터 페칭
  const { data: games } = useGames()
  const { data: users } = useUsersForSelection()
  const { data: tags } = useTags()

  // 상태 관리
  const [selectedGame, setSelectedGame] = useState(null)

  // 위젯과 기능 조합
  return (
    <>
      <GameCreateForm onSuccess={...} />
      <GameEditForm game={...} onSuccess={...} />
      <WinnerSelectForm game={...} users={...} tags={...} />
      <GameList games={games} ... />
    </>
  )
}
```

## 🔄 Import 규칙

### FSD Import 규칙

- **같은 레이어**: 자유롭게 import 가능
- **상위 레이어**: 하위 레이어만 import 가능
- **하위 레이어**: 상위 레이어 import 불가

```
app (페이지)
  ↓ import
widgets (위젯)
  ↓ import
features (기능)
  ↓ import
entities (엔티티)
  ↓ import
shared (공통)
```

### 예시

```tsx
// ✅ 올바른 import
// features/game-create에서
import { Button } from '@/shared/ui' // shared import 가능
import { TagSelect } from '@/features/tag-select' // 같은 레이어 import 가능

// ❌ 잘못된 import
// shared/ui에서
import { GameCard } from '@/entities/game' // 상위 레이어 import 불가
```

## 🎯 주요 원칙

1. **재사용성**: 컴포넌트는 독립적으로 재사용 가능해야 함
2. **단일 책임**: 각 컴포넌트는 하나의 책임만 가짐
3. **의존성 방향**: 하위 레이어는 상위 레이어를 알지 못함
4. **명확한 인터페이스**: Props를 통한 명확한 API 제공
5. **테스트 가능성**: 각 컴포넌트는 독립적으로 테스트 가능

## 📝 컴포넌트 분리 기준

### Features로 분리할 것

- 사용자가 수행하는 특정 기능
- 독립적으로 동작하는 기능
- 여러 곳에서 재사용되는 기능

### Widgets로 분리할 것

- 여러 features/entities를 조합한 복합 컴포넌트
- 페이지의 큰 섹션을 담당하는 컴포넌트

### Entities로 분리할 것

- 비즈니스 엔티티의 UI 표현
- 엔티티별 공통 컴포넌트

## 🚀 장점

1. **유지보수성**: 명확한 구조로 코드 위치 파악 용이
2. **재사용성**: 컴포넌트 재사용이 쉬움
3. **확장성**: 새로운 기능 추가가 용이
4. **테스트**: 각 레이어별 독립적 테스트 가능
5. **협업**: 명확한 구조로 팀 협업 용이
