import { supabase } from '../../../lib/supabase'
import type {
  AcademyAnnouncement,
  AppNotification,
  CreateAnnouncementInput,
  CreateNotificationInput,
} from '../types/notifications'

export async function getNotifications(
  drivingSchoolId: string,
): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('driving_school_id', drivingSchoolId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to load notifications: ${error.message}`)
  }

  return (data as AppNotification[]) ?? []
}

export async function createNotification(
  input: CreateNotificationInput,
): Promise<AppNotification> {
  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        driving_school_id: input.driving_school_id,
        recipient_type: input.recipient_type,
        recipient_id: input.recipient_id ?? null,
        type: input.type,
        title: input.title,
        message: input.message,
        channel: input.channel ?? 'in_app',
        priority: input.priority ?? 'medium',
        action_url: input.action_url ?? null,
        status: 'unread',
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create notification: ${error.message}`)
  }

  return data as AppNotification
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({
      status: 'read',
      read_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to mark notification read: ${error.message}`)
  }
}

export async function markAllNotificationsRead(
  drivingSchoolId: string,
): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({
      status: 'read',
      read_at: new Date().toISOString(),
    })
    .eq('driving_school_id', drivingSchoolId)
    .eq('status', 'unread')

  if (error) {
    throw new Error(`Failed to mark all read: ${error.message}`)
  }
}

export async function deleteNotification(id: string): Promise<void> {
  const { error } = await supabase.from('notifications').delete().eq('id', id)
  if (error) {
    throw new Error(`Failed to delete notification: ${error.message}`)
  }
}

// ==========================================
// Announcements / Notice Board
// ==========================================

export async function getAnnouncements(
  drivingSchoolId: string,
): Promise<AcademyAnnouncement[]> {
  const { data, error } = await supabase
    .from('academy_announcements')
    .select('*')
    .eq('driving_school_id', drivingSchoolId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to load announcements: ${error.message}`)
  }

  return (data as AcademyAnnouncement[]) ?? []
}

export async function createAnnouncement(
  input: CreateAnnouncementInput,
): Promise<AcademyAnnouncement> {
  const { data, error } = await supabase
    .from('academy_announcements')
    .insert([
      {
        driving_school_id: input.driving_school_id,
        title: input.title,
        content: input.content,
        target_audience: input.target_audience ?? 'all',
        is_pinned: input.is_pinned ?? false,
        author_name: input.author_name ?? 'Academy Administration',
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create announcement: ${error.message}`)
  }

  return data as AcademyAnnouncement
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { error } = await supabase
    .from('academy_announcements')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete announcement: ${error.message}`)
  }
}
