'use client'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

// ── TOKENS (inline — always semantic) ────────────────────────────
const T = {
  bg:         'hsl(45 24% 97%)',
  surface:    'hsl(0 0% 100%)',
  primary:    'hsl(174 76% 42%)',
  primaryDk:  'hsl(174 82% 33%)',
  primaryLt:  'hsl(174 67% 94%)',
  primaryBd:  'hsl(174 56% 78%)',
  ink:        'hsl(0 0% 7%)',
  ink2:       'hsl(218 19% 35%)',
  ink3:       'hsl(217 14% 61%)',
  border:     'hsl(36 16% 87%)',
  borderSt:   'hsl(36 9% 76%)',
  muted:      'hsl(42 15% 94%)',
  error:      'hsl(0 76% 57%)',
}

// ── BUTTON ────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'black' | 'whatsapp'
  size?: 'sm' | 'md'
  loading?: boolean
}

export function Button({ variant = 'primary', size = 'md', loading, children, className, disabled, style, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600, borderRadius: 4, border: 'none', cursor: 'pointer',
    outline: 'none', whiteSpace: 'nowrap',
    transition: 'all 150ms ease',
    fontSize: size === 'sm' ? 12 : 13,
    padding: size === 'sm' ? '6px 12px' : '8px 16px',
    height: size === 'sm' ? 28 : 32,
    opacity: disabled || loading ? 0.45 : 1,
    pointerEvents: disabled || loading ? 'none' : 'auto',
  }
  const variants: Record<string, React.CSSProperties> = {
    primary:   { background: T.primary, color: '#fff', boxShadow: '0 2px 8px hsl(174 76% 42% / 0.12)' },
    secondary: { background: T.surface, color: T.ink, border: `1px solid ${T.border}` },
    ghost:     { background: 'transparent', color: T.ink3 },
    danger:    { background: T.error, color: '#fff' },
    black:     { background: T.ink, color: '#fff' },
    whatsapp:  { background: '#25D366', color: '#fff' },
  }
  return (
    <button
      disabled={disabled || loading}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => {
        const el = e.currentTarget
        if (variant === 'primary') el.style.background = T.primaryDk
        if (variant === 'secondary') { el.style.borderColor = T.primary; el.style.background = T.bg }
        if (variant === 'ghost') { el.style.background = T.bg; el.style.color = T.ink }
        if (variant === 'black') el.style.background = '#222'
        el.style.transform = 'scale(1.02)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        Object.assign(el.style, variants[variant])
        el.style.transform = 'scale(1)'
      }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.02)' }}
      className={className}
      {...props}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : children}
    </button>
  )
}

// ── INPUT ──────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; required?: boolean; hint?: string; prefix?: string; error?: string
}

export function Input({ label, required, hint, prefix, error, className, style, ...props }: InputProps) {
  const inputStyle: React.CSSProperties = {
    width: '100%', height: 36,
    padding: prefix ? '0 12px' : '0 12px',
    fontSize: 13, fontFamily: "'Inter', sans-serif",
    color: T.ink, background: T.surface,
    border: `1px solid ${error ? T.error : T.border}`,
    borderRadius: 4, outline: 'none',
    transition: 'border-color 150ms, box-shadow 150ms',
    ...style,
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, color: T.ink2, fontSize: 11, fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>
          {label}{required && <span style={{ color: T.primary }}>*</span>}
          {hint && <span style={{ color: T.ink3, fontWeight: 400, marginLeft: 2 }}>— {hint}</span>}
        </label>
      )}
      {prefix ? (
        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${error ? T.error : T.border}`, borderRadius: 4, background: T.surface, overflow: 'hidden' }}
          onFocusCapture={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px hsl(174 76% 42% / 0.18)'}
          onBlurCapture={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}>
          <span style={{ padding: '0 10px', background: T.muted, color: T.ink2, fontSize: 12, fontWeight: 700, borderRight: `1px solid ${T.border}`, height: 36, display: 'flex', alignItems: 'center', flexShrink: 0, fontFamily: 'monospace' }}>{prefix}</span>
          <input style={{ ...inputStyle, border: 'none', borderRadius: 0, flex: 1 }}
            onFocus={e => {}} onBlur={e => {}} {...props} />
        </div>
      ) : (
        <input style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.boxShadow = '0 0 0 3px hsl(174 76% 42% / 0.18)' }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? T.error : T.border; e.currentTarget.style.boxShadow = 'none' }}
          {...props} />
      )}
      {error && <p style={{ fontSize: 11, color: T.error }}>{error}</p>}
    </div>
  )
}

// ── SELECT ─────────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; required?: boolean; options: { value: string; label: string }[]; placeholder?: string; error?: string
}

export function Select({ label, required, options, placeholder, error, style, ...props }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 600, color: T.ink2, fontFamily: "'Inter',sans-serif" }}>
          {label}{required && <span style={{ color: T.primary, marginLeft: 2 }}>*</span>}
        </label>
      )}
      <select
        style={{
          width: '100%', height: 36, padding: '0 28px 0 12px',
          fontSize: 13, fontFamily: "'Inter', sans-serif",
          color: T.ink, background: T.surface,
          border: `1px solid ${error ? T.error : T.border}`, borderRadius: 4,
          outline: 'none', cursor: 'pointer', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238E9AAB' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
          ...style,
        }}
        onFocus={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.boxShadow = '0 0 0 3px hsl(174 76% 42% / 0.18)' }}
        onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = 'none' }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// ── RADIO GROUP ────────────────────────────────────────────────────
interface RadioGroupProps {
  label?: string; required?: boolean; name: string; value: string
  onChange: (val: string) => void; options: { value: string; label: string }[]
}

export function RadioGroup({ label, required, name, value, onChange, options }: RadioGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 600, color: T.ink2, fontFamily: "'Inter',sans-serif" }}>
          {label}{required && <span style={{ color: T.primary, marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map(o => {
          const active = value === o.value
          return (
            <button key={o.value} type="button" onClick={() => onChange(o.value)}
              style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 600, fontFamily: "'Inter',sans-serif",
                borderRadius: 4, border: `1px solid ${active ? T.primary : T.border}`,
                background: active ? T.primary : T.surface,
                color: active ? '#fff' : T.ink2,
                cursor: 'pointer', transition: 'all 150ms ease',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.ink2 } }}
            >{o.label}</button>
          )
        })}
      </div>
    </div>
  )
}

// ── CARD ───────────────────────────────────────────────────────────
export function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)', ...style }} className={className}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: `1px solid ${T.primaryLt}` }}>
      {icon && (
        <div style={{ width: 32, height: 32, borderRadius: 6, background: T.primaryLt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
          {icon}
        </div>
      )}
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>{title}</p>
        {subtitle && <p className="mono-label" style={{ marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
  )
}

// ── SECTION LABEL ──────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, marginTop: 4 }}>
      <span className="mono-label">{children}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${T.primaryLt}, transparent)` }} />
    </div>
  )
}

// ── BADGE ──────────────────────────────────────────────────────────
const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  teal:  { bg: '#E6FAF9', color: '#1ABCB0' },
  gray:  { bg: '#F4F2EE', color: '#8E9AAB' },
  green: { bg: '#F0FFF4', color: '#22C55E' },
  red:   { bg: '#FFF5F5', color: '#E53E3E' },
  amber: { bg: '#FFFBEB', color: '#D97706' },
}

export function Badge({ children, color = 'teal' }: { children: React.ReactNode; color?: keyof typeof BADGE_STYLES }) {
  const s = BADGE_STYLES[color] || BADGE_STYLES.teal
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 4, background: s.bg, color: s.color, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {children}
    </span>
  )
}
