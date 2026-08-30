import type {
  NotificationChannel,
  NotificationPriority,
  NotificationType,
} from '../types/notifications'

export function formatChannelBadge(channel: NotificationChannel): {
  label: string
  badgeClass: string
  icon: string
} {
  switch (channel) {
    case 'whatsapp':
      return {
        label: 'WhatsApp',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: '📱',
      }
    case 'sms':
      return {
        label: 'SMS Text',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        icon: '💬',
      }
    case 'email':
      return {
        label: 'Email',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: '✉️',
      }
    case 'in_app':
    default:
      return {
        label: 'In-App',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: '🔔',
      }
  }
}

export function formatPriorityBadge(priority: NotificationPriority): {
  label: string
  badgeClass: string
} {
  switch (priority) {
    case 'urgent':
      return {
        label: 'Urgent',
        badgeClass: 'bg-red-100 text-red-800 border-red-300 font-black animate-pulse',
      }
    case 'high':
      return {
        label: 'High Priority',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      }
    case 'medium':
      return {
        label: 'Standard',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200 font-medium',
      }
    case 'low':
    default:
      return {
        label: 'Low',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200 font-normal',
      }
  }
}

export function formatNotificationTypeIcon(type: NotificationType): string {
  switch (type) {
    case 'permit_expiring':
      return '📄'
    case 'medical_expiring':
      return '🏥'
    case 'session_reminder':
      return '🚗'
    case 'payment_due':
      return '💳'
    case 'trial_scheduled':
      return '🎯'
    case 'announcement':
      return '📢'
    default:
      return '🔔'
  }
}
