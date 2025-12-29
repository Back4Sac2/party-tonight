'use client'

import { useState } from 'react'
import { GiftList } from '@/components/domain/gift/gift-list'
import { GiftForm } from '@/components/domain/gift/gift-form'
import { TagForm } from '@/components/domain/tag/tag-form'
import { TagList } from '@/components/domain/tag/tag-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GiftsPage() {
  const [showGiftForm, setShowGiftForm] = useState(false)
  const [showTagForm, setShowTagForm] = useState(false)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">선물 관리</h1>
        <p className="text-gray-600">선물을 추가하고 태그를 설정하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>선물 목록</CardTitle>
              <button
                onClick={() => setShowGiftForm(!showGiftForm)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showGiftForm ? '취소' : '+ 추가'}
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {showGiftForm && (
              <div className="mb-6">
                <GiftForm onSuccess={() => setShowGiftForm(false)} />
              </div>
            )}
            <GiftList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>태그 목록</CardTitle>
              <button
                onClick={() => setShowTagForm(!showTagForm)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showTagForm ? '취소' : '+ 추가'}
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {showTagForm && (
              <div className="mb-6">
                <TagForm onSuccess={() => setShowTagForm(false)} />
              </div>
            )}
            <TagList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
