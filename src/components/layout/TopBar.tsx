'use client'

interface TopBarProps {
  title: string
  subtitle?: string
  right?: React.ReactNode
}

export function TopBar({ title, subtitle, right }: TopBarProps) {
  return (
    <div style={{
      height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
      background: 'rgba(255,255,255,0.80)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderBottom: '1px solid hsl(36 16% 87%)',
      flexShrink: 0,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'hsl(0 0% 7%)', letterSpacing: '-0.01em', fontFamily: "'Inter',sans-serif", lineHeight: 1 }}>
          {title}
        </h1>
        {subtitle && (
          <span style={{ fontSize: 10, fontWeight: 700, color: 'hsl(174 76% 42%)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace" }}>
            {subtitle}
          </span>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  )
}
