import { useCallback, useEffect, useState } from 'react'
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
} from '../services/notificationService'
import type {
  AcademyAnnouncement,
  CreateAnnouncementInput,
} from '../types/notifications'

export function useAnnouncements(drivingSchoolId: string) {
  const [announcements, setAnnouncements] = useState<AcademyAnnouncement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const reloadAnnouncements = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const data = await getAnnouncements(drivingSchoolId)

      // Seed realistic default announcements if empty
      if (data.length === 0) {
        const seeded = await Promise.all([
          createAnnouncement({
            driving_school_id: drivingSchoolId,
            title: 'DMT Werahera Trial Ground Holiday Schedule',
            content:
              'Please note that DMT practical driving trials at Werahera / Colombo will be closed next Monday due to a public holiday. All affected candidate bookings will be rescheduled.',
            target_audience: 'all',
            is_pinned: true,
            author_name: 'Academy Principal',
          }),
          createAnnouncement({
            driving_school_id: drivingSchoolId,
            title: 'New Weekend DMT Theory Exam Prep Batch',
            content:
              'Intensive Highway Code and computerized mock test sessions will be conducted every Saturday from 09:00 AM to 11:30 AM in the main training hall.',
            target_audience: 'students',
            is_pinned: false,
            author_name: 'Chief Theory Instructor',
          }),
        ])
        setAnnouncements(seeded)
      } else {
        setAnnouncements(data)
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load announcements.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [drivingSchoolId])

  useEffect(() => {
    let isMounted = true

    reloadAnnouncements().catch(() => {
      if (isMounted) setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [reloadAnnouncements])

  const handleCreate = useCallback(
    async (input: CreateAnnouncementInput) => {
      try {
        const created = await createAnnouncement(input)
        setAnnouncements((prev) => [created, ...prev])
        return created
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to post announcement.'
        setErrorMessage(msg)
        throw err
      }
    },
    [],
  )

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteAnnouncement(id)
      setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      console.error('Failed to delete announcement:', err)
    }
  }, [])

  return {
    announcements,
    isLoading,
    errorMessage,
    reloadAnnouncements,
    handleCreate,
    handleDelete,
  }
}
