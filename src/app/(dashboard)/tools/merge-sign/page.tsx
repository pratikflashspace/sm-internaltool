'use client'
import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui'
import { Upload, Download, CheckCircle2, FileText, Merge, X, ArrowDown } from 'lucide-react'
import { SIGNATURES } from '@/lib/signatures'

type Position = 'left' | 'right' | 'center'
type FileSlot = { file: File; name: string } | null

export default function MergeSignPage() {
  const [eStamp, setEStamp]   = useState<FileSlot>(null)
  const [draft, setDraft]     = useState<FileSlot>(null)
  const [processing, setProcessing] = useState(false)
  const [done, setDone]       = useState(false)
  const [resultUrl, setResultUrl]   = useState<string | null>(null)
  const [resultName, setResultName] = useState('')
  const [error, setError]     = useState<string | null>(null)
  const [log, setLog]         = useState<string[]>([])
  const [position, setPosition] = useState<Position>('right')
  const [sigSize, setSigSize]   = useState(70)
  const [margin, setMargin]     = useState(28)
  const [pageCount, setPageCount] = useState(0)

  const eStampRef = useRef<HTMLInputElement>(null)
  const draftRef  = useRef<HTMLInputElement>(null)

  const addLog = (msg: string) => setLog(prev => [...prev, msg])

  function handleDrop(slot: 'estamp' | 'draft') {
    return (e: React.DragEvent) => {
      e.preventDefault()
      const f = e.dataTransfer.files[0]
      if (f) setSlot(slot, f)
    }
  }

  function setSlot(slot: 'estamp' | 'draft', f: File) {
    if (!f.name.endsWith('.pdf')) { setError('Only PDF files supported'); return }
    setError(null); setDone(false); setResultUrl(null); setLog([])
    if (slot === 'estamp') setEStamp({ file: f, name: f.name })
    else setDraft({ file: f, name: f.name })
  }

  async function process() {
    if (!eStamp || !draft) { setError('Upload both files first'); return }
    setProcessing(true); setError(null); setLog([]); setDone(false)

    try {
      addLog('Loading pdf-lib…')
      const { PDFDocument } = await loadPdfLib()

      // ── STEP 1: Read both PDFs ──
      addLog('Reading e-Stamp PDF…')
      const eStampBytes = await eStamp.file.arrayBuffer()
      const eStampDoc   = await PDFDocument.load(eStampBytes)

      addLog('Reading draft agreement PDF…')
      const draftBytes = await draft.file.arrayBuffer()
      const draftDoc   = await PDFDocument.load(draftBytes)

      // ── STEP 2: Merge — eStamp first, then draft ──
      addLog('Merging PDFs (e-Stamp + Agreement)…')
      const mergedDoc = await PDFDocument.create()

      const eStampPages = await mergedDoc.copyPages(eStampDoc, eStampDoc.getPageIndices())
      for (const p of eStampPages as any[]) mergedDoc.addPage(p)

      const draftPages = await mergedDoc.copyPages(draftDoc, draftDoc.getPageIndices())
      for (const p of draftPages as any[]) mergedDoc.addPage(p)
      const pages = mergedDoc.getPages()
      const total = pages.length
      const eStampCount = eStampDoc.getPageCount()
      setPageCount(total)
      addLog(`Merged: ${eStampCount} e-Stamp page(s) + ${draftDoc.getPageCount()} agreement pages = ${total} total`)

      // ── STEP 3: Embed signatures ──
      addLog('Embedding signatures…')
      const pranavImg  = await mergedDoc.embedPng(base64ToBytes(SIGNATURES.pranav))
      const kanchanImg = await mergedDoc.embedPng(base64ToBytes(SIGNATURES.kanchan))
      const pratikImg  = await mergedDoc.embedPng(base64ToBytes(SIGNATURES.pratik))
      const surabhiImg = await mergedDoc.embedPng(base64ToBytes(SIGNATURES.surabhi))

      const sigW = sigSize
      const gap  = 6
      const pairW = sigW * 2 + gap

      // ── STEP 4: Pranav on e-Stamp pages ONLY ──
      addLog('Stamping Pranav on e-Stamp pages…')
      for (let i = 0; i < eStampCount; i++) {
        const page = pages[i]
        const { width, height } = page.getSize()
        
        // Make it bigger
        const pDims = pranavImg.scale((sigW * 1.5) / pranavImg.width)

        let startX: number
        if (position === 'left')       startX = margin
        else if (position === 'right') startX = width - margin - (sigW * 1.5)
        else                           startX = (width - (sigW * 1.5)) / 2

        // Move it left and up
        page.drawImage(pranavImg, { 
            x: startX - 40, // moved further left
            y: margin + 140, // moved even more higher up
            width: pDims.width, 
            height: pDims.height, 
            opacity: 0.92 
        })
      }

      // ── STEP 7: Save ──
      addLog('Saving final PDF…')
      const finalBytes = await mergedDoc.save()
      const blob = new Blob([finalBytes], { type: 'application/pdf' })
      const url  = URL.createObjectURL(blob)
      const name = draft.name.replace('.pdf', '_merged_signed.pdf')

      setResultUrl(url); setResultName(name)
      setDone(true); setProcessing(false)
      addLog('✅ Done!')

    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setProcessing(false)
    }
  }

  function base64ToBytes(b64: string): Uint8Array {
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return bytes
  }

  async function loadPdfLib(): Promise<any> {
    if ((window as any).PDFLib) return (window as any).PDFLib
    return new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'
      s.onload = () => resolve((window as any).PDFLib)
      s.onerror = reject
      document.head.appendChild(s)
    })
  }

  function download() {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl; a.download = resultName; a.click()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* TopBar */}
      <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(8px)', borderBottom: '1px solid hsl(36 16% 87%)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'hsl(0 0% 7%)', letterSpacing: '-0.01em', fontFamily: "'Inter',sans-serif" }}>Merge & Sign</h1>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'hsl(174 76% 42%)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace" }}>e-Stamp + Agreement</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        <div style={{ maxWidth: 860, display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Upload row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center' }}>

              {/* e-Stamp upload */}
              <DropZone
                label="e-Stamp PDF"
                sublabel="Upload first"
                file={eStamp}
                onDrop={handleDrop('estamp')}
                onClick={() => eStampRef.current?.click()}
                onClear={() => { setEStamp(null); setDone(false) }}
                accent="#6366f1"
              />
              <input ref={eStampRef} type="file" accept=".pdf" className="hidden" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && setSlot('estamp', e.target.files[0])} />

              {/* Arrow */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: 'hsl(217 14% 61%)' }}>
                <Merge size={20} strokeWidth={1.5} />
                <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>merge</span>
              </div>

              {/* Draft upload */}
              <DropZone
                label="Agreement Draft PDF"
                sublabel="Upload second"
                file={draft}
                onDrop={handleDrop('draft')}
                onClick={() => draftRef.current?.click()}
                onClear={() => { setDraft(null); setDone(false) }}
                accent="#1ABCB0"
              />
              <input ref={draftRef} type="file" accept=".pdf" className="hidden" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && setSlot('draft', e.target.files[0])} />
            </div>

            {/* Order note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: '#fafaf8', border: '1px solid hsl(36 16% 87%)', borderRadius: 6 }}>
              <span style={{ fontSize: 11, color: 'hsl(218 19% 35%)', fontFamily: "'Inter',sans-serif" }}>
                📋 Final PDF order: <strong>e-Stamp page(s) first</strong>, then the agreement. Signatures auto-stamped on agreement pages only.
              </span>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 12, color: '#dc2626', fontFamily: "'Inter',sans-serif" }}>
                ⚠ {error}
              </div>
            )}

            {/* Process button */}
            {eStamp && draft && !done && (
              <Button
                variant="primary" size="md"
                onClick={process}
                loading={processing}
                style={{ alignSelf: 'flex-start', minWidth: 200, justifyContent: 'center', fontSize: 13 }}
              >
                <Merge size={14} strokeWidth={1.75} />
                {processing ? 'Processing…' : 'Merge + Sign PDF'}
              </Button>
            )}

            {/* Log */}
            {log.length > 0 && (
              <div style={{ background: '#fafaf8', border: '1px solid hsl(36 16% 87%)', borderRadius: 6, padding: '10px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'hsl(218 19% 35%)', lineHeight: 1.8 }}>
                {log.map((l, i) => <div key={i}>{l}</div>)}
              </div>
            )}

            {/* Success */}
            {done && resultUrl && (
              <div style={{ padding: '16px', background: 'hsl(174 67% 94%)', border: '1px solid hsl(174 56% 78%)', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <CheckCircle2 size={14} color="hsl(174 82% 33%)" strokeWidth={2} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'hsl(174 82% 33%)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Ready — {pageCount} pages total
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'hsl(218 19% 35%)', fontFamily: "'Inter',sans-serif", marginBottom: 12, lineHeight: 1.6 }}>
                  ✓ e-Stamp + Agreement merged<br />
                  ✓ Pranav stamped on e-Stamp pages only<br />
                </div>
                <Button variant="primary" size="md" onClick={download} style={{ justifyContent: 'center', width: '100%', fontSize: 13 }}>
                  <Download size={14} strokeWidth={1.75} /> Download Signed PDF
                </Button>
              </div>
            )}
          </div>

          {/* Right: Settings */}
          <div style={{ background: '#fff', border: '1px solid hsl(36 16% 87%)', borderRadius: 8, padding: 16, height: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'hsl(174 76% 42%)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid hsl(42 15% 94%)' }}>
              Stamp Settings
            </p>

            {/* Position */}
            <p style={{ fontSize: 11, fontWeight: 600, color: 'hsl(218 19% 35%)', fontFamily: "'Inter',sans-serif", marginBottom: 6 }}>Bottom position</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
              {(['left', 'center', 'right'] as Position[]).map(p => (
                <button key={p} onClick={() => setPosition(p)} style={{
                  padding: '6px 10px', fontSize: 11, fontWeight: 600, borderRadius: 4, border: `1px solid ${position === p ? 'hsl(174 76% 42%)' : 'hsl(36 16% 87%)'}`,
                  background: position === p ? 'hsl(174 76% 42%)' : '#fff',
                  color: position === p ? '#fff' : 'hsl(218 19% 35%)',
                  cursor: 'pointer', textAlign: 'left', fontFamily: "'Inter',sans-serif",
                }}>
                  {p === 'left' ? '← Left' : p === 'right' ? '→ Right' : '· Center'}
                </button>
              ))}
            </div>

            {/* Size */}
            <p style={{ fontSize: 11, fontWeight: 600, color: 'hsl(218 19% 35%)', fontFamily: "'Inter',sans-serif", marginBottom: 4 }}>
              Size <span style={{ color: 'hsl(174 76% 42%)', fontFamily: "'JetBrains Mono',monospace' " }}>{sigSize}pt</span>
            </p>
            <input type="range" min={40} max={120} value={sigSize} onChange={e => setSigSize(+e.target.value)}
              style={{ width: '100%', accentColor: 'hsl(174 76% 42%)', marginBottom: 14 }} />

            {/* Margin */}
            <p style={{ fontSize: 11, fontWeight: 600, color: 'hsl(218 19% 35%)', fontFamily: "'Inter',sans-serif", marginBottom: 4 }}>
              Margin <span style={{ color: 'hsl(174 76% 42%)', fontFamily: "'JetBrains Mono',monospace' " }}>{margin}pt</span>
            </p>
            <input type="range" min={10} max={50} value={margin} onChange={e => setMargin(+e.target.value)}
              style={{ width: '100%', accentColor: 'hsl(174 76% 42%)', marginBottom: 14 }} />

            {/* Sig legend */}
            <div style={{ borderTop: '1px solid hsl(42 15% 94%)', paddingTop: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'hsl(174 76% 42%)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Signatures</p>
              {[
                { name: 'Kanchan Bhatia', key: 'kanchan', note: 'NOC page only' },
                { name: 'Pranav Bhatia',  key: 'pranav',  note: 'Every agr. page (except witness) + NOC' },
                { name: 'Pratik Dey',     key: 'pratik',  note: 'Witness page only' },
                { name: 'Surabhi Dewra',  key: 'surabhi', note: 'Witness page only' },
              ].map(s => (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <img src={`data:image/png;base64,${SIGNATURES[s.key as keyof typeof SIGNATURES]}`} alt={s.name}
                    style={{ width: 52, height: 24, objectFit: 'contain', background: 'hsl(42 15% 94%)', borderRadius: 3, border: '1px solid hsl(36 16% 87%)', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'hsl(0 0% 7%)', fontFamily: "'Inter',sans-serif", lineHeight: 1.2 }}>{s.name}</p>
                    <p style={{ fontSize: 9, color: 'hsl(217 14% 61%)', fontFamily: "'Inter',sans-serif" }}>{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── DROP ZONE COMPONENT ──────────────────────────────────────────
function DropZone({ label, sublabel, file, onDrop, onClick, onClear, accent }: {
  label: string; sublabel: string; file: FileSlot
  onDrop: (e: React.DragEvent) => void; onClick: () => void; onClear: () => void; accent: string
}) {
  return (
    <div
      onDrop={onDrop} onDragOver={e => e.preventDefault()} onClick={file ? undefined : onClick}
      style={{
        border: `2px dashed ${file ? accent : 'hsl(36 16% 87%)'}`,
        borderRadius: 10, padding: '20px 16px', textAlign: 'center',
        cursor: file ? 'default' : 'pointer', background: file ? `${accent}10` : '#fafaf8',
        transition: 'all 150ms ease', position: 'relative',
      }}
      onMouseEnter={e => { if (!file) (e.currentTarget as HTMLElement).style.borderColor = accent }}
      onMouseLeave={e => { if (!file) (e.currentTarget as HTMLElement).style.borderColor = 'hsl(36 16% 87%)' }}
    >
      {file ? (
        <>
          <button onClick={e => { e.stopPropagation(); onClear() }}
            style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: '#f0eeea', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(217 14% 61%)' }}>
            <X size={10} />
          </button>
          <FileText size={22} style={{ color: accent, margin: '0 auto 6px' }} strokeWidth={1.5} />
          <p style={{ fontSize: 11, fontWeight: 700, color: 'hsl(0 0% 7%)', fontFamily: "'Inter',sans-serif", wordBreak: 'break-all', lineHeight: 1.3 }}>
            {file.name.length > 28 ? file.name.slice(0, 28) + '…' : file.name}
          </p>
          <p style={{ fontSize: 10, color: 'hsl(217 14% 61%)', fontFamily: "'Inter',sans-serif", marginTop: 2 }}>
            {(file.file.size / 1024).toFixed(0)} KB
          </p>
        </>
      ) : (
        <>
          <Upload size={22} style={{ color: 'hsl(217 14% 61%)', margin: '0 auto 8px' }} strokeWidth={1.5} />
          <p style={{ fontSize: 12, fontWeight: 700, color: 'hsl(0 0% 7%)', fontFamily: "'Inter',sans-serif", marginBottom: 2 }}>{label}</p>
          <p style={{ fontSize: 10, color: 'hsl(217 14% 61%)', fontFamily: "'Inter',sans-serif" }}>{sublabel} · Drop or click</p>
        </>
      )}
    </div>
  )
}
