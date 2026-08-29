import React from 'react'
import { useAuth } from '../../auth/context/AuthContext'

interface HeaderProps {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { profile, role, logout } = useAuth()

  const getRoleBadgeStyle = (r: string | null) => {
    switch (r) {
      case 'administrator':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'instructor':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'student':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 md:px-6 shadow-xs backdrop-blur-xs">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Sidebar"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden cursor-pointer"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Driving School Badge */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-black text-white text-xs shadow-xs">
            TR
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">
              {profile?.driving_school?.name ?? 'TrialReady Driving Academy'}
            </p>
            <p className="text-[10px] text-slate-500">
              {profile?.driving_school?.registration_number ??
                'DS-WP-2026-0042'}
            </p>
          </div>
        </div>
      </div>

      {/* User Actions & Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
            {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {profile?.full_name ?? 'Active User'}
            </p>
            <span
              className={`inline-block rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider border ${getRoleBadgeStyle(
                role,
              )}`}
            >
              {role ?? 'User'}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => void logout()}
          title="Sign Out"
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all cursor-pointer"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header
