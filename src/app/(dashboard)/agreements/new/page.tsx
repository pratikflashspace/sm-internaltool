'use client'
import { useRef } from 'react'
import { useAgreementForm } from '@/components/agreement/useAgreementForm'
import { AgreementForm }    from '@/components/agreement/AgreementForm'
import { AgreementPreview } from '@/components/agreement/AgreementPreview'
import { AgreementActions } from '@/components/agreement/AgreementActions'
import { TopBar }           from '@/components/layout/TopBar'

export default function NewAgreementPage() {
  const form = useAgreementForm()
  const previewRef = useRef<HTMLDivElement>(null)
  const pct = Math.round((form.filledCount / form.totalFields) * 100)

  function handlePrint() {
    const content = previewRef.current?.innerHTML
    if (!content) return
    const win = window.open('', '_blank', 'width=860,height=700')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head>
      <title>SM Agreement — ${form.data.company || 'Agreement'}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @page { margin: 1in; size: A4; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #111; }
        ul { margin-left: 20px; margin-bottom: 8px; } li { margin-bottom: 4px; }
        p { margin-bottom: 8px; text-align: justify; }
        strong { font-weight: 600; }
      </style>
    </head><body>${content}<script>window.onload=function(){window.print()}<\/script></body></html>`)
    win.document.close()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar
        title="Agreement Generator"
        subtitle="Leave & License"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 80, height: 3, background: 'hsl(36 16% 87%)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'hsl(174 76% 42%)', borderRadius: 2, transition: 'width 300ms ease' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'hsl(174 76% 42%)', fontFamily: "'JetBrains Mono',monospace" }}>
              {form.filledCount}/{form.totalFields}
            </span>
          </div>
        }
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* ── LEFT: Form panel ── */}
        <div style={{
          width: 304, flexShrink: 0, display: 'flex', flexDirection: 'column',
          background: '#fff', borderRight: '1px solid hsl(36 16% 87%)', overflow: 'hidden',
        }}>
          {/* Scrollable form */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px' }}>
            <AgreementForm data={form.data} update={form.update} />
          </div>

          {/* Pinned actions */}
          <div style={{ flexShrink: 0, padding: '14px 18px', borderTop: '1px solid hsl(42 15% 94%)', background: 'hsl(48 17% 98%)' }}>
            <AgreementActions
              data={form.data}
              filledCount={form.filledCount}
              totalFields={form.totalFields}
              gdocResult={form.gdocResult}
              gdocLoading={form.gdocLoading}
              onReset={form.reset}
              onGenerateDoc={form.generateDoc}
              onSendEmail={form.sendEmail}
              onSendWhatsApp={form.sendWhatsApp}
              onPrint={handlePrint}
            />
          </div>
        </div>

        {/* ── RIGHT: Live preview ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'hsl(45 24% 97%)' }}>
          {/* Preview toolbar */}
          <div style={{
            flexShrink: 0, height: 40, padding: '0 24px',
            display: 'flex', alignItems: 'center', gap: 8,
            borderBottom: '1px solid hsl(36 16% 87%)', background: 'hsl(48 17% 98%)',
          }}>
            <div className="pulse-dot" />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'hsl(217 14% 61%)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Live Preview
            </span>
          </div>

          {/* A4 paper */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 48px' }}>
            <div style={{
              maxWidth: 720, margin: '0 auto',
              background: '#fff', borderRadius: 4,
              border: '1px solid hsl(36 16% 87%)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              minHeight: 1056, padding: '64px 72px',
              fontFamily: "'Inter', Arial, sans-serif",
            }}>
              <div ref={previewRef}>
                <AgreementPreview data={form.data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
