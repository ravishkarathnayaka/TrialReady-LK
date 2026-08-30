import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getAllFinancialLedgers,
  getAllRecentPayments,
} from '../services/financialService'
import type { StudentFinancialLedger, StudentPayment } from '../types/financials'

export interface FinancialFilters {
  search: string
  paymentStatus: string
  branch: string
}

const DEFAULT_FILTERS: FinancialFilters = {
  search: '',
  paymentStatus: 'all',
  branch: 'all',
}

export function useFinancialOverview(drivingSchoolId: string) {
  const [ledgers, setLedgers] = useState<StudentFinancialLedger[]>([])
  const [recentPayments, setRecentPayments] = useState<StudentPayment[]>([])
  const [filters, setFilters] = useState<FinancialFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const reloadAll = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const [ledgersData, paymentsData] = await Promise.all([
        getAllFinancialLedgers(drivingSchoolId),
        getAllRecentPayments(drivingSchoolId),
      ])
      setLedgers(ledgersData)
      setRecentPayments(paymentsData)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load financials.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [drivingSchoolId])

  useEffect(() => {
    let isMounted = true

    Promise.all([
      getAllFinancialLedgers(drivingSchoolId),
      getAllRecentPayments(drivingSchoolId),
    ])
      .then(([ledgersData, paymentsData]) => {
        if (isMounted) {
          setLedgers(ledgersData)
          setRecentPayments(paymentsData)
          setErrorMessage(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Failed to load financials.',
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
    <K extends keyof FinancialFilters>(key: K, value: FinancialFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const filteredLedgers = useMemo(() => {
    const searchNormalized = filters.search.trim().toLowerCase()

    return ledgers.filter((l) => {
      if (searchNormalized) {
        const studentName = l.student.full_name.toLowerCase()
        const admission = l.student.admission_number.toLowerCase()
        const pkgName = l.enrolment?.package.name.toLowerCase() || ''

        const matches =
          studentName.includes(searchNormalized) ||
          admission.includes(searchNormalized) ||
          pkgName.includes(searchNormalized)

        if (!matches) return false
      }

      if (filters.paymentStatus !== 'all') {
        if (l.paymentStatus !== filters.paymentStatus) return false
      }

      return true
    })
  }, [ledgers, filters])

  // Summary Metrics
  const metrics = useMemo(() => {
    let totalBilled = 0
    let totalCollected = 0
    let totalOutstanding = 0
    let fullyPaidCount = 0
    let partialCount = 0
    let unpaidCount = 0

    for (const l of ledgers) {
      totalBilled += l.totalFee
      totalCollected += l.totalPaid
      totalOutstanding += l.balance

      if (l.paymentStatus === 'fully_paid') fullyPaidCount++
      else if (l.paymentStatus === 'partially_paid') partialCount++
      else unpaidCount++
    }

    const collectionRate =
      totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0

    return {
      totalStudents: ledgers.length,
      totalBilled,
      totalCollected,
      totalOutstanding,
      collectionRate,
      fullyPaidCount,
      partialCount,
      unpaidCount,
    }
  }, [ledgers])

  return {
    ledgers,
    filteredLedgers,
    recentPayments,
    filters,
    metrics,
    isLoading,
    errorMessage,
    setFilter,
    resetFilters,
    reloadAll,
  }
}
