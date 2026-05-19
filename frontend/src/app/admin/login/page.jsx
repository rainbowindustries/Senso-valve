'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconSettings2, IconEye, IconEyeOff, IconLock } from '@tabler/icons-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        }
      )
      const data = await res.json()

      if (data.success) {
        // Save token to localStorage
        localStorage.setItem('adminToken', data.data.token)
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
            <IconSettings2 size={20} color="#60a5fa" />
          </div>
          <div>
            <div className="text-[16px] font-medium text-white">
              Hammer Valve
            </div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">
              Admin panel
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <IconLock size={22} className="text-blue-400" />
            </div>
            <h1 className="text-[22px] font-medium text-white mb-1">
              Welcome back
            </h1>
            <p className="text-[13px] text-slate-500">
              Sign in to access admin panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="text-[12px] text-slate-400 font-medium mb-1.5 block">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="admin@hammervalve.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[12px] text-slate-400 font-medium mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword
                    ? <IconEyeOff size={16} />
                    : <IconEye size={16} />
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-[13px] text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white text-[14px] font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

          </form>
        </div>

        {/* Back to website */}
        <div className="text-center mt-6">
          <a  
            href="/"
            className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors"
          >
            ← Back to website
          </a>
        </div>

      </div>
    </div>
  )
}