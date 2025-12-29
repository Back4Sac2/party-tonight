# 환경 변수 설정 가이드

## 📝 필수 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# 접근 제어 (기존)
NEXT_PUBLIC_ACCESS_CODE=1234

# 관리자 마스터 키 (v2)
MASTER_KEY=your-admin-password-here
```

## 🔑 MASTER_KEY 설명

`MASTER_KEY`는 관리자 권한을 부여하는 비밀번호입니다.

### 사용 방법

1. `/enter` 페이지에서 유저명과 비밀번호 입력
2. 비밀번호에 `MASTER_KEY` 값을 입력
3. 자동으로 `role='admin'`으로 유저 생성/로그인

### 예시

```env
MASTER_KEY=admin123
```

이 경우:

- 유저명: `admin` (또는 원하는 이름)
- 비밀번호: `admin123` 입력
- → 관리자 권한으로 로그인됨

### 보안 권장사항

- 프로덕션에서는 복잡한 비밀번호 사용
- `.env.local`은 `.gitignore`에 포함되어 있어야 함
- Vercel 배포 시 환경 변수로 설정

## 📍 파일 위치

`.env.local` 파일은 프로젝트 루트에 생성:

```
party_tonight/
├── .env.local          ← 여기에 생성
├── package.json
├── next.config.js
└── ...
```

## ⚠️ 주의사항

1. **기본값**: 환경 변수가 없으면 기본값 `admin123` 사용 (개발용)
2. **프로덕션**: 반드시 환경 변수로 설정
3. **보안**: 절대 Git에 커밋하지 마세요!
