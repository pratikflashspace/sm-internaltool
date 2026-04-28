'use client'
import { useRef } from 'react'
import { useAgreementForm } from '@/components/agreement/useAgreementForm'
import { AgreementForm } from '@/components/agreement/AgreementForm'
import { AgreementPreview } from '@/components/agreement/AgreementPreview'
import { AgreementActions } from '@/components/agreement/AgreementActions'

export default function NewAgreementPage() {
  const { data, update, reset, filledCount, totalFields, gdocResult, gdocLoading, generateDoc, sendEmail, sendWhatsApp } = useAgreementForm()
  const previewRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    const content = previewRef.current?.innerHTML
    if (!content) return
    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head>
      <title>SM Agreement — ${data.company || 'Agreement'}</title>
      <style>
        @page { margin: 1in; size: A4; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #111; padding: 0; }
        ul { margin-left: 20px; margin-bottom: 8px; }
        li { margin-bottom: 3px; }
        p { margin-bottom: 8px; text-align: justify; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        strong { font-weight: 700; }
        .border-t-2 { border-top: 2px solid #eee; margin-top: 24px; padding-top: 16px; }
      </style>
    </head><body>${content}<script>window.onload=function(){window.print()}<\/script></body></html>`)
    win.document.close()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f6f8]">

      {/* LEFT: Form */}
      <div className="w-[320px] shrink-0 flex flex-col bg-white border-r border-[#e0e4e8] overflow-hidden">

        {/* Header */}
        <div className="px-4 py-3 border-b border-[#f0f2f4] shrink-0 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#e6faf9] rounded-md flex items-center justify-center text-sm shrink-0">📋</div>
          <div>
            <p className="text-[13px] font-bold text-[#0a0a0a]">Agreement Generator</p>
            <p className="text-[9px] text-[#1ABCB0] uppercase tracking-widest font-mono font-bold">Leave & License</p>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <AgreementForm data={data} update={update} />
        </div>

        {/* Actions pinned bottom */}
        <div className="shrink-0 px-4 py-3 border-t border-[#f0f2f4] bg-[#fafbfc]">
          <AgreementActions
            data={data}
            filledCount={filledCount}
            totalFields={totalFields}
            gdocResult={gdocResult}
            gdocLoading={gdocLoading}
            onReset={reset}
            onGenerateDoc={generateDoc}
            onSendEmail={sendEmail}
            onSendWhatsApp={sendWhatsApp}
            onPrint={handlePrint}
          />
        </div>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Preview toolbar */}
        <div className="shrink-0 px-5 py-2 bg-white border-b border-[#e0e4e8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1ABCB0] animate-pulse" />
            <span className="text-[10px] font-bold text-[#8e9aab] uppercase tracking-widest">Live Preview</span>
          </div>
          <span className="text-[10px] font-bold text-[#1ABCB0]">{filledCount}/{totalFields} fields filled</span>
        </div>

        {/* Preview scroll area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* A4-like paper */}
          <div className="max-w-[760px] mx-auto bg-white shadow-md rounded-sm border border-[#e0e4e8]"
            style={{ minHeight: '1050px', padding: '60px 72px' }}>
            <div ref={previewRef}>
              <AgreementPreview data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
