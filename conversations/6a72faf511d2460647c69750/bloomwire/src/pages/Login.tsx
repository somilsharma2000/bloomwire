import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { UserIcon, MailIcon, LockIcon, GiftIcon, PhoneIcon } from '../components/Icons'
import { useSEO } from '../hooks/useSEO'

export default function Login() {
  useSEO({
    title: "Bloomwire — Sign In / Sign Up",
    description: "Join Bloomwire to earn Petals, track orders, and unlock exclusive rewards. Sign up and get 50 bonus Petals!",
    canonicalPath: "/#/login"
  })

  const navigate = useNavigate()
  const signIn = useAuth((s) => s.signIn)
  const showToast = useToastStore((s) => s.showToast)

  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  // Read query params for redirect target
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
    const m = params.get('mode')
    if (m === 'signin') setMode('signin')
    const ref = params.get('ref')
    if (ref) setReferralCode(ref)
    const error = params.get('error')
    if (error === 'admin') {
      showToast('Admin access required. Please sign in.', 'error')
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || (mode === 'signup' && !name)) return

    setLoading(true)
    setTimeout(() => {
      signIn(
        email,
        name || email.split('@')[0],
        mode === 'signup' ? referralCode.trim() : undefined,
        mode === 'signup' ? (phone.trim() || undefined) : undefined
      )
      showToast(mode === 'signup' ? 'Account created! Welcome to Bloomwire 🌸' : 'Welcome back! 👋', 'auth')
      setLoading(false)

      // Redirect to previous page or home
      const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
      const redirect = params.get('redirect') || '/'
      navigate(redirect)
    }, 600)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-bloom-rose to-bloom-wine items-center justify-center mb-4 neon-glow">
            <UserIcon className="text-[#2d2418]" size={28} />
          </div>
          <h1 className="text-2xl font-serif font-bold">
            {mode === 'signup' ? 'Join Bloomwire' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-[#a0918a] mt-2">
            {mode === 'signup' ? 'Sign up & get 50 bonus Petals' : 'Sign in to your account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-strong rounded-3xl p-8 border border-[#2d2418]/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-medium text-[#8a7a6a] mb-1.5 block">Full Name</label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0918a]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3 glass rounded-xl text-[#2d2418] placeholder-[#a0918a] glow-focus transition text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-[#8a7a6a] mb-1.5 block">Email Address</label>
              <div className="relative">
                <MailIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0918a]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3 glass rounded-xl text-[#2d2418] placeholder-[#a0918a] glow-focus transition text-sm"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-xs font-medium text-[#8a7a6a] mb-1.5 block">
                  Phone Number <span className="text-[#a0918a]">(optional)</span>
                </label>
                <div className="relative">
                  <PhoneIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0918a]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-11 pr-4 py-3 glass rounded-xl text-[#2d2418] placeholder-[#a0918a] glow-focus transition text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-[#8a7a6a] mb-1.5 block">Password</label>
              <div className="relative">
                <LockIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0918a]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 glass rounded-xl text-[#2d2418] placeholder-[#a0918a] glow-focus transition text-sm"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-xs font-medium text-[#8a7a6a] mb-1.5 block">
                  Referral Code <span className="text-[#a0918a]">(optional)</span>
                </label>
                <div className="relative">
                  <GiftIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0918a]" />
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="BLOOM-XXXX"
                    className="w-full pl-11 pr-4 py-3 glass rounded-xl text-[#2d2418] placeholder-[#a0918a] glow-focus transition text-sm uppercase"
                  />
                </div>
                {referralCode && (
                  <p className="text-xs text-bloom-mint mt-1.5">You'll get 50 bonus Petals when you place your first order! 🌸</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-bloom-rose to-bloom-wine text-white font-medium text-sm hover:scale-[1.02] hover:neon-glow transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                mode === 'signup' ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="text-center mt-6 pt-6 border-t border-[#2d2418]/10">
            <p className="text-sm text-[#8a7a6a]">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                className="text-bloom-neon font-medium hover:underline"
              >
                {mode === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Benefits */}
        {mode === 'signup' && (
          <div className="mt-6 glass rounded-2xl p-5 border border-[#2d2418]/10">
            <p className="text-xs font-medium text-[#8a7a6a] uppercase tracking-wider mb-3">Member Benefits</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-[#6b5d4f]">
                <span className="text-bloom-gold">✦</span> 50 bonus Petals on signup
              </li>
              <li className="flex items-center gap-2 text-sm text-[#6b5d4f]">
                <span className="text-bloom-gold">✦</span> Earn 5% back as Petals on every order
              </li>
              <li className="flex items-center gap-2 text-sm text-[#6b5d4f]">
                <span className="text-bloom-gold">✦</span> Daily check-in rewards & streak bonuses
              </li>
              <li className="flex items-center gap-2 text-sm text-[#6b5d4f]">
                <span className="text-bloom-gold">✦</span> Exclusive early access to new drops
              </li>
            </ul>
          </div>
        )}

        <p className="text-center text-[10px] text-[#a0918a] mt-6">
          By continuing, you agree to Bloomwire's{' '}
          <a href="#/terms" className="text-[#a0918a] hover:text-bloom-neon underline">Terms</a> and{' '}
          <a href="#/privacy" className="text-[#a0918a] hover:text-bloom-neon underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
