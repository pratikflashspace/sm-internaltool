import Link from 'next/link'
import { PenLine } from 'lucide-react'

export default function ToolsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0a0a0a]">Tools</h1>
        <p className="text-sm text-[#8e9aab] mt-0.5">Internal utilities</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <Link href="/tools/signature" className="group bg-white border border-[#e0e4e8] rounded-lg p-5 hover:border-[#1ABCB0] hover:shadow-sm transition-all">
          <div className="w-10 h-10 bg-[#e6faf9] rounded-lg flex items-center justify-center mb-3">
            <PenLine size={18} className="text-[#1ABCB0]" />
          </div>
          <p className="text-sm font-bold text-[#0a0a0a] group-hover:text-[#1ABCB0] transition-colors">Signature Stamper</p>
          <p className="text-xs text-[#8e9aab] mt-0.5">Stamp all signatures onto a signed agreement PDF</p>
        </Link>
      </div>
    </div>
  )
}
