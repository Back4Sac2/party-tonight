'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui'

function EnterPageContent() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
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

      // 로그인 성공 시 홈으로 이동
      router.push('/gifts')
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
            유저명과 비밀번호를 입력하세요
            <br />
            <span className="text-xs text-gray-400">
              (없으면 자동으로 생성됩니다)
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoFocus
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
              <p className="text-xs text-gray-500 mt-1">
                관리자는 환경변수 MASTER_KEY를 입력하세요
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !name.trim() || !password.trim()}
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
