'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { FileText, LayoutDashboard, Users, Wrench, ChevronLeft, ChevronRight, Zap } from 'lucide-react'

const NAV = [
  { href: '/agreements/new', label: 'New Agreement',   icon: FileText },
  { href: '/agreements',     label: 'All Agreements',  icon: LayoutDashboard },
  { href: '/clients',        label: 'Clients',          icon: Users },
  { href: '/tools',          label: 'Tools',            icon: Wrench },
]

export function Sidebar() {
  const path = usePathname()
  const [open, setOpen] = useState(true)

  return (
    <aside style={{
      width: open ? 208 : 52, flexShrink: 0,
      background: '#0A0A0A', display: 'flex', flexDirection: 'column',
      minHeight: '100vh', transition: 'width 200ms ease-out',
      overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>

      {/* Logo */}
      <div style={{ padding: open ? '18px 14px 16px' : '18px 12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
        <div style={{ width: 28, height: 28, borderRadius: 4, background: 'linear-gradient(135deg, hsl(174 76% 42%), hsl(174 82% 33%))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px hsl(174 76% 42% / 0.35)' }}>
          <Zap size={13} color="white" strokeWidth={2.5} fill="white" />
        </div>
        {open && (
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2, whiteSpace: 'nowrap', fontFamily: "'Inter',sans-serif" }}>Stirring Minds</p>
            <p style={{ fontSize: 9, fontWeight: 600, color: '#4A5568', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>Ops Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 6px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {open && (
          <p style={{ fontSize: 9, fontWeight: 600, color: '#4A5568', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace", padding: '4px 8px 8px' }}>
            Workspace
          </p>
        )}
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/agreements' && path.startsWith(href))
          return (
            <Link key={href} href={href} title={!open ? label : undefined} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: open ? '7px 10px' : '9px 13px',
                borderRadius: 4, cursor: 'pointer', overflow: 'hidden',
                background: active ? 'hsl(174 76% 42%)' : 'transparent',
                color: active ? '#fff' : 'hsl(217 18% 82%)',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#fff' } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'hsl(217 18% 82%)' } }}
              >
                <Icon size={14} strokeWidth={active ? 2 : 1.75} style={{ flexShrink: 0 }} />
                {open && <span style={{ fontSize: 12.5, fontWeight: 500, fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap' }}>{label}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: '8px 6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => setOpen(o => !o)}
          style={{
            width: '100%', height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4, cursor: 'pointer', color: '#4A5568', transition: 'all 150ms ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'hsl(174 76% 42%)'; (e.currentTarget as HTMLElement).style.color = 'hsl(174 76% 42%)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = '#4A5568' }}
        >
          {open ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </div>
    </aside>
  )
}
