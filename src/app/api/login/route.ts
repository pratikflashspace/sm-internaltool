import { NextResponse } from 'next/server'
import {
  AUTH_COOKIE,
  AUTH_COOKIE_MAX_AGE,
  checkCredentials,
  createAuthCookie,
  getAuthConfig,
} from '@/lib/auth'

export const runtime = 'edge'

export async function POST(req: Request) {
  if (!getAuthConfig()) {
    return NextResponse.json(
      { error: 'Auth is not configured on the server (missing AUTH_EMAIL / AUTH_PASSWORD / AUTH_SECRET).' },
      { status: 503 },
    )
  }

  let body: { email?: string; password?: string } = {}
  try {
    body = (await req.json()) as { email?: string; password?: string }
  } catch {
    /* empty body */
  }
  const email = String(body.email ?? '')
  const password = String(body.password ?? '')

  if (!checkCredentials(email, password)) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const token = await createAuthCookie()
  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE,
  })
  return res
}
