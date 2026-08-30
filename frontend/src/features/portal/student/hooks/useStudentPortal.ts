import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import { getStudentFinancialLedger } from '../../../financials/services/financialService'
import type { StudentFinancialLedger } from '../../../financials/types/financials'
import { getStudentJourneyOverview } from '../../../journey/services/journeyService'
import type { StudentJourneyOverview } from '../../../journey/types/journey'
import { getStudentReadinessProfile } from '../../../readiness/services/readinessService'
import type { StudentReadinessProfile } from '../../../readiness/types/readiness'
import { getPracticalSessions } from '../../../sessions/services/sessionService'
import type { PracticalSessionWithRelations } from '../../../sessions/types/session'

export function useStudentPortal(drivingSchoolId: string, explicitStudentId?: string) {
  const [journey, setJourney] = useState<StudentJourneyOverview | null>(null)
  const [ledger, setLedger] = useState<StudentFinancialLedger | null>(null)
  const [readiness, setReadiness] = useState<StudentReadinessProfile | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<PracticalSessionWithRelations[]>([])
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0)

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      let targetStudentId = explicitStudentId

      if (!targetStudentId) {
        // Find the first active student in this school
        const { data: students, error: studErr } = await supabase
          .from('students')
          .select('id')
          .eq('driving_school_id', drivingSchoolId)
          .eq('is_active', true)
          .limit(1)

        if (studErr) throw new Error(studErr.message)
        if (students && students.length > 0) {
          targetStudentId = students[0].id
        }
      }

      if (!targetStudentId) {
        setIsLoading(false)
        return
      }

      const [journeyData, ledgerData, readinessData, allSessions] =
        await Promise.all([
          getStudentJourneyOverview(targetStudentId),
          getStudentFinancialLedger(targetStudentId),
          getStudentReadinessProfile(targetStudentId),
          getPracticalSessions(drivingSchoolId),
        ])

      const studentSessions = allSessions.filter(
        (s: PracticalSessionWithRelations) => s.student_id === targetStudentId,
      )

      const upcoming = studentSessions.filter(
        (s: PracticalSessionWithRelations) =>
          s.status === 'scheduled' || s.status === 'in_progress',
      )
      const completed = studentSessions.filter(
        (s: PracticalSessionWithRelations) => s.status === 'completed',
      ).length

      setJourney(journeyData)
      setLedger(ledgerData)
      setReadiness(readinessData)
      setUpcomingSessions(upcoming)
      setCompletedSessionsCount(completed)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load student portal.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [drivingSchoolId, explicitStudentId])

  useEffect(() => {
    let isMounted = true
    loadData().catch((err) => {
      if (isMounted) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load student portal.',
        )
      }
    })

    return () => {
      isMounted = false
    }
  }, [loadData])

  return {
    journey,
    ledger,
    readiness,
    upcomingSessions,
    completedSessionsCount,
    isLoading,
    errorMessage,
    reloadData: loadData,
  }
}
