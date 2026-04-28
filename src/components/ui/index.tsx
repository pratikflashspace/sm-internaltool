'use client'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

// ── BUTTON ────────────────────────────────────────────────────

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({ variant = 'primary', size = 'md', loading, children, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded transition-all duration-150 cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          // variants
          'bg-[#1ABCB0] text-white hover:bg-[#0f9c92] active:scale-[0.98]': variant === 'primary',
          'bg-white text-[#4a5568] border border-[#e0e4e8] hover:bg-[#f4f6f8] active:scale-[0.98]': variant === 'secondary',
          'text-[#4a5568] hover:bg-[#f4f6f8] active:scale-[0.98]': variant === 'ghost',
          'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]': variant === 'danger',
          // sizes
          'text-xs px-3 py-1.5': size === 'sm',
          'text-sm px-4 py-2': size === 'md',
          'text-sm px-5 py-2.5': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  )
}

// ── INPUT ─────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  hint?: string
  prefix?: string
  error?: string
}

export function Input({ label, required, hint, prefix, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-[#4a5568] flex gap-1">
          {label}
          {required && <span className="text-[#1ABCB0]">*</span>}
          {hint && <span className="font-normal text-[#8e9aab]">— {hint}</span>}
        </label>
      )}
      {prefix ? (
        <div className="flex items-center border border-[#e0e4e8] rounded overflow-hidden focus-within:border-[#1ABCB0] focus-within:ring-2 focus-within:ring-[#1ABCB0]/10">
          <span className="px-2.5 py-2 bg-[#f4f6f8] text-[#4a5568] text-sm font-bold border-r border-[#e0e4e8] shrink-0">
            {prefix}
          </span>
          <input
            className={cn(
              'flex-1 px-3 py-2 text-sm bg-white text-[#0a0a0a] outline-none',
              className
            )}
            {...props}
          />
        </div>
      ) : (
        <input
          className={cn(
            'px-3 py-2 text-sm border border-[#e0e4e8] rounded bg-white text-[#0a0a0a]',
            'outline-none focus:border-[#1ABCB0] focus:ring-2 focus:ring-[#1ABCB0]/10 transition-all',
            error && 'border-red-400',
            className
          )}
          {...props}
        />
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── SELECT ────────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  required?: boolean
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ label, required, error, options, placeholder, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-[#4a5568] flex gap-1">
          {label}
          {required && <span className="text-[#1ABCB0]">*</span>}
        </label>
      )}
      <select
        className={cn(
          'px-3 py-2 text-sm border border-[#e0e4e8] rounded bg-white text-[#0a0a0a]',
          'outline-none focus:border-[#1ABCB0] focus:ring-2 focus:ring-[#1ABCB0]/10 transition-all',
          'appearance-none cursor-pointer',
          error && 'border-red-400',
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238e9aab' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          paddingRight: '30px',
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── TEXTAREA ──────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
  error?: string
}

export function Textarea({ label, required, error, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-[#4a5568] flex gap-1">
          {label}
          {required && <span className="text-[#1ABCB0]">*</span>}
        </label>
      )}
      <textarea
        rows={2}
        className={cn(
          'px-3 py-2 text-sm border border-[#e0e4e8] rounded bg-white text-[#0a0a0a] resize-y',
          'outline-none focus:border-[#1ABCB0] focus:ring-2 focus:ring-[#1ABCB0]/10 transition-all',
          error && 'border-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── RADIO GROUP ───────────────────────────────────────────────

interface RadioGroupProps {
  label?: string
  required?: boolean
  name: string
  value: string
  onChange: (val: string) => void
  options: { value: string; label: string }[]
}

export function RadioGroup({ label, required, name, value, onChange, options }: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-[#4a5568] flex gap-1">
          {label}
          {required && <span className="text-[#1ABCB0]">*</span>}
        </label>
      )}
      <div className="flex gap-2 flex-wrap">
        {options.map(o => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              'px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-150 cursor-pointer',
              value === o.value
                ? 'bg-[#1ABCB0] border-[#1ABCB0] text-white'
                : 'bg-white border-[#e0e4e8] text-[#4a5568] hover:border-[#1ABCB0] hover:text-[#1ABCB0]'
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── CARD ──────────────────────────────────────────────────────

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white border border-[#e0e4e8] rounded-lg shadow-sm', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f4f6f8]">
      {icon && (
        <div className="w-8 h-8 bg-[#e6faf9] rounded-md flex items-center justify-center text-sm">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-bold text-[#0a0a0a]">{title}</p>
        {subtitle && <p className="text-[10px] text-[#8e9aab] uppercase tracking-widest font-medium mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

// ── SECTION LABEL ─────────────────────────────────────────────

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-[#e6faf9] pb-1.5 mb-3">
      <p className="text-[10px] font-bold text-[#1ABCB0] uppercase tracking-widest font-mono">{children}</p>
    </div>
  )
}

// ── BADGE ─────────────────────────────────────────────────────

export function Badge({ children, color = 'teal' }: { children: React.ReactNode; color?: 'teal' | 'gray' | 'green' | 'red' }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide', {
      'bg-[#e6faf9] text-[#1ABCB0]': color === 'teal',
      'bg-[#f4f6f8] text-[#8e9aab]': color === 'gray',
      'bg-green-50 text-green-600': color === 'green',
      'bg-red-50 text-red-500': color === 'red',
    })}>
      {children}
    </span>
  )
}
