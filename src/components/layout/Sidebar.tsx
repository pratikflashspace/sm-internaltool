'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { FileText, Users, LayoutDashboard, Wrench, ChevronLeft, ChevronRight } from 'lucide-react'

const nav = [
  { href: '/agreements/new', label: 'New Agreement', icon: FileText },
  { href: '/agreements', label: 'All Agreements', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/tools', label: 'Tools', icon: Wrench },
]

export function Sidebar() {
  const path = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'shrink-0 bg-[#0a0a0a] flex flex-col min-h-screen transition-all duration-200 relative',
      collapsed ? 'w-[52px]' : 'w-[200px]'
    )}>
      {/* Logo */}
      <div className="px-3 py-3.5 border-b border-white/10 flex items-center gap-2.5 overflow-hidden">
        <div className="w-7 h-7 bg-[#1ABCB0] rounded flex items-center justify-center text-white text-[11px] font-bold shrink-0">
          SM
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white text-[11px] font-bold leading-tight whitespace-nowrap">Stirring Minds</p>
            <p className="text-[#4a5568] text-[9px] uppercase tracking-widest whitespace-nowrap">Ops Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-1.5 py-2 flex flex-col gap-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/agreements' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-all overflow-hidden',
                active ? 'bg-[#1ABCB0] text-white' : 'text-[#8e9aab] hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon size={14} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="mx-auto mb-3 w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8e9aab] hover:text-white transition-all cursor-pointer"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {!collapsed && (
        <div className="px-3 py-2.5 border-t border-white/10">
          <p className="text-[9px] text-[#4a5568] uppercase tracking-widest">Internal Only</p>
        </div>
      )}
    </aside>
  )
}
