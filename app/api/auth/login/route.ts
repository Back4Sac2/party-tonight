import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server-client'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { setSessionCookie } from '@/lib/auth/session'

const MASTER_KEY = process.env.MASTER_KEY || 'admin123'

export async function POST(request: NextRequest) {
  try {
    const { name, password } = await request.json()

    if (!name || !password) {
      return NextResponse.json(
        { error: '이름과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 관리자 체크
    if (password === MASTER_KEY) {
      // 관리자 유저 찾기 또는 생성
      let { data: adminUser } = await supabaseServer
        .from('users')
        .select('*')
        .eq('name', name)
        .eq('role', 'admin')
        .single()

      if (!adminUser) {
        // 관리자 유저 생성
        const passwordHash = hashPassword(MASTER_KEY)
        // @ts-expect-error - Supabase 타입 추론 이슈
        const { data: newAdmin, error: createError } = await supabaseServer
          .from('users')
          .insert({
            name,
            password_hash: passwordHash,
            role: 'admin',
          })
          .select()
          .single()

        if (createError || !newAdmin) {
          return NextResponse.json(
            { error: '관리자 생성 실패' },
            { status: 500 }
          )
        }
        adminUser = newAdmin as any
      }

      if (!adminUser) {
        return NextResponse.json(
          { error: '관리자 정보를 가져올 수 없습니다.' },
          { status: 500 }
        )
      }

      const admin = adminUser as any
      await setSessionCookie(admin.id)
      return NextResponse.json({
        success: true,
        user: {
          id: admin.id,
          name: admin.name,
          role: admin.role,
        },
      })
    }

    // 일반 유저 로그인/등록
    const { data: existingUser } = await supabaseServer
      .from('users')
      .select('*')
      .eq('name', name)
      .single()

    if (existingUser) {
      // 로그인
      const isValid = verifyPassword(
        password,
        (existingUser as any).password_hash
      )
      if (!isValid) {
        return NextResponse.json(
          { error: '비밀번호가 올바르지 않습니다.' },
          { status: 401 }
        )
      }

      await setSessionCookie((existingUser as any).id)
      return NextResponse.json({
        success: true,
        user: {
          id: (existingUser as any).id,
          name: (existingUser as any).name,
          role: (existingUser as any).role,
        },
      })
    } else {
      // 신규 유저 등록
      const passwordHash = hashPassword(password)
      // @ts-expect-error - Supabase 타입 추론 이슈
      const { data: newUser, error: createError } = await supabaseServer
        .from('users')
        .insert({
          name,
          password_hash: passwordHash,
          role: 'user',
        })
        .select()
        .single()

      if (createError || !newUser) {
        return NextResponse.json({ error: '유저 생성 실패' }, { status: 500 })
      }

      await setSessionCookie((newUser as any).id)
      return NextResponse.json({
        success: true,
        user: {
          id: (newUser as any).id,
          name: (newUser as any).name,
          role: (newUser as any).role,
        },
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
