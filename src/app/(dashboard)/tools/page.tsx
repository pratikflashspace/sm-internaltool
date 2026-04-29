'use client'
import Link from 'next/link'
import { TopBar } from '@/components/layout/TopBar'
import { ArrowRight } from 'lucide-react'

const tools = [
  { href: '/tools/signature', emoji: '✍️', title: 'Signature Stamper', desc: 'Upload a signed agreement PDF and auto-stamp all director and witness signatures.', badge: 'Active' },
  { href: '/tools/merge-sign', emoji: '🔗', title: 'Merge & Sign', desc: 'Upload e-Stamp + Agreement draft — merges both PDFs and stamps all signatures automatically.', badge: 'Active' },
]

export default function ToolsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <TopBar title="Tools" subtitle="Internal utilities" />
      <div style={{ padding: '32px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 700 }}>
          {tools.map(t => (
            <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', border: '1px solid hsl(36 16% 87%)', borderRadius: 8, padding: '20px 22px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'all 150ms ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'hsl(174 76% 42%)'; el.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'hsl(36 16% 87%)'; el.style.transform = 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: 'hsl(174 67% 94%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.emoji}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'hsl(174 82% 33%)', background: 'hsl(174 67% 94%)', padding: '2px 8px', borderRadius: 4, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.04em', textTransform: 'uppercase', height: 'fit-content' }}>{t.badge}</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'hsl(0 0% 7%)', letterSpacing: '-0.01em', marginBottom: 6, fontFamily: "'Inter',sans-serif" }}>{t.title}</p>
                <p style={{ fontSize: 12, color: 'hsl(217 14% 61%)', lineHeight: 1.5, marginBottom: 14, fontFamily: "'Inter',sans-serif" }}>{t.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'hsl(174 76% 42%)' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>Open</span>
                  <ArrowRight size={11} strokeWidth={2} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
