import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import { formatNotificationTypeIcon } from '../utils/alertEngine'

export const NotificationBellDropdown: React.FC = () => {
  const { drivingSchoolId } = useAuth()
  const { notifications, unreadCount, handleMarkRead, handleMarkAllRead } =
    useNotifications(drivingSchoolId)

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
        aria-label="View notifications"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white p-4 shadow-2xl border border-slate-200 z-50 animate-fade-in space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-0.2 text-[10px] font-bold text-blue-800">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.status === 'unread') handleMarkRead(n.id)
                  }}
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors cursor-pointer ${
                    n.status === 'unread' ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base shrink-0 mt-0.5">
                    {formatNotificationTypeIcon(n.type)}
                  </span>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {n.created_at.slice(0, 10)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Link */}
          <div className="border-t border-slate-100 pt-2 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Open Alerts & Notice Center →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBellDropdown
