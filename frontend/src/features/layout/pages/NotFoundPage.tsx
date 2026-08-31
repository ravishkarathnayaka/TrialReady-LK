import React from 'react'
import { Link } from 'react-router-dom'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-blue-50 border border-blue-200 text-5xl shadow-sm mx-auto">
          ⛔
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-blue-600 tracking-widest uppercase">
            Error 404 • Route Not Found
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Dead End / Wrong Way
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            The page you are looking for has moved, been renamed, or does not exist on the academy road map.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <span>🏠</span> Return to Dashboard
          </Link>
          <Link
            to="/students"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <span>👨‍🎓</span> View Students
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
