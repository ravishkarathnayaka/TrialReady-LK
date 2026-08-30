import { useCallback, useEffect, useState } from 'react'
import {
  getStudentReadinessProfile,
  saveReadinessEvaluation,
} from '../services/readinessService'
import type { StudentReadinessProfile } from '../types/readiness'

export function useStudentReadiness(studentId: string) {
  const [profile, setProfile] = useState<StudentReadinessProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const reloadProfile = useCallback(async () => {
    if (!studentId) return
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const data = await getStudentReadinessProfile(studentId)
      setProfile(data)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to evaluate trial readiness.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    let isMounted = true
    if (!studentId) return

    getStudentReadinessProfile(studentId)
      .then((data) => {
        if (isMounted) {
          setProfile(data)
          setErrorMessage(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Failed to load readiness evaluation.',
          )
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [studentId])

  const handleSaveEvaluation = useCallback(async () => {
    if (!profile) return
    try {
      setErrorMessage(null)
      await saveReadinessEvaluation(profile.evaluation)
      setSuccessMessage('Trial readiness evaluation saved to student history.')
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to save evaluation.'
      setErrorMessage(msg)
      throw err
    }
  }, [profile])

  return {
    profile,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    reloadProfile,
    handleSaveEvaluation,
  }
}
