import jwt from 'jsonwebtoken'

function getSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not set')
  }

  return secret
}

const secret = getSecret()

export interface AuthTokenPayload {
  userId: number
}

export function signToken(userId: number): string {
  return jwt.sign({ userId } satisfies AuthTokenPayload, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, secret) as AuthTokenPayload
}
