import { useCallback, useEffect, useState } from 'react'
import { getStudentMockAttempts } from '../services/theoryService'
import type { MockExamAttempt } from '../types/theory'

export function useTheoryHistory(studentId: string) {
  const [attempts, setAttempts] = useState<MockExamAttempt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const reloadHistory = useCallback(async () => {
    if (!studentId) return
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const data = await getStudentMockAttempts(studentId)
      setAttempts(data)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load mock test history.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    let isMounted = true
    if (!studentId) return

    getStudentMockAttempts(studentId)
      .then((data) => {
        if (isMounted) {
          setAttempts(data)
          setErrorMessage(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Failed to load mock attempts.',
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

  const totalAttempts = attempts.length
  const passedAttempts = attempts.filter((a) => a.passed).length
  const passRate =
    totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0

  const averageScore =
    totalAttempts > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + Number(a.score_percentage), 0) /
            totalAttempts,
        )
      : 0

  return {
    attempts,
    totalAttempts,
    passedAttempts,
    passRate,
    averageScore,
    isLoading,
    errorMessage,
    reloadHistory,
  }
}
