import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  label: string
  to: string
  icon: string
  roles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: '📊',
  },
  {
    label: 'Sessions & Calendar',
    to: '/sessions',
    icon: '📅',
    roles: ['administrator', 'instructor'],
  },
  {
    label: 'Vehicles',
    to: '/vehicles',
    icon: '🚗',
    roles: ['administrator', 'instructor'],
  },
  {
    label: 'Students',
    to: '/students',
    icon: '👨‍🎓',
    roles: ['administrator', 'instructor'],
  },
  {
    label: 'Instructors',
    to: '/instructors',
    icon: '👨‍🏫',
    roles: ['administrator'],
  },
  {
    label: 'Branches',
    to: '/branches',
    icon: '🏢',
    roles: ['administrator'],
  },
]

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth()

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true
    if (!role) return false
    return item.roles.includes(role)
  })

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-sm">
              TR
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                TrialReady<span className="text-blue-600">.LK</span>
              </span>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                Operations
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sidebar"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:hidden cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Menu
          </p>

          <nav className="space-y-1">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
            <p className="text-xs font-bold text-slate-700">TrialReady LK</p>
            <p className="text-[10px] text-slate-400 mt-0.5">MVP Edition 1.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
