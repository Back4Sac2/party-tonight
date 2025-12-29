# Supabase API 키 가이드

## 🔑 Supabase에서 사용하는 키 종류

Supabase 대시보드의 **Settings** → **API** 메뉴에서 여러 키를 확인할 수 있습니다.

### 1. ✅ anon public key (사용할 것)

**위치**: Settings → API → **Project API keys** → **anon public**

**형태**:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE2MjM5MDIyfQ.xxxxx
```

**용도**:

- 클라이언트 사이드에서 사용
- 브라우저에 노출되어도 안전 (RLS 정책으로 보호됨)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 사용

**특징**:

- 공개되어도 괜찮음 (public)
- RLS (Row Level Security) 정책을 따름
- 읽기/쓰기 권한은 RLS 정책에 따라 제한됨

---

### 2. ❌ Database Password (사용하지 않음)

**위치**: 프로젝트 생성 시 설정한 비밀번호

**용도**:

- 데이터베이스에 직접 접근할 때 사용
- psql, pgAdmin 등 데이터베이스 클라이언트에서 사용
- **웹앱에서는 사용하지 않습니다!**

---

### 3. ❌ service_role key (사용하지 않음)

**위치**: Settings → API → **Project API keys** → **service_role**

**용도**:

- 서버 사이드에서만 사용
- RLS 정책을 우회할 수 있음
- **절대 클라이언트에 노출하면 안 됨!**

**특징**:

- 매우 강력한 권한
- `NEXT_PUBLIC_` 접두사와 함께 사용하면 안 됨
- 서버 전용 API Routes에서만 사용

---

## 📝 환경 변수 설정 예시

### 올바른 설정 ✅

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MTYyMzkwMjJ9.xxxxx
```

### 잘못된 설정 ❌

```env
# ❌ Database Password 사용 (잘못됨)
NEXT_PUBLIC_SUPABASE_ANON_KEY=myDatabasePassword123

# ❌ service_role key 사용 (위험!)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role)
```

---

## 🔍 키 확인 방법

1. Supabase 대시보드 접속
2. **Settings** (왼쪽 메뉴) 클릭
3. **API** 메뉴 클릭
4. **Project API keys** 섹션에서 확인:
   - **anon public** → 이것을 사용!
   - **service_role** → 사용하지 않음 (서버 전용)

---

## 💡 왜 anon key를 사용하나요?

1. **안전함**: RLS 정책으로 데이터 접근이 제한됨
2. **공개 가능**: 클라이언트 코드에 포함되어도 안전
3. **편리함**: 별도의 인증 없이 바로 사용 가능
4. **권장 방식**: Supabase 공식 문서에서 권장하는 방법

---

## ⚠️ 주의사항

- `NEXT_PUBLIC_` 접두사가 있으면 클라이언트 번들에 포함됨
- 따라서 `anon public` 키만 사용해야 함
- `service_role` 키는 절대 `NEXT_PUBLIC_`과 함께 사용하지 마세요!
