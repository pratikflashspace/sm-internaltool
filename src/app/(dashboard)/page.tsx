import Link from 'next/link'
import { TopBar } from '@/components/layout/TopBar'
import { Badge } from '@/components/ui'
import { ArrowRight, FileText, Users, Wrench, LayoutDashboard } from 'lucide-react'

const tools = [
  { href: '/agreements/new',    icon: FileText,        emoji: '📋', title: 'Agreement Generator', desc: 'Generate Leave & License agreements with live preview and one-click Google Docs export.', badge: 'active' as const },
  { href: '/tools/signature',   icon: Wrench,          emoji: '✍️', title: 'Signature Stamper',   desc: 'Upload a signed PDF and auto-stamp all director and witness signatures in the correct positions.', badge: 'active' as const },
  { href: '/agreements',        icon: LayoutDashboard, emoji: '📁', title: 'All Agreements',       desc: 'Browse and manage all previously generated agreements. Coming in Phase 2.', badge: 'soon' as const },
  { href: '/clients',           icon: Users,           emoji: '👥', title: 'Clients',              desc: 'Client records linked to agreements, renewal tracking and more. Coming in Phase 3.', badge: 'soon' as const },
]

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <TopBar title="Operations Dashboard" subtitle="Stirring Minds" />

      <div style={{ padding: '36px 40px', maxWidth: 900 }}>
        {/* Greeting */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, color: 'hsl(217 14% 61%)', fontFamily: "'Inter',sans-serif" }}>
            Internal tools for the Stirring Minds operations team.
          </p>
        </div>

        {/* Tool grid — 2 cols */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {tools.map(t => (
            <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#fff', border: '1px solid hsl(36 16% 87%)',
                  borderRadius: 8, padding: '20px 22px', cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'hsl(174 76% 42%)'
                  el.style.boxShadow = '0 4px 20px hsl(174 76% 42% / 0.10), 0 1px 4px rgba(0,0,0,0.04)'
                  el.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'hsl(36 16% 87%)'
                  el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 6, background: 'hsl(174 67% 94%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {t.emoji}
                  </div>
                  <Badge color={t.badge === 'active' ? 'teal' : 'gray'}>
                    {t.badge === 'active' ? 'Active' : 'Coming soon'}
                  </Badge>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'hsl(0 0% 7%)', letterSpacing: '-0.01em', marginBottom: 6, fontFamily: "'Inter',sans-serif" }}>
                  {t.title}
                </p>
                <p style={{ fontSize: 12, color: 'hsl(217 14% 61%)', lineHeight: 1.5, marginBottom: 16, fontFamily: "'Inter',sans-serif" }}>
                  {t.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'hsl(174 76% 42%)' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>Open tool</span>
                  <ArrowRight size={11} strokeWidth={2} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom stats */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          {[
            { val: '2', label: 'Active tools', color: 'hsl(174 76% 42%)' },
            { val: '2', label: 'Coming soon', color: 'hsl(217 14% 61%)' },
            { val: 'v1', label: 'Current phase', color: 'hsl(0 0% 7%)' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: '#fff', border: '1px solid hsl(36 16% 87%)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: s.color, letterSpacing: '-0.02em', fontFamily: "'JetBrains Mono',monospace" }}>{s.val}</span>
              <span style={{ fontSize: 11, color: 'hsl(217 14% 61%)', fontFamily: "'Inter',sans-serif" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
