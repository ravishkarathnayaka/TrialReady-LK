import { useCallback, useEffect, useMemo, useState } from 'react'
import { getSchoolReadinessOverview } from '../../../readiness/services/readinessService'
import type { StudentReadinessProfile } from '../../../readiness/types/readiness'
import {
  getPracticalSessions,
  recordSessionAttendance,
} from '../../../sessions/services/sessionService'
import type {
  PracticalSessionWithRelations,
  RecordAttendanceInput,
} from '../../../sessions/types/session'

export function useInstructorPortal(drivingSchoolId: string) {
  const [todaySessions, setTodaySessions] = useState<
    PracticalSessionWithRelations[]
  >([])
  const [students, setStudents] = useState<StudentReadinessProfile[]>([])
  const [allSessions, setAllSessions] = useState<
    PracticalSessionWithRelations[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const reloadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const [sessionsData, studentsData] = await Promise.all([
        getPracticalSessions(drivingSchoolId),
        getSchoolReadinessOverview(drivingSchoolId),
      ])

      const todayStr = new Date().toISOString().split('T')[0]
      const filteredToday = sessionsData.filter(
        (s) => s.session_date === todayStr,
      )

      setAllSessions(sessionsData)
      setTodaySessions(filteredToday)
      setStudents(studentsData)
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to load instructor portal data.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [drivingSchoolId])

  useEffect(() => {
    let isMounted = true

    Promise.all([
      getPracticalSessions(drivingSchoolId),
      getSchoolReadinessOverview(drivingSchoolId),
    ])
      .then(([sessionsData, studentsData]) => {
        if (isMounted) {
          const todayStr = new Date().toISOString().split('T')[0]
          const filteredToday = sessionsData.filter(
            (s) => s.session_date === todayStr,
          )

          setAllSessions(sessionsData)
          setTodaySessions(filteredToday)
          setStudents(studentsData)
          setErrorMessage(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Failed to load instructor portal.',
          )
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [drivingSchoolId])

  const handleUpdateAttendance = useCallback(
    async (sessionId: string, input: RecordAttendanceInput) => {
      try {
        setErrorMessage(null)
        await recordSessionAttendance(sessionId, input)
        await reloadData()
        setSuccessMessage('Session attendance and evaluation recorded.')
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Failed to record session evaluation.'
        setErrorMessage(msg)
        throw err
      }
    },
    [reloadData],
  )

  // Compute Instructor Stats
  const stats = useMemo(() => {
    const todayCompletedCount = todaySessions.filter(
      (s) => s.status === 'completed',
    ).length

    // Estimate weekly hours from completed sessions in past 7 days
    const completedWeekly = allSessions.filter((s) => s.status === 'completed')
    const weeklyHours = completedWeekly.length * 1.25

    const trialReadyCount = students.filter(
      (s) => s.evaluation.readiness_tier === 'trial_ready',
    ).length

    return {
      todayLessonsCount: todaySessions.length,
      todayCompletedCount,
      weeklyHours,
      assignedStudentsCount: students.length,
      trialReadyCount,
    }
  }, [todaySessions, allSessions, students])

  return {
    todaySessions,
    students,
    stats,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    reloadData,
    handleUpdateAttendance,
  }
}
