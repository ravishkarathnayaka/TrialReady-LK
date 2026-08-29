import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  cancelPracticalSession,
  createPracticalSession,
  deletePracticalSession,
  getBranchesForSessions,
  getCategoriesForSessions,
  getInstructorsForSessions,
  getPracticalSessions,
  getStudentsForSessions,
  getVehiclesForSessions,
  recordSessionAttendance,
  updatePracticalSession,
} from '../services/sessionService'
import type {
  CreatePracticalSessionInput,
  PracticalSessionWithRelations,
  RecordAttendanceInput,
  SessionBranchSummary,
  SessionCategorySummary,
  SessionConflict,
  SessionInstructorSummary,
  SessionStudentSummary,
  SessionVehicleSummary,
  UpdatePracticalSessionInput,
} from '../types/session'
import { detectScheduleConflicts } from '../utils/sessionValidation'

export interface SessionFilters {
  search: string
  status: string
  attendanceStatus: string
  branchId: string
  instructorId: string
  categoryId: string
  date: string
}

const DEFAULT_FILTERS: SessionFilters = {
  search: '',
  status: 'all',
  attendanceStatus: 'all',
  branchId: 'all',
  instructorId: 'all',
  categoryId: 'all',
  date: '',
}

export function usePracticalSessions(drivingSchoolId: string) {
  const [sessions, setSessions] = useState<PracticalSessionWithRelations[]>([])
  const [students, setStudents] = useState<SessionStudentSummary[]>([])
  const [instructors, setInstructors] = useState<SessionInstructorSummary[]>([])
  const [vehicles, setVehicles] = useState<SessionVehicleSummary[]>([])
  const [categories, setCategories] = useState<SessionCategorySummary[]>([])
  const [branches, setBranches] = useState<SessionBranchSummary[]>([])

  const [filters, setFilters] = useState<SessionFilters>(DEFAULT_FILTERS)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [calendarAnchorDate, setCalendarAnchorDate] = useState<Date>(
    new Date(),
  )

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const reloadSessions = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const [sessList, studList, instList, vehList, catList, brList] =
        await Promise.all([
          getPracticalSessions(drivingSchoolId),
          getStudentsForSessions(drivingSchoolId),
          getInstructorsForSessions(drivingSchoolId),
          getVehiclesForSessions(drivingSchoolId),
          getCategoriesForSessions(drivingSchoolId),
          getBranchesForSessions(drivingSchoolId),
        ])

      setSessions(sessList)
      setStudents(studList)
      setInstructors(instList)
      setVehicles(vehList)
      setCategories(catList)
      setBranches(brList)
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to load practical sessions data.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [drivingSchoolId])

  useEffect(() => {
    let isCancelled = false

    Promise.all([
      getPracticalSessions(drivingSchoolId),
      getStudentsForSessions(drivingSchoolId),
      getInstructorsForSessions(drivingSchoolId),
      getVehiclesForSessions(drivingSchoolId),
      getCategoriesForSessions(drivingSchoolId),
      getBranchesForSessions(drivingSchoolId),
    ])
      .then(([sessList, studList, instList, vehList, catList, brList]) => {
        if (!isCancelled) {
          setSessions(sessList)
          setStudents(studList)
          setInstructors(instList)
          setVehicles(vehList)
          setCategories(catList)
          setBranches(brList)
          setErrorMessage(null)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Unable to load practical sessions data.',
          )
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [drivingSchoolId])

  const setFilter = useCallback(
    <K extends keyof SessionFilters>(key: K, value: SessionFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const filteredSessions = useMemo(() => {
    const searchNormalized = filters.search.trim().toLowerCase()

    return sessions.filter((s) => {
      if (searchNormalized) {
        const studentName = s.student?.full_name?.toLowerCase() || ''
        const studentAdmission =
          s.student?.admission_number?.toLowerCase() || ''
        const instructorName = s.instructor?.full_name?.toLowerCase() || ''
        const vehicleReg = s.vehicle?.registration_number?.toLowerCase() || ''
        const categoryCode = s.licence_category?.code?.toLowerCase() || ''

        const matches =
          studentName.includes(searchNormalized) ||
          studentAdmission.includes(searchNormalized) ||
          instructorName.includes(searchNormalized) ||
          vehicleReg.includes(searchNormalized) ||
          categoryCode.includes(searchNormalized)

        if (!matches) return false
      }

      if (filters.status !== 'all' && s.status !== filters.status) {
        return false
      }

      if (
        filters.attendanceStatus !== 'all' &&
        s.attendance_status !== filters.attendanceStatus
      ) {
        return false
      }

      if (filters.branchId !== 'all' && s.branch_id !== filters.branchId) {
        return false
      }

      if (
        filters.instructorId !== 'all' &&
        s.instructor_id !== filters.instructorId
      ) {
        return false
      }

      if (
        filters.categoryId !== 'all' &&
        s.licence_category_id !== filters.categoryId
      ) {
        return false
      }

      if (filters.date && s.session_date !== filters.date) {
        return false
      }

      return true
    })
  }, [sessions, filters])

  // Summary Metrics
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const todaySessions = sessions.filter((s) => s.session_date === today)

    return {
      total: sessions.length,
      todayTotal: todaySessions.length,
      scheduled: sessions.filter((s) => s.status === 'scheduled').length,
      completed: sessions.filter((s) => s.status === 'completed').length,
      cancelled: sessions.filter((s) => s.status === 'cancelled').length,
    }
  }, [sessions])

  const checkConflicts = useCallback(
    (candidate: {
      sessionDate: string
      startTime: string
      endTime: string
      instructorId: string
      vehicleId?: string | null
      studentId: string
      excludeSessionId?: string
    }): SessionConflict[] => {
      return detectScheduleConflicts(sessions, candidate)
    },
    [sessions],
  )

  const handleCreateSession = useCallback(
    async (input: CreatePracticalSessionInput) => {
      try {
        setErrorMessage(null)
        const created = await createPracticalSession(input)
        setSessions((prev) => [...prev, created])
        setSuccessMessage('Practical driving lesson scheduled successfully.')
        return created
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to schedule lesson.'
        setErrorMessage(msg)
        throw err
      }
    },
    [],
  )

  const handleUpdateSession = useCallback(
    async (sessionId: string, input: UpdatePracticalSessionInput) => {
      try {
        setErrorMessage(null)
        const updated = await updatePracticalSession(sessionId, input)
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? updated : s)),
        )
        setSuccessMessage('Practical session updated successfully.')
        return updated
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to update session.'
        setErrorMessage(msg)
        throw err
      }
    },
    [],
  )

  const handleRecordAttendance = useCallback(
    async (sessionId: string, input: RecordAttendanceInput) => {
      try {
        setErrorMessage(null)
        const updated = await recordSessionAttendance(sessionId, input)
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? updated : s)),
        )
        setSuccessMessage('Attendance and evaluation recorded successfully.')
        return updated
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to record attendance.'
        setErrorMessage(msg)
        throw err
      }
    },
    [],
  )

  const handleCancelSession = useCallback(
    async (sessionId: string, reason: string) => {
      try {
        setErrorMessage(null)
        const updated = await cancelPracticalSession(sessionId, reason)
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? updated : s)),
        )
        setSuccessMessage('Session cancelled.')
        return updated
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to cancel session.'
        setErrorMessage(msg)
        throw err
      }
    },
    [],
  )

  const handleDeleteSession = useCallback(async (sessionId: string) => {
    try {
      setErrorMessage(null)
      await deletePracticalSession(sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      setSuccessMessage('Session deleted.')
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to delete session.'
      setErrorMessage(msg)
      throw err
    }
  }, [])

  return {
    sessions,
    filteredSessions,
    students,
    instructors,
    vehicles,
    categories,
    branches,
    filters,
    viewMode,
    calendarAnchorDate,
    metrics,
    isLoading,
    errorMessage,
    successMessage,
    setViewMode,
    setCalendarAnchorDate,
    setFilter,
    resetFilters,
    setErrorMessage,
    setSuccessMessage,
    reloadSessions,
    checkConflicts,
    handleCreateSession,
    handleUpdateSession,
    handleRecordAttendance,
    handleCancelSession,
    handleDeleteSession,
  }
}
