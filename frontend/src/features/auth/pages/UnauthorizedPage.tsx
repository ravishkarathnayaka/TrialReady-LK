import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate()
  const { role, logout } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-200">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 text-3xl font-bold">
          🛡️
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Access Restricted</h1>

        <p className="mt-2 text-xs text-slate-500">
          Your current role (
          <span className="font-semibold text-slate-700 uppercase">
            {role ?? 'Unknown'}
          </span>
          ) does not have permission to view this section.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
          >
            Go to Dashboard
          </button>

          <button
            type="button"
            onClick={() => void logout()}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage
