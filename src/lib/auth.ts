export const AUTH_COOKIE = 'sm_auth'
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

type AuthConfig = { email: string; password: string; secret: string }

export function getAuthConfig(): AuthConfig | null {
  const email = process.env.AUTH_EMAIL
  const password = process.env.AUTH_PASSWORD
  const secret = process.env.AUTH_SECRET
  if (!email || !password || !secret) return null
  return { email, password, secret }
}

export function checkCredentials(email: string, password: string) {
  const cfg = getAuthConfig()
  if (!cfg) return false
  return (
    email.trim().toLowerCase() === cfg.email.toLowerCase() &&
    password === cfg.password
  )
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

async function hmac(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return bytesToHex(new Uint8Array(sig))
}

export async function createAuthCookie() {
  const cfg = getAuthConfig()
  if (!cfg) throw new Error('AUTH_SECRET is not configured')
  const payload = `${cfg.email}.${Date.now()}`
  const sig = await hmac(payload, cfg.secret)
  return `${btoa(payload)}.${sig}`
}

export async function verifyAuthCookie(token: string) {
  const cfg = getAuthConfig()
  if (!cfg) return false
  const [b64, sig] = token.split('.')
  if (!b64 || !sig) return false
  let payload: string
  try {
    payload = atob(b64)
  } catch {
    return false
  }
  const [, issuedAtStr] = payload.split('.')
  const issuedAt = Number(issuedAtStr)
  if (!Number.isFinite(issuedAt)) return false
  if (Date.now() - issuedAt > AUTH_COOKIE_MAX_AGE * 1000) return false
  const expected = await hmac(payload, cfg.secret)
  if (expected.length !== sig.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i)
  }
  return diff === 0
}
