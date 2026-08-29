import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllStudentJourneys } from '../services/journeyService'
import type { StudentJourneyOverview } from '../types/journey'
import { calculatePermitValidity } from '../utils/journeyUtils'

export interface JourneyFilters {
  search: string
  stage: string
  permitStatus: string
  medicalStatus: string
}

const DEFAULT_FILTERS: JourneyFilters = {
  search: '',
  stage: 'all',
  permitStatus: 'all',
  medicalStatus: 'all',
}

export function useJourneyOverview(drivingSchoolId: string) {
  const [journeys, setJourneys] = useState<StudentJourneyOverview[]>([])
  const [filters, setFilters] = useState<JourneyFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const reloadJourneys = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const data = await getAllStudentJourneys(drivingSchoolId)
      setJourneys(data)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load student journeys.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [drivingSchoolId])

  useEffect(() => {
    let isMounted = true

    getAllStudentJourneys(drivingSchoolId)
      .then((data) => {
        if (isMounted) {
          setJourneys(data)
          setErrorMessage(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Failed to load student journeys.',
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

  const setFilter = useCallback(
    <K extends keyof JourneyFilters>(key: K, value: JourneyFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const filteredJourneys = useMemo(() => {
    const searchNormalized = filters.search.trim().toLowerCase()

    return journeys.filter((j) => {
      if (searchNormalized) {
        const studentName = j.student.full_name.toLowerCase()
        const admissionNum = j.student.admission_number.toLowerCase()
        const permitNum = j.permit?.permit_number.toLowerCase() || ''

        const matches =
          studentName.includes(searchNormalized) ||
          admissionNum.includes(searchNormalized) ||
          permitNum.includes(searchNormalized)

        if (!matches) return false
      }

      if (filters.stage !== 'all') {
        const stageNum = parseInt(filters.stage, 10)
        if (j.overallStage !== stageNum) return false
      }

      if (filters.permitStatus !== 'all') {
        const validity = calculatePermitValidity(j.permit?.expiry_date)
        if (validity.state !== filters.permitStatus) return false
      }

      if (filters.medicalStatus !== 'all') {
        if ((j.medical?.status || 'not_scheduled') !== filters.medicalStatus) {
          return false
        }
      }

      return true
    })
  }, [journeys, filters])

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let activePermits = 0
    let expiringSoonPermits = 0
    let expiredPermits = 0
    let medicalPassed = 0
    let trialPassed = 0

    for (const j of journeys) {
      const validity = calculatePermitValidity(j.permit?.expiry_date)
      if (validity.state === 'valid') activePermits++
      else if (validity.state === 'expiring_soon') expiringSoonPermits++
      else if (validity.state === 'expired') expiredPermits++

      if (j.medical?.status === 'passed') medicalPassed++
      if (j.practicalTrials.some((t) => t.status === 'passed')) trialPassed++
    }

    return {
      totalStudents: journeys.length,
      activePermits,
      expiringSoonPermits,
      expiredPermits,
      medicalPassed,
      trialPassed,
    }
  }, [journeys])

  return {
    journeys,
    filteredJourneys,
    filters,
    metrics,
    isLoading,
    errorMessage,
    setFilter,
    resetFilters,
    reloadJourneys,
  }
}
