// Shared admin components — used by all admin panel sections

import { useState, useEffect } from 'react'

// ─── Stat Card ───
export function StatCard({ label, value, icon, color = 'text-[#2d2418]', subtitle }: { label: string; value: any; icon: string; color?: string; subtitle?: string }) {
  return (
    <div className="glass-strong rounded-xl p-4 border border-[#2d2418]/5 hover:border-[#2d2418]/10 transition-all">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[#a0918a] uppercase tracking-wider">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {subtitle && <p className="text-[10px] text-[#8a7a6a] mt-1">{subtitle}</p>}
    </div>
  )
}

// ─── Badge ───
export function Badge({ status, colors }: { status: string; colors: Record<string, string> }) {
  const cls = colors[status] || 'text-[#8a7a6a] bg-gray-400/10 border-gray-400/30'
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${cls} whitespace-nowrap`}>{status}</span>
}

// ─── Search Bar ───
export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 glass rounded-xl text-sm text-[#2d2418] placeholder-gray-600 glow-focus transition w-full sm:w-64" />
  )
}

// ─── Section Header ───
export function SectionHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div>
        <h2 className="text-xl font-serif font-bold">{title}</h2>
        {subtitle && <p className="text-xs text-[#a0918a] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">{children}</div>
    </div>
  )
}

// ─── Empty State ───
export function EmptyState({ text, action }: { text: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-12">
      <p className="text-[#a0918a] text-sm mb-4">{text}</p>
      {action}
    </div>
  )
}

// ─── Loading Spinner ───
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-bloom-rose/30 border-t-bloom-rose rounded-full animate-spin" />
    </div>
  )
}

// ─── Confirm Dialog ───
export function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'Confirm', danger }: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; confirmText?: string; danger?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative glass-strong rounded-2xl p-6 max-w-sm w-full border border-[#2d2418]/10">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-[#8a7a6a] mb-5">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 glass rounded-xl text-sm hover:bg-white/60 transition">Cancel</button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${danger ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/30 hover:bg-bloom-rose/30'}`}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}

// ─── Toggle Switch ───
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-[#8a7a6a]">{label}</span>}
      <button onClick={() => onChange(!checked)} className={`relative w-11 h-6 rounded-full transition ${checked ? 'bg-bloom-rose' : 'bg-gray-700'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}

// ─── Form Field ───
export function FormField({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#8a7a6a] mb-1.5">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {children}
      {hint && <p className="text-xs text-[#8a7a6a] mt-1">{hint}</p>}
    </div>
  )
}

// ─── Input ───
export function Input({ value, onChange, placeholder, type = 'text', disabled, max, min }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean; max?: number; min?: number }) {
  return <input type={type} value={value} disabled={disabled} max={max} min={min} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#2d2418] placeholder-gray-600 glow-focus transition disabled:opacity-50" />
}

// ─── Textarea ───
export function Textarea({ value, onChange, placeholder, rows = 3, max }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; max?: number }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} maxLength={max} className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#2d2418] placeholder-gray-600 glow-focus transition resize-none" />
}

// ─── Select ───
export function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#2d2418] glow-focus transition">
      {placeholder && <option value="" className="bg-gray-900">{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>)}
    </select>
  )
}

// ─── Data Fetcher Hook ───
export function useAdminData<T>(fetcher: () => Promise<{ success: boolean; data?: T }>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetcher().then((res: any) => {
      if (!mounted) return
      if (res.success && res.data) setData(res.data)
      else setError(res.error || 'Failed to load')
      setLoading(false)
    })
    return () => { mounted = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, setData }
}

// ─── Bar Chart (simple CSS-based) ───
export function BarChart({ data, labelKey, valueKey, color = 'bg-bloom-rose' }: { data: any[]; labelKey: string; valueKey: string; color?: string }) {
  const maxVal = Math.max(...data.map(d => d[valueKey] || 0), 1)
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-[#8a7a6a] w-32 truncate">{d[labelKey]}</span>
          <div className="flex-1 h-6 bg-black/30 rounded-lg overflow-hidden">
            <div className={`h-full ${color} rounded-lg flex items-center justify-end px-2`} style={{ width: `${((d[valueKey] || 0) / maxVal * 100)}%` }}>
              <span className="text-xs font-bold text-[#2d2418]">{d[valueKey]}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Progress Bar ───
export function ProgressBar({ value, max, color = 'bg-bloom-rose', label, showValue = true }: { value: number; max: number; color?: string; label?: string; showValue?: boolean }) {
  const pct = max > 0 ? (value / max * 100).toFixed(0) : '0'
  return (
    <div>
      {label && <div className="flex justify-between items-center mb-1">
        <span className="text-sm">{label}</span>
        {showValue && <span className="text-xs text-[#a0918a]">{value} ({pct}%)</span>}
      </div>}
      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ─── Admin Table (reusable) ───
export function AdminTable({ columns, rows, keyField, emptyText, onRowClick }: {
  columns: { key: string; label: string; render?: (row: any) => React.ReactNode; width?: string }[]
  rows: any[]
  keyField: string
  emptyText?: string
  onRowClick?: (row: any) => void
}) {
  if (!rows || rows.length === 0) return <EmptyState text={emptyText || 'No data available'} />
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[#a0918a] border-b border-[#2d2418]/10">
            {columns.map(c => <th key={c.key} className="pb-3 pr-4" style={c.width ? { width: c.width } : undefined}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[keyField]} onClick={() => onRowClick?.(row)} className={`border-b border-[#2d2418]/5 hover:bg-white/60 transition ${onRowClick ? 'cursor-pointer' : ''}`}>
              {columns.map(c => <td key={c.key} className="py-3 pr-4">{c.render ? c.render(row) : <span className="text-xs">{row[c.key] || '—'}</span>}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Status Colors (shared) ───
export const STATUS_COLORS: Record<string, Record<string, string>> = {
  orders: {
    'Processing': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    'Confirmed': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    'Packed': 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    'Shipped': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    'Out for Delivery': 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    'Delivered': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    'Cancelled': 'text-red-400 bg-red-400/10 border-red-400/30',
    'Returned': 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  },
  submissions: {
    'pending': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    'approved': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    'rejected': 'text-red-400 bg-red-400/10 border-red-400/30',
  },
  users: {
    'active': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    'suspended': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    'banned': 'text-red-400 bg-red-400/10 border-red-400/30',
  },
  coupons: {
    'active': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    'inactive': 'text-[#8a7a6a] bg-gray-400/10 border-gray-400/30',
    'expired': 'text-red-400 bg-red-400/10 border-red-400/30',
  },
}
