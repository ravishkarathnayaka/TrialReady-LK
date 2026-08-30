import React, { useState } from 'react'
import { AnnouncementModal } from '../components/AnnouncementModal'
import { NoticeBoardCard } from '../components/NoticeBoardCard'
import { NotificationItemCard } from '../components/NotificationItemCard'
import { useAnnouncements } from '../hooks/useAnnouncements'
import { useNotifications } from '../hooks/useNotifications'

interface NotificationsCenterPageProps {
  drivingSchoolId: string
}

export const NotificationsCenterPage: React.FC<
  NotificationsCenterPageProps
> = ({ drivingSchoolId }) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'noticeboard'>('alerts')
  const [filterType, setFilterType] = useState<string>('all')
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false)

  const {
    notifications,
    unreadCount,
    isLoading: isLoadingNotifications,
    handleMarkRead,
    handleMarkAllRead,
    handleDelete: handleDeleteNotification,
  } = useNotifications(drivingSchoolId)

  const {
    announcements,
    isLoading: isLoadingAnnouncements,
    handleCreate: handleCreateAnnouncement,
    handleDelete: handleDeleteAnnouncement,
  } = useAnnouncements(drivingSchoolId)

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return n.status === 'unread'
    if (filterType === 'urgent') return n.priority === 'urgent'
    if (filterType === 'sms') return n.channel === 'sms'
    if (filterType === 'whatsapp') return n.channel === 'whatsapp'
    if (filterType === 'in_app') return n.channel === 'in_app'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Alerts & Notice Center
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Automated permit countdowns, practical driving lesson reminders, and driving academy notice board broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'alerts' && unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              ✓ Mark All Read
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAnnouncementModalOpen(true)}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
          >
            + Post Announcement
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🔔</span>
          <span>Alerts & Deadlines ({notifications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('noticeboard')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'noticeboard'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>📢</span>
          <span>Academy Notice Board ({announcements.length})</span>
        </button>
      </div>

      {/* Tab 1: Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Alerts ({notifications.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterType('unread')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold cursor-pointer ${
                filterType === 'unread'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>

            <button
              type="button"
              onClick={() => setFilterType('urgent')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold cursor-pointer ${
                filterType === 'urgent'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🚨 Urgent Only
            </button>

            <button
              type="button"
              onClick={() => setFilterType('whatsapp')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold cursor-pointer ${
                filterType === 'whatsapp'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              📱 WhatsApp Simulated
            </button>

            <button
              type="button"
              onClick={() => setFilterType('sms')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold cursor-pointer ${
                filterType === 'sms'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              💬 SMS Text
            </button>
          </div>

          {/* List */}
          {isLoadingNotifications ? (
            <div className="py-16 text-center text-xs text-slate-400">
              Loading alerts...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
              No alerts found for this filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <NotificationItemCard
                  key={notif.id}
                  notification={notif}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Notice Board */}
      {activeTab === 'noticeboard' && (
        <div>
          {isLoadingAnnouncements ? (
            <div className="py-16 text-center text-xs text-slate-400">
              Loading notice board...
            </div>
          ) : (
            <NoticeBoardCard
              announcements={announcements}
              onDeleteAnnouncement={handleDeleteAnnouncement}
            />
          )}
        </div>
      )}

      {/* Post Announcement Modal */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        drivingSchoolId={drivingSchoolId}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSave={handleCreateAnnouncement}
      />
    </div>
  )
}

export default NotificationsCenterPage
