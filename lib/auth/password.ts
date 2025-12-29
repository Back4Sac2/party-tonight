/**
 * 비밀번호 해시 및 검증 유틸리티
 * 간단한 SHA-256 사용 (프로덕션에서는 bcrypt 권장)
 */

import { createHash } from 'crypto'

/**
 * 비밀번호를 SHA-256으로 해시
 */
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

/**
 * 비밀번호 검증
 */
export function verifyPassword(password: string, hash: string): boolean {
  const passwordHash = hashPassword(password)
  return passwordHash === hash
}
