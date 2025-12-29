'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { hasAccess, setAccessCookie } from '@/lib/access'
import { useAccessStore } from '@/stores'

export default function EnterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const grantAccess = useAccessStore((state) => state.grantAccess)

  // 이미 접근 권한이 있으면 리다이렉트
  useEffect(() => {
    if (hasAccess()) {
      const redirect = searchParams.get('redirect') || '/'
      router.replace(redirect)
    }
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const accessCode = process.env.NEXT_PUBLIC_ACCESS_CODE

    if (!accessCode) {
      setError('서버 설정 오류가 발생했습니다.')
      setIsSubmitting(false)
      return
    }

    // 코드 검증
    if (code.trim() !== accessCode.trim()) {
      setError('입장 코드가 올바르지 않습니다.')
      setIsSubmitting(false)
      return
    }

    // 쿠키 설정 및 상태 업데이트
    setAccessCookie()
    grantAccess()

    // 리다이렉트
    const redirect = searchParams.get('redirect') || '/'
    router.replace(redirect)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">🎉 Party Tonight</CardTitle>
          <CardDescription>
            입장 코드를 입력하여 접속하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="access-code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                입장 코드
              </label>
              <Input
                id="access-code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError('')
                }}
                placeholder="4~10자리 코드 입력"
                className="text-center text-lg tracking-widest"
                maxLength={10}
                autoFocus
                disabled={isSubmitting}
                autoComplete="off"
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
              disabled={isSubmitting || !code.trim()}
            >
              {isSubmitting ? '확인 중...' : '입장하기'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>입장 코드는 친구에게 문의하세요</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

