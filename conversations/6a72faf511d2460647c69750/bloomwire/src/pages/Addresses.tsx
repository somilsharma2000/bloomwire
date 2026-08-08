import { useState } from 'react'
import { useAuth, type Address } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { PinIcon, PhoneIcon, CheckCircleIcon, PlusIcon } from '../components/Icons'

const LABELS = ['Home', 'Work', 'Other']

export default function Addresses() {
  const user = useAuth((s) => s.user)
  const addAddress = useAuth((s) => s.addAddress)
  const updateAddress = useAuth((s) => s.updateAddress)
  const removeAddress = useAuth((s) => s.removeAddress)
  const setDefaultAddress = useAuth((s) => s.setDefaultAddress)
  const showToast = useToastStore((s) => s.showToast)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Address, 'id'>>({ label: 'Home', name: '', phone: '', line1: '', city: '', state: '', pincode: '' })

  if (!user) return null

  const addresses = user.addresses || []

  const resetForm = () => {
    setForm({ label: 'Home', name: '', phone: '', line1: '', city: '', state: '', pincode: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.line1.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      showToast('Please fill all fields', 'error')
      return
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      showToast('Phone must be 10 digits', 'error')
      return
    }
    if (form.pincode.replace(/\D/g, '').length < 6) {
      showToast('Pincode must be 6 digits', 'error')
      return
    }

    if (editingId) {
      updateAddress(editingId, form)
      showToast('Address updated ✅', 'success')
    } else {
      addAddress(form)
      showToast('Address saved ✅', 'success')
    }
    resetForm()
  }

  const handleEdit = (addr: Address) => {
    setForm({ label: addr.label, name: addr.name, phone: addr.phone, line1: addr.line1, city: addr.city, state: addr.state, pincode: addr.pincode })
    setEditingId(addr.id)
    setShowForm(true)
  }

  const handleRemove = (id: string) => {
    removeAddress(id)
    showToast('Address removed', 'info')
  }

  const inputClass = "px-4 py-2.5 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition w-full"

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <PinIcon size={28} className="text-bloom-neon" />
          <h1 className="text-3xl sm:text-4xl font-serif font-bold">Saved Addresses</h1>
        </div>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="px-5 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full text-sm font-medium shimmer-btn hover:scale-105 transition flex items-center gap-2"
          >
            <PlusIcon size={16} /> Add New Address
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 mb-6 border border-bloom-rose/30 animate-fade-up">
          <h3 className="text-lg font-serif font-bold mb-4">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className={inputClass}
            >
              {LABELS.map(l => <option key={l} value={l} className="bg-[#FFF8F3]">{l}</option>)}
            </select>
            <input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            <input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} className={inputClass} />
            <input placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} className={inputClass} />
            <input placeholder="Address Line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className={`${inputClass} sm:col-span-2`} />
            <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
            <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputClass} />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full text-sm font-medium shimmer-btn hover:scale-105 transition">
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
            <button type="button" onClick={resetForm} className="px-5 py-2.5 glass text-[#8a7a6a] rounded-full text-sm font-medium hover:bg-white/70 transition">Cancel</button>
          </div>
        </form>
      )}

      {/* Address Cards */}
      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-bloom-rose/10 flex items-center justify-center mx-auto mb-6">
            <PinIcon size={40} className="text-bloom-neon" />
          </div>
          <h2 className="text-xl font-serif font-bold mb-2">No Saved Addresses</h2>
          <p className="text-[#8a7a6a] mb-6">Add an address for faster checkout next time.</p>
          <button onClick={() => { resetForm(); setShowForm(true) }} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn hover:scale-105 transition">
            <PlusIcon size={16} /> Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="glass-strong rounded-2xl p-5 border border-[#2d2418]/10 hover:border-bloom-rose/40 transition">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 glass text-xs font-medium text-bloom-neon rounded-full">{addr.label}</span>
                  {addr.isDefault && <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20 flex items-center gap-1"><CheckCircleIcon size={10} /> Default</span>}
                </div>
              </div>
              <p className="font-medium text-[#2d2418] mb-1">{addr.name}</p>
              <p className="text-sm text-[#8a7a6a] leading-relaxed">{addr.line1}</p>
              <p className="text-sm text-[#8a7a6a]">{addr.city}, {addr.state} — {addr.pincode}</p>
              <p className="text-sm text-[#a0918a] mt-1 flex items-center gap-1.5"><PhoneIcon size={12} /> {addr.phone}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <button onClick={() => handleEdit(addr)} className="px-3 py-1.5 glass rounded-full text-xs font-medium text-[#6b5d4f] hover:bg-white/70 transition">Edit</button>
                {!addr.isDefault && <button onClick={() => setDefaultAddress(addr.id)} className="px-3 py-1.5 glass rounded-full text-xs font-medium text-bloom-neon hover:bg-white/70 transition">Set Default</button>}
                <button onClick={() => handleRemove(addr.id)} className="px-3 py-1.5 glass rounded-full text-xs font-medium text-red-400 hover:bg-red-500/10 transition border border-red-500/20">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
