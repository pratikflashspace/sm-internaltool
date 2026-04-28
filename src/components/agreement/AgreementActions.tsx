'use client'
import { Button } from '@/components/ui'
import type { AgreementFormData, GDocResult } from '@/types'
import { Printer, FileText, Mail, MessageCircle, RotateCcw, ExternalLink, CheckCircle2 } from 'lucide-react'

interface Props {
  data: AgreementFormData; filledCount: number; totalFields: number
  gdocResult: GDocResult | null; gdocLoading: boolean
  onReset: () => void
  onGenerateDoc: () => Promise<GDocResult | { error: string }>
  onSendEmail: () => void; onSendWhatsApp: () => void; onPrint: () => void
}

export function AgreementActions({ filledCount, totalFields, gdocResult, gdocLoading, onReset, onGenerateDoc, onSendEmail, onSendWhatsApp, onPrint }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Buttons row */}
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="secondary" size="sm" onClick={onPrint} style={{ flex: 1, justifyContent: 'center' }}>
          <Printer size={12} strokeWidth={1.75} /> Print PDF
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset} title="Clear form" style={{ width: 32, padding: 0, flexShrink: 0 }}>
          <RotateCcw size={12} strokeWidth={1.75} />
        </Button>
      </div>

      {/* Generate Doc */}
      <Button variant="black" size="md" onClick={onGenerateDoc as any} loading={gdocLoading} style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
        <FileText size={13} strokeWidth={1.75} />
        {gdocResult?.success ? 'Re-generate Google Doc' : 'Generate Google Doc'}
      </Button>

      {/* Doc result */}
      {gdocResult && (
        <div className="fade-in-up" style={{
          borderRadius: 6, padding: '10px 12px',
          background: gdocResult.success ? 'hsl(174 67% 94%)' : 'hsl(0 76% 97%)',
          border: `1px solid ${gdocResult.success ? 'hsl(174 56% 78%)' : 'hsl(0 76% 88%)'}`,
        }}>
          {gdocResult.success ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                <CheckCircle2 size={11} color="hsl(174 82% 33%)" strokeWidth={2} />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'hsl(174 82% 33%)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Doc created
                </span>
              </div>
              <a href={gdocResult.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'hsl(174 82% 33%)', fontFamily: "'JetBrains Mono',monospace", wordBreak: 'break-all', marginBottom: 8, textDecoration: 'none' }}>
                <ExternalLink size={9} /> Open in Google Docs
              </a>
              <div style={{ display: 'flex', gap: 6 }}>
                <Button variant="primary" size="sm" onClick={onSendEmail} style={{ flex: 1, justifyContent: 'center', background: '#0072C6', fontSize: 11 }}>
                  <Mail size={10} strokeWidth={1.75} /> Email
                </Button>
                <Button variant="whatsapp" size="sm" onClick={onSendWhatsApp} style={{ flex: 1, justifyContent: 'center', fontSize: 11 }}>
                  <MessageCircle size={10} strokeWidth={1.75} /> WhatsApp
                </Button>
              </div>
            </>
          ) : (
            <p style={{ fontSize: 11, color: 'hsl(0 76% 57%)', fontFamily: "'Inter',sans-serif" }}>⚠ {gdocResult.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
