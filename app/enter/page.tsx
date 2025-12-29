'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui'
import { setAccessCookie } from '@/lib/access'

function EnterPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [accessCode, setAccessCode] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // 1단계: 접근 코드 검증
      const accessCodeEnv = process.env.NEXT_PUBLIC_ACCESS_CODE

      if (!accessCodeEnv) {
        setError('접근 코드가 설정되지 않았습니다.')
        setIsSubmitting(false)
        return
      }

      if (accessCode !== accessCodeEnv) {
        setError('접근 코드가 올바르지 않습니다.')
        setIsSubmitting(false)
        return
      }

      // 접근 코드 통과 - 쿠키 설정
      setAccessCookie()

      // 2단계: 로그인 처리
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '로그인에 실패했습니다.')
        setIsSubmitting(false)
        return
      }

      // 로그인 성공 시 원래 가려던 페이지 또는 홈으로 이동
      const redirect = searchParams.get('redirect') || '/gifts'
      router.push(redirect)
      router.refresh()
    } catch (error) {
      setError('서버 오류가 발생했습니다.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">🎉 Party Tonight</CardTitle>
          <CardDescription>
            접근 코드, 유저명, 비밀번호를 입력하세요
            <br />
            <span className="text-xs text-gray-400">
              (유저명과 비밀번호는 없으면 자동으로 생성됩니다)
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="accessCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                접근 코드
              </label>
              <Input
                id="accessCode"
                type="text"
                value={accessCode}
                onChange={e => {
                  setAccessCode(e.target.value)
                  setError('')
                }}
                placeholder="접근 코드 입력"
                required
                disabled={isSubmitting}
                autoFocus
                maxLength={20}
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                유저명
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value)
                  setError('')
                }}
                placeholder="유저명 입력"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="비밀번호 입력"
                required
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting ||
                !accessCode.trim() ||
                !name.trim() ||
                !password.trim()
              }
              variant="primary"
            >
              {isSubmitting ? '처리 중...' : '입장하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function EnterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div>로딩 중...</div>
        </div>
      }
    >
      <EnterPageContent />
    </Suspense>
  )
}
