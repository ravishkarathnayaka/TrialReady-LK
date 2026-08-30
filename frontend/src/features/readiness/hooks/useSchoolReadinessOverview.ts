import { useCallback, useEffect, useMemo, useState } from 'react'
import { getSchoolReadinessOverview } from '../services/readinessService'
import type { StudentReadinessProfile } from '../types/readiness'

export interface ReadinessFilters {
  search: string
  tier: string
}

const DEFAULT_FILTERS: ReadinessFilters = {
  search: '',
  tier: 'all',
}

export function useSchoolReadinessOverview(drivingSchoolId: string) {
  const [profiles, setProfiles] = useState<StudentReadinessProfile[]>([])
  const [filters, setFilters] = useState<ReadinessFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const reloadOverview = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const data = await getSchoolReadinessOverview(drivingSchoolId)
      setProfiles(data)
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to load readiness overview.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [drivingSchoolId])

  useEffect(() => {
    let isMounted = true

    getSchoolReadinessOverview(drivingSchoolId)
      .then((data) => {
        if (isMounted) {
          setProfiles(data)
          setErrorMessage(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Failed to load readiness overview.',
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
    <K extends keyof ReadinessFilters>(key: K, value: ReadinessFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const filteredProfiles = useMemo(() => {
    const searchNormalized = filters.search.trim().toLowerCase()

    return profiles.filter((p) => {
      if (searchNormalized) {
        const name = p.student.full_name.toLowerCase()
        const adm = p.student.admission_number.toLowerCase()
        if (!name.includes(searchNormalized) && !adm.includes(searchNormalized)) {
          return false
        }
      }

      if (filters.tier !== 'all') {
        if (p.evaluation.readiness_tier !== filters.tier) return false
      }

      return true
    })
  }, [profiles, filters])

  // Aggregate stats
  const metrics = useMemo(() => {
    let trialReadyCount = 0
    let nearlyReadyCount = 0
    let needsPracticeCount = 0
    let notReadyCount = 0
    let scoreSum = 0

    for (const p of profiles) {
      scoreSum += p.evaluation.readiness_score
      const tier = p.evaluation.readiness_tier
      if (tier === 'trial_ready') trialReadyCount++
      else if (tier === 'nearly_ready') nearlyReadyCount++
      else if (tier === 'needs_practice') needsPracticeCount++
      else notReadyCount++
    }

    const avgScore =
      profiles.length > 0 ? Math.round(scoreSum / profiles.length) : 0

    return {
      totalCandidates: profiles.length,
      trialReadyCount,
      nearlyReadyCount,
      needsPracticeCount,
      notReadyCount,
      avgScore,
    }
  }, [profiles])

  return {
    profiles,
    filteredProfiles,
    filters,
    metrics,
    isLoading,
    errorMessage,
    setFilter,
    resetFilters,
    reloadOverview,
  }
}
