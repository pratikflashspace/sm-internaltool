import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function AgreementsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#0a0a0a]">Agreements</h1>
          <p className="text-sm text-[#8e9aab] mt-0.5">All generated agreements</p>
        </div>
        <Link
          href="/agreements/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1ABCB0] text-white text-sm font-semibold rounded hover:bg-[#0f9c92] transition-colors"
        >
          <Plus size={13} /> New Agreement
        </Link>
      </div>

      <div className="bg-white border border-[#e0e4e8] rounded-lg p-12 text-center">
        <p className="text-[#8e9aab] text-sm">Agreement history coming in Phase 2</p>
        <p className="text-[#8e9aab] text-xs mt-1">After Supabase is connected, all agreements will be saved here automatically.</p>
      </div>
    </div>
  )
}
