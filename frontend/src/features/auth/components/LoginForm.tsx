import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { AppRole } from '../types/auth'

export const LoginForm: React.FC = () => {
  const { login, setDemoUser } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setLocalError('Please enter your email address.')
      return
    }

    if (!password) {
      setLocalError('Please enter your password.')
      return
    }

    try {
      setIsSubmitting(true)
      await login(trimmedEmail, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setLocalError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please check your credentials.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickDemoLogin = (role: AppRole) => {
    setDemoUser(role)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl"
      >
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-xl shadow-md mb-3">
            TR
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign In to TrialReady LK
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Driving School Management Platform for Sri Lanka
          </p>
        </div>

        {localError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
            <span className="font-bold text-red-600">✕</span>
            <span>{localError}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@drivingschool.lk"
              autoComplete="email"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing In...
              </>
            ) : (
              'Sign In with Supabase'
            )}
          </button>
        </div>

        {/* Quick Demo Access Buttons for Development */}
        <div className="mt-8 border-t border-slate-100 pt-5 text-center">
          <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase mb-3">
            Quick Demo Access (No Auth Required)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('administrator')}
              className="rounded-lg border border-blue-200 bg-blue-50/70 px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('instructor')}
              className="rounded-lg border border-emerald-200 bg-emerald-50/70 px-2 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer"
            >
              👨‍🏫 Instructor
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('student')}
              className="rounded-lg border border-purple-200 bg-purple-50/70 px-2 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-all cursor-pointer"
            >
              👨‍🎓 Student
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
