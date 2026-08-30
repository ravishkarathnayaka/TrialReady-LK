import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  createNotification,
} from '../services/notificationService'
import type { AppNotification } from '../types/notifications'

export function useNotifications(drivingSchoolId: string) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const reloadNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const data = await getNotifications(drivingSchoolId)

      // If empty, seed realistic Sri Lankan driving academy alerts
      if (data.length === 0) {
        const seeded = await Promise.all([
          createNotification({
            driving_school_id: drivingSchoolId,
            recipient_type: 'all_staff',
            type: 'permit_expiring',
            title: "Learner's Permit Expiry Warning",
            message:
              '3 students have DMT 6-month learner permits expiring within the next 30 days. Action required.',
            channel: 'in_app',
            priority: 'urgent',
            action_url: '/journey',
          }),
          createNotification({
            driving_school_id: drivingSchoolId,
            recipient_type: 'all_students',
            type: 'session_reminder',
            title: 'Practical Driving Lesson Scheduled',
            message:
              'Practical session booked for tomorrow at 08:30 AM (Vehicle: WP CAB-4921) with Instructor Nimal.',
            channel: 'sms',
            priority: 'medium',
            action_url: '/sessions',
          }),
          createNotification({
            driving_school_id: drivingSchoolId,
            recipient_type: 'all_students',
            type: 'payment_due',
            title: 'Course Fee Balance Notice',
            message:
              'Final instalment payment due before your upcoming DMT Practical Trial booking.',
            channel: 'whatsapp',
            priority: 'high',
            action_url: '/financials',
          }),
        ])
        setNotifications(seeded)
      } else {
        setNotifications(data)
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load notifications.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [drivingSchoolId])

  useEffect(() => {
    let isMounted = true

    reloadNotifications().catch(() => {
      if (isMounted) setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [reloadNotifications])

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.status === 'unread').length
  }, [notifications])

  const handleMarkRead = useCallback(async (id: string) => {
    try {
      await markNotificationRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n)),
      )
    } catch (err) {
      console.error('Failed to mark read:', err)
    }
  }, [])

  const handleMarkAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead(drivingSchoolId)
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })))
    } catch (err) {
      console.error('Failed to mark all read:', err)
    }
  }, [drivingSchoolId])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteNotification(id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }, [])

  return {
    notifications,
    unreadCount,
    isLoading,
    errorMessage,
    reloadNotifications,
    handleMarkRead,
    handleMarkAllRead,
    handleDelete,
  }
}
