'use client'
import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui'
import { Upload, Download, FileText, CheckCircle, Settings } from 'lucide-react'
import { SIGNATURES } from '@/lib/signatures'

type Position = 'left' | 'right' | 'center'

export default function SignatureTool() {
  const [file, setFile]           = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [done, setDone]           = useState(false)
  const [position, setPosition]   = useState<Position>('right')
  const [sigSize, setSigSize]     = useState(70)
  const [margin, setMargin]       = useState(28)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultName, setResultName] = useState('')
  const [error, setError]         = useState<string | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [log, setLog]             = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const addLog = (msg: string) => setLog(prev => [...prev, msg])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  function handleFile(f: File) {
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['pdf'].includes(ext || '')) {
      setError('Please upload a PDF file. For DOCX, export it as PDF first from Google Docs (File → Download → PDF).')
      return
    }
    setFile(f); setDone(false); setResultUrl(null); setError(null); setLog([])
  }

  async function stampSignatures() {
    if (!file) return
    setProcessing(true); setError(null); setLog([])
    try {
      await stampPDF()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setProcessing(false)
    }
  }

  async function stampPDF() {
    addLog('Loading pdf-lib…')
    const { PDFDocument } = await loadPdfLib()

    addLog('Reading PDF…')
    const arrayBuffer = await file!.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pages = pdfDoc.getPages()
    const total = pages.length
    setPageCount(total)
    addLog(`PDF has ${total} pages`)

    // Embed signatures
    addLog('Embedding signatures…')
    const pranavImg  = await pdfDoc.embedPng(base64ToBytes(SIGNATURES.pranav))
    const kanchanImg = await pdfDoc.embedPng(base64ToBytes(SIGNATURES.kanchan))
    const pratikImg  = await pdfDoc.embedPng(base64ToBytes(SIGNATURES.pratik))

    const sigW = sigSize
    const gap  = 6
    const totalPairW = sigW * 2 + gap

    // ── EVERY PAGE EXCEPT LAST: Kanchan + Pranav side by side at bottom ──
    // Skip last page (NOC) — no stamps there
    addLog('Stamping Kanchan + Pranav on every page except last (NOC)…')
    for (let i = 0; i < total - 1; i++) {
      const page = pages[i]
      const { width, height } = page.getSize()

      const kDims = kanchanImg.scale(sigW / kanchanImg.width)
      const pDims = pranavImg.scale(sigW / pranavImg.width)

      let startX: number
      if (position === 'left')       startX = margin
      else if (position === 'right') startX = width - margin - totalPairW
      else                           startX = (width - totalPairW) / 2

      const bottomY = margin

      // Kanchan left, Pranav right — side by side
      page.drawImage(kanchanImg, {
        x: startX,
        y: bottomY,
        width: kDims.width,
        height: kDims.height,
        opacity: 0.92,
      })
      page.drawImage(pranavImg, {
        x: startX + sigW + gap,
        y: bottomY,
        width: pDims.width,
        height: pDims.height,
        opacity: 0.92,
      })
    }

    // ── 2ND LAST PAGE (page index = total - 2): Witness signatures ──
    // Pratik Dey (Witness 1) and Surabhi Dewra (Witness 2)
    // Placed on top of the signature lines in the witnesses block
    if (total >= 2) {
      addLog(`Stamping witness signatures on page ${total - 1} (2nd last)…`)
      const witnessPage = pages[total - 2]
      const { width: ww, height: wh } = witnessPage.getSize()

      const witnessW = sigW * 1.2
      const surabhiImg = await pdfDoc.embedPng(base64ToBytes(SIGNATURES.surabhi))

      // From screenshot analysis:
      // Witness 1 (Pratik) signature line is ~72% from bottom of page
      // Witness 2 (Surabhi) signature line is ~57% from bottom of page
      // Signatures sit ON the line (slightly above it)

      // Witness 1 — Pratik Dey
      // Sits above signature line, which is just below "Witness 1:" label
      const pDims2 = pratikImg.scale(witnessW / pratikImg.width)
      const w1Y = wh * 0.85 - pDims2.height  // just above the line at 85%
      witnessPage.drawImage(pratikImg, {
        x: ww * 0.25,
        y: w1Y,
        width: pDims2.width,
        height: pDims2.height,
        opacity: 0.92,
      })

      // Witness 2 — Surabhi Dewra
      // Sits above signature line, which is just below "Witness 2:" label
      const sDims = surabhiImg.scale(witnessW / surabhiImg.width)
      const w2Y = wh * 0.73 - sDims.height  // just above the line at 73%
      witnessPage.drawImage(surabhiImg, {
        x: ww * 0.25,
        y: w2Y,
        width: sDims.width,
        height: sDims.height,
        opacity: 0.92,
      })
    }

    // ── LAST PAGE (NOC): Kanchan + Pranav on their signature lines ──
    addLog('Stamping Kanchan + Pranav on NOC page signature lines…')
    const nocPage = pages[total - 1]
    const { width: nw, height: nh } = nocPage.getSize()

    const nocSigW = sigW * 1.1

    // Kanchan Bhatia — sits on her signature line (~45% from bottom)
    const kDimsNoc = kanchanImg.scale(nocSigW / kanchanImg.width)
    const kNocY = nh * 0.60 - kDimsNoc.height  // just above her line
    nocPage.drawImage(kanchanImg, {
      x: nw * 0.25,
      y: kNocY,
      width: kDimsNoc.width,
      height: kDimsNoc.height,
      opacity: 0.92,
    })

    // Pranav Bhatia — sits on his signature line (~36% from bottom)
    const pDimsNoc = pranavImg.scale(nocSigW / pranavImg.width)
    const pNocY = nh * 0.51 - pDimsNoc.height  // just above his line
    nocPage.drawImage(pranavImg, {
      x: nw * 0.25,
      y: pNocY,
      width: pDimsNoc.width,
      height: pDimsNoc.height,
      opacity: 0.92,
    })

    // Save
    addLog('Saving signed PDF…')
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url  = URL.createObjectURL(blob)
    const name = file!.name.replace('.pdf', '_signed.pdf')

    setResultUrl(url); setResultName(name)
    setDone(true); setProcessing(false)
    addLog('✅ Done!')
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

  function downloadResult() {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl; a.download = resultName; a.click()
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0a0a0a]">Signature Stamper</h1>
        <p className="text-sm text-[#8e9aab] mt-0.5">Upload a signed agreement PDF — auto-stamps all signatures in the correct positions</p>
      </div>



      <div className="grid grid-cols-[1fr_260px] gap-6">

        {/* Left */}
        <div className="flex flex-col gap-4">

          {/* Drop zone */}
          <div
            onDrop={onDrop} onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all ${
              file ? 'border-[#1ABCB0] bg-[#e6faf9]' : 'border-[#e0e4e8] bg-white hover:border-[#1ABCB0]'
            }`}
          >
            <input ref={inputRef} type="file" accept=".pdf" className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {file ? (
              <>
                <FileText size={28} className="text-[#1ABCB0] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#0a0a0a]">{file.name}</p>
                <p className="text-xs text-[#8e9aab] mt-1">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
              </>
            ) : (
              <>
                <Upload size={28} className="text-[#8e9aab] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#0a0a0a]">Drop PDF here or click to browse</p>
                <p className="text-xs text-[#8e9aab] mt-1">PDF only · For DOCX export as PDF first</p>
              </>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-600">⚠ {error}</div>
          )}

          {file && !done && (
            <Button onClick={stampSignatures} loading={processing} className="w-full justify-center">
              {processing ? 'Stamping…' : '✍ Stamp All Signatures'}
            </Button>
          )}

          {/* Log */}
          {log.length > 0 && (
            <div className="bg-[#f4f6f8] rounded p-3 font-mono text-[10px] text-[#4a5568] space-y-0.5">
              {log.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          )}

          {/* Success */}
          {done && resultUrl && (
            <div className="bg-[#e6faf9] border border-[#1ABCB0] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={15} className="text-[#1ABCB0]" />
                <p className="text-sm font-bold text-[#0a0a0a]">Signed — {pageCount} pages</p>
              </div>
              <div className="text-xs text-[#4a5568] mb-3 space-y-0.5">
                <p>✓ Kanchan Bhatia + Pranav Bhatia — every page (bottom {position})</p>
                <p>✓ Pratik Dey (Witness 1) — page {pageCount - 1} (2nd last)</p>
                <p>✓ Surabhi Dewra (Witness 2) — page {pageCount - 1} (2nd last)</p>
              </div>
              <Button onClick={downloadResult} className="w-full justify-center">
                <Download size={13} /> Download Signed PDF
              </Button>
            </div>
          )}
        </div>

        {/* Right: Settings */}
        <div className="bg-white border border-[#e0e4e8] rounded-lg p-4 h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#f4f6f8]">
            <Settings size={13} className="text-[#1ABCB0]" />
            <p className="text-xs font-bold uppercase tracking-wide text-[#0a0a0a]">Settings</p>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-[#4a5568] mb-2">Bottom stamp position</p>
            {(['left', 'center', 'right'] as Position[]).map(p => (
              <button key={p} onClick={() => setPosition(p)}
                className={`w-full mb-1 px-3 py-1.5 text-xs font-semibold rounded border text-left transition-all cursor-pointer ${
                  position === p ? 'bg-[#1ABCB0] border-[#1ABCB0] text-white' : 'bg-white border-[#e0e4e8] text-[#4a5568] hover:border-[#1ABCB0]'
                }`}>
                {p === 'left' ? '← Bottom Left' : p === 'right' ? '→ Bottom Right' : '· Bottom Center'}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-[#4a5568] mb-1">
              Size <span className="text-[#1ABCB0] font-bold">{sigSize}pt</span>
            </p>
            <input type="range" min={40} max={120} value={sigSize}
              onChange={e => setSigSize(Number(e.target.value))}
              className="w-full accent-[#1ABCB0]" />
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-[#4a5568] mb-1">
              Margin <span className="text-[#1ABCB0] font-bold">{margin}pt</span>
            </p>
            <input type="range" min={10} max={50} value={margin}
              onChange={e => setMargin(Number(e.target.value))}
              className="w-full accent-[#1ABCB0]" />
          </div>

          {/* Where each sig goes */}
          <div className="border-t border-[#f4f6f8] pt-3">
            <p className="text-xs font-semibold text-[#4a5568] mb-2">Placement</p>
            <div className="space-y-2 text-[10px]">
              {[
                { label: 'Kanchan Bhatia',  placement: 'Every page — bottom', key: 'kanchan', ok: true },
                { label: 'Pranav Bhatia',   placement: 'Every page — bottom', key: 'pranav', ok: true },
                { label: 'Pratik Dey',      placement: '2nd last page only', key: 'pratik', ok: true },
                { label: 'Surabhi Dewra',   placement: '2nd last page only', key: 'surabhi', ok: true },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  {s.ok && s.key ? (
                    <img
                      src={`data:image/png;base64,${SIGNATURES[s.key as keyof typeof SIGNATURES]}`}
                      alt={s.label}
                      className="h-6 w-14 object-contain bg-[#f4f6f8] rounded border border-[#e0e4e8]"
                    />
                  ) : (
                    <div className="h-6 w-14 bg-amber-50 border border-amber-200 rounded flex items-center justify-center">
                      <span className="text-[8px] text-amber-500">Missing</span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-[#0a0a0a]">{s.label}</p>
                    <p className="text-[#8e9aab]">{s.placement}</p>
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
