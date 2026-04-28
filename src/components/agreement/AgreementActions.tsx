'use client'
import { Button } from '@/components/ui'
import { buildGDocsPayload } from '@/lib/agreement/helpers'
import type { AgreementFormData } from '@/types'
import type { GDocResult } from '@/types'
import { Printer, FileText, Mail, MessageCircle, RotateCcw, ExternalLink } from 'lucide-react'

interface Props {
  data: AgreementFormData
  filledCount: number
  totalFields: number
  gdocResult: GDocResult | null
  gdocLoading: boolean
  onReset: () => void
  onGenerateDoc: () => Promise<GDocResult | { error: string }>
  onSendEmail: () => void
  onSendWhatsApp: () => void
  onPrint: () => void
}

export function AgreementActions({ data, filledCount, totalFields, gdocResult, gdocLoading, onReset, onGenerateDoc, onSendEmail, onSendWhatsApp, onPrint }: Props) {
  const pct = Math.round((filledCount / totalFields) * 100)

  return (
    <div className="flex flex-col gap-3">
      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold text-[#8e9aab] uppercase tracking-widest">Fields filled</span>
          <span className="text-[10px] font-bold text-[#1ABCB0]">{filledCount}/{totalFields}</span>
        </div>
        <div className="h-1 bg-[#e0e4e8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1ABCB0] rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Print */}
      <Button variant="secondary" size="sm" onClick={onPrint} className="w-full">
        <Printer size={13} /> Print / Save as PDF
      </Button>

      {/* Generate Google Doc */}
      <Button
        variant="primary" size="sm"
        onClick={onGenerateDoc}
        loading={gdocLoading}
        className="w-full"
      >
        <FileText size={13} /> {gdocResult?.success ? 'Re-Generate Google Doc' : 'Generate Google Doc'}
      </Button>

      {/* Doc result */}
      {gdocResult && (
        <div className={`rounded-md p-3 text-xs border ${gdocResult.success ? 'bg-[#e6faf9] border-[#1ABCB0]' : 'bg-red-50 border-red-200'}`}>
          {gdocResult.success ? (
            <>
              <p className="font-bold text-[#1ABCB0] uppercase tracking-wide text-[9px] mb-1.5">Google Doc Created ✓</p>
              <a
                href={gdocResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0f9c92] font-mono text-[10px] flex items-center gap-1 hover:underline break-all"
              >
                <ExternalLink size={10} /> {gdocResult.url}
              </a>
              <div className="flex gap-2 mt-2.5">
                <Button variant="primary" size="sm" onClick={onSendEmail} className="flex-1 text-[11px]">
                  <Mail size={11} /> Email
                </Button>
                <Button size="sm" onClick={onSendWhatsApp} className="flex-1 bg-[#25D366] hover:bg-[#1da651] text-white text-[11px]">
                  <MessageCircle size={11} /> WhatsApp
                </Button>
              </div>
            </>
          ) : (
            <p className="text-red-600">⚠ {gdocResult.error}</p>
          )}
        </div>
      )}

      {/* Reset */}
      <Button variant="ghost" size="sm" onClick={onReset} className="w-full text-[#8e9aab]">
        <RotateCcw size={12} /> Clear Form
      </Button>
    </div>
  )
}
