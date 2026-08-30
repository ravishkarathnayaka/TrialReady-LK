export type NotificationType =
  | 'permit_expiring'
  | 'medical_expiring'
  | 'session_reminder'
  | 'payment_due'
  | 'trial_scheduled'
  | 'announcement'

export type NotificationChannel = 'in_app' | 'sms' | 'whatsapp' | 'email'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export type NotificationStatus = 'unread' | 'read' | 'archived'

export interface AppNotification {
  id: string
  driving_school_id: string
  recipient_type: 'student' | 'instructor' | 'all_students' | 'all_staff'
  recipient_id?: string | null
  type: NotificationType
  title: string
  message: string
  channel: NotificationChannel
  priority: NotificationPriority
  status: NotificationStatus
  action_url?: string | null
  created_at: string
  read_at?: string | null
}

export interface AcademyAnnouncement {
  id: string
  driving_school_id: string
  title: string
  content: string
  target_audience: 'all' | 'students' | 'instructors'
  is_pinned: boolean
  author_name: string
  created_at: string
}

export interface CreateAnnouncementInput {
  driving_school_id: string
  title: string
  content: string
  target_audience?: 'all' | 'students' | 'instructors'
  is_pinned?: boolean
  author_name?: string
}

export interface CreateNotificationInput {
  driving_school_id: string
  recipient_type: 'student' | 'instructor' | 'all_students' | 'all_staff'
  recipient_id?: string | null
  type: NotificationType
  title: string
  message: string
  channel?: NotificationChannel
  priority?: NotificationPriority
  action_url?: string | null
}
