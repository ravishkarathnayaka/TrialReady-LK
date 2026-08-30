import React from 'react'
import { Link } from 'react-router-dom'
import type { AppNotification } from '../types/notifications'
import {
  formatChannelBadge,
  formatNotificationTypeIcon,
  formatPriorityBadge,
} from '../utils/alertEngine'

interface NotificationItemCardProps {
  notification: AppNotification
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  notification,
  onMarkRead,
  onDelete,
}) => {
  const channelInfo = formatChannelBadge(notification.channel)
  const priorityInfo = formatPriorityBadge(notification.priority)
  const icon = formatNotificationTypeIcon(notification.type)
  const isUnread = notification.status === 'unread'

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
        isUnread
          ? 'border-blue-200 bg-blue-50/40 hover:bg-blue-50/70'
          : 'border-slate-200 bg-white hover:bg-slate-50/80'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Icon & Details */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-2xs border border-slate-200">
            {icon}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                {notification.title}
              </h4>

              {isUnread && (
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              )}

              <span
                className={`rounded-md px-2 py-0.2 text-[10px] border ${priorityInfo.badgeClass}`}
              >
                {priorityInfo.label}
              </span>

              <span
                className={`rounded-md px-2 py-0.2 text-[10px] border ${channelInfo.badgeClass}`}
              >
                {channelInfo.icon} {channelInfo.label}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              {notification.message}
            </p>

            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
              <span>{notification.created_at.slice(0, 10)}</span>
              {notification.action_url && (
                <>
                  <span>•</span>
                  <Link
                    to={notification.action_url}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    View Details →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isUnread && (
            <button
              type="button"
              onClick={() => onMarkRead(notification.id)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              title="Mark as Read"
            >
              ✓ Mark Read
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(notification.id)}
            className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
            title="Dismiss Alert"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationItemCard
