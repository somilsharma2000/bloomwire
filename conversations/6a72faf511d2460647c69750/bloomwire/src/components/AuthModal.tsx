import { useState } from 'react'
import { useAuth } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { UserIcon, MailIcon, LockIcon, GiftIcon, PhoneIcon } from './Icons'

function CloseIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

interface Props { open: boolean; onClose: () => void }

export default function AuthModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [loading, setLoading] = useState(false)

  const signIn = useAuth((s) => s.signIn)
  const showToast = useToastStore((s) => s.showToast)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && (mode === 'signin' || name)) {
      setLoading(true)
      const cleanPhone = phone.trim() || undefined
      signIn(email, name || email.split('@')[0], mode === 'signup' ? referralCode.trim() : undefined, cleanPhone)
      showToast(mode === 'signup' ? 'Account created! Welcome to Bloomwire 🌸' : 'Welcome back! 👋', 'auth')
      onClose()
      setEmail(''); setName(''); setPhone(''); setPassword(''); setReferralCode('')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-3xl p-8 w-full max-w-md animate-scale-in text-[#2d2418]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#a0918a] hover:text-[#2d2418] transition" aria-label="Close"><CloseIcon /></button>
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-bloom-rose to-bloom-wine items-center justify-center mb-4 neon-glow">
            <UserIcon className="text-[#2d2418]" size={28} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#2d2418]">{mode === 'signup' ? 'Join Bloomwire' : 'Welcome Back'}</h2>
          <p className="text-sm text-[#a0918a] mt-2">{mode === 'signup' ? 'Sign up & get 50 bonus Petals' : 'Sign in to your account'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0918a]" size={18} />
              <input required placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition" />
            </div>
          )}
          <div className="relative">
            <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0918a]" size={18} />
            <input required type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition" />
          </div>
          {mode === 'signup' && (
            <div className="relative">
              <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0918a]" size={18} />
              <input type="tel" placeholder="Phone Number (Optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition" />
            </div>
          )}
          <div className="relative">
            <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0918a]" size={18} />
            <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition" />
          </div>
          {mode === 'signup' && (
            <div className="relative">
              <GiftIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0918a]" size={18} />
              <input type="text" placeholder="Referral Code (Optional)" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition uppercase" />
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl font-medium shimmer-btn neon-glow hover:scale-[1.02] transition disabled:opacity-50">
            {loading ? (mode === 'signup' ? 'Creating account...' : 'Signing in...') : (mode === 'signup' ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        <p className="text-center text-sm text-[#a0918a] mt-6">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')} className="text-bloom-neon hover:underline font-medium">
            {mode === 'signup' ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
