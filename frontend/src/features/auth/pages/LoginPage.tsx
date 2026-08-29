import React from 'react'
import { LoginForm } from '../components/LoginForm'

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Value proposition / branding */}
        <div className="text-white space-y-6 hidden md:block pr-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
            <span>🇱🇰</span>
            <span>Sri Lanka Driving School Platform</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Streamline your driving school operations.
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Manage student registrations, DMT licence category enrolments,
            instructor assignments, vehicle fleets, and practical training
            schedules with full multi-tenant isolation.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
              <p className="text-lg font-bold text-blue-400">Multi-Tenant</p>
              <p className="text-xs text-slate-400 mt-0.5">
                School & branch data isolation
              </p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
              <p className="text-lg font-bold text-emerald-400">
                Compliance Ready
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Revenue licence & insurance alerts
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
