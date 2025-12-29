# 접근 제어 시스템 문서

## 📁 폴더 구조

```
party_tonight/
├── middleware.ts                    # Next.js 미들웨어 (접근 제어)
├── app/
│   └── enter/
│       └── page.tsx                # 입장 코드 입력 페이지
├── lib/
│   └── access.ts                    # 접근 권한 유틸리티 함수
└── stores/
    └── access.store.ts              # 접근 상태 관리 (Zustand)
```

## 🔐 동작 흐름

### 1. 사용자가 사이트 접속
```
사용자 → https://yoursite.com/any-page
         ↓
    middleware.ts 실행
         ↓
    쿠키 확인 (access_granted)
         ↓
    [없음] → /enter?redirect=/any-page
    [있음] → 원래 페이지로 진행
```

### 2. 입장 코드 입력
```
/enter 페이지
    ↓
사용자가 코드 입력
    ↓
코드 검증 (NEXT_PUBLIC_ACCESS_CODE와 비교)
    ↓
[일치] → 쿠키 설정 → 원래 페이지로 리다이렉트
[불일치] → 에러 메시지 표시
```

### 3. 쿠키 설정
- **이름**: `access_granted`
- **값**: `true`
- **만료**: 1년
- **경로**: `/`
- **SameSite**: `Lax`

## 📝 주요 파일 설명

### middleware.ts
- 모든 요청을 가로채서 접근 권한 확인
- Public 경로는 제외 (`/enter`, `/api`, `/_next` 등)
- 쿠키가 없으면 `/enter`로 리다이렉트
- 원래 가려던 URL은 `redirect` 쿼리 파라미터로 전달

### app/enter/page.tsx
- 입장 코드 입력 UI
- 코드 검증 로직
- 쿠키 설정
- 리다이렉트 처리
- 모바일 친화적 디자인

### lib/access.ts
- `hasAccess()`: 접근 권한 확인
- `setAccessCookie()`: 쿠키 설정
- `removeAccessCookie()`: 쿠키 제거

### stores/access.store.ts
- Zustand 기반 상태 관리
- 접근 권한 상태를 전역으로 관리
- 컴포넌트에서 쉽게 접근 가능

## 🔧 환경 변수 설정

`.env.local` 파일에 추가:

```env
NEXT_PUBLIC_ACCESS_CODE=your_secret_code_123
```

**주의사항**:
- `NEXT_PUBLIC_` 접두사가 있어야 클라이언트에서 접근 가능
- 프로덕션에서는 Vercel 환경 변수로 설정
- 코드는 4~10자리 권장 (너무 짧거나 길면 보안 취약)

## 🎨 UI/UX 특징

### 모바일 최적화
- 전체 화면 중앙 배치
- 터치 친화적 입력 필드
- 큰 버튼 크기
- 반응형 디자인

### 사용자 경험
- 자동 포커스 (입력 필드)
- 실시간 에러 표시
- 로딩 상태 표시
- 원래 페이지로 자동 복귀

## 🔒 보안 고려사항

### 현재 구현
- ✅ 쿠키 기반 인증
- ✅ 미들웨어 레벨 보호
- ✅ 환경 변수로 코드 관리
- ✅ SameSite 쿠키 설정

### 제한사항
- ⚠️ 쿠키는 클라이언트에서 조작 가능
- ⚠️ 코드는 클라이언트 번들에 포함됨 (환경 변수)
- ⚠️ 브라우저 개발자 도구로 쿠키 확인 가능

## 🚀 선택적 개선안

### 1. 서버 사이드 검증 강화
```typescript
// app/api/verify/route.ts
export async function POST(request: Request) {
  const { code } = await request.json()
  const accessCode = process.env.ACCESS_CODE // 서버 전용 (NEXT_PUBLIC_ 제거)
  
  if (code !== accessCode) {
    return Response.json({ success: false }, { status: 401 })
  }
  
  // 세션 토큰 생성 및 반환
  const token = generateSecureToken()
  return Response.json({ success: true, token })
}
```

**장점**:
- 코드가 클라이언트에 노출되지 않음
- 서버에서만 검증하여 보안 강화

### 2. 쿠키에 서명 추가
```typescript
import { SignJWT } from 'jose'

// 쿠키 설정 시
const token = await new SignJWT({ granted: true })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('1y')
  .sign(new TextEncoder().encode(process.env.JWT_SECRET))

document.cookie = `access_granted=${token}; ...`
```

**장점**:
- 쿠키 조작 방지
- 만료 시간 서버에서 제어
- 추가 메타데이터 저장 가능

### 3. IP 기반 접근 제어 (선택적)
```typescript
// middleware.ts에 추가
const ALLOWED_IPS = process.env.ALLOWED_IPS?.split(',') || []

const clientIp = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown'

if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIp)) {
  return NextResponse.redirect(new URL('/enter', request.url))
}
```

**장점**:
- 특정 IP에서만 접근 허용
- 추가 보안 레이어

**단점**:
- 모바일 환경에서 IP 변경 시 문제
- VPN 사용 시 제한

## 📱 사용 예시

### 컴포넌트에서 접근 권한 확인
```typescript
'use client'

import { useAccessStore } from '@/stores'

export function ProtectedComponent() {
  const isGranted = useAccessStore((state) => state.isGranted)
  
  if (!isGranted) {
    return <div>접근 권한이 없습니다.</div>
  }
  
  return <div>보호된 콘텐츠</div>
}
```

### 프로그래밍 방식으로 접근 권한 제거
```typescript
import { useAccessStore } from '@/stores'

function LogoutButton() {
  const revokeAccess = useAccessStore((state) => state.revokeAccess)
  
  return (
    <button onClick={() => {
      revokeAccess()
      router.push('/enter')
    }}>
      나가기
    </button>
  )
}
```

## 🧪 테스트

### 로컬 테스트
1. `.env.local`에 `NEXT_PUBLIC_ACCESS_CODE=test123` 설정
2. 개발 서버 실행: `npm run dev`
3. 브라우저에서 `/enter` 접속
4. `test123` 입력 후 확인
5. 쿠키가 설정되었는지 개발자 도구에서 확인

### 프로덕션 배포
1. Vercel 환경 변수에 `NEXT_PUBLIC_ACCESS_CODE` 설정
2. 배포 후 테스트
3. 쿠키가 정상적으로 설정되는지 확인

## ⚠️ 주의사항

1. **환경 변수 보안**: `NEXT_PUBLIC_` 접두사가 있으면 클라이언트 번들에 포함됨
2. **쿠키 보안**: 현재는 클라이언트에서 조작 가능하므로 민감한 데이터는 저장하지 않음
3. **HTTPS 권장**: 프로덕션에서는 반드시 HTTPS 사용
4. **코드 복잡도**: 너무 간단한 코드는 추측 가능하므로 충분히 복잡하게 설정

