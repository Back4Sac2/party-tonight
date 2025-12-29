import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Providers } from '../providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '입장 - Party Tonight',
  description: '입장 코드를 입력하세요',
}

export default function EnterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

