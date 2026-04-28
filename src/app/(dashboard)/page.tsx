import Link from 'next/link'
import { FileText, Users, Plus } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0a0a0a]">Operations Dashboard</h1>
        <p className="text-sm text-[#8e9aab] mt-1">Stirring Minds internal tools</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/agreements/new" className="group bg-white border border-[#e0e4e8] rounded-lg p-5 hover:border-[#1ABCB0] hover:shadow-sm transition-all">
          <div className="w-10 h-10 bg-[#e6faf9] rounded-lg flex items-center justify-center mb-3">
            <Plus size={18} className="text-[#1ABCB0]" />
          </div>
          <p className="text-sm font-bold text-[#0a0a0a] group-hover:text-[#1ABCB0] transition-colors">New Agreement</p>
          <p className="text-xs text-[#8e9aab] mt-0.5">Generate a Leave & License Agreement</p>
        </Link>

        <Link href="/agreements" className="group bg-white border border-[#e0e4e8] rounded-lg p-5 hover:border-[#1ABCB0] hover:shadow-sm transition-all">
          <div className="w-10 h-10 bg-[#e6faf9] rounded-lg flex items-center justify-center mb-3">
            <FileText size={18} className="text-[#1ABCB0]" />
          </div>
          <p className="text-sm font-bold text-[#0a0a0a] group-hover:text-[#1ABCB0] transition-colors">Agreements</p>
          <p className="text-xs text-[#8e9aab] mt-0.5">View all generated agreements</p>
        </Link>

        <Link href="/clients" className="group bg-white border border-[#e0e4e8] rounded-lg p-5 hover:border-[#1ABCB0] hover:shadow-sm transition-all">
          <div className="w-10 h-10 bg-[#e6faf9] rounded-lg flex items-center justify-center mb-3">
            <Users size={18} className="text-[#1ABCB0]" />
          </div>
          <p className="text-sm font-bold text-[#0a0a0a] group-hover:text-[#1ABCB0] transition-colors">Clients</p>
          <p className="text-xs text-[#8e9aab] mt-0.5">Manage client records</p>
        </Link>
      </div>
    </div>
  )
}
