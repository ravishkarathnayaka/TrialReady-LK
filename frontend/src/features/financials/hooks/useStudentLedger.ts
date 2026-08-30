import { useCallback, useEffect, useState } from 'react'
import {
  enrolStudentPackage,
  getStudentFinancialLedger,
  recordStudentPayment,
  deletePayment,
} from '../services/financialService'
import type {
  EnrolStudentPackageInput,
  RecordPaymentInput,
  StudentFinancialLedger,
} from '../types/financials'

export function useStudentLedger(studentId: string) {
  const [ledger, setLedger] = useState<StudentFinancialLedger | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const reloadLedger = useCallback(async () => {
    if (!studentId) return
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const data = await getStudentFinancialLedger(studentId)
      setLedger(data)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load student ledger.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    let isMounted = true
    if (!studentId) return

    getStudentFinancialLedger(studentId)
      .then((data) => {
        if (isMounted) {
          setLedger(data)
          setErrorMessage(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Failed to load ledger.',
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

  const handleEnrolPackage = useCallback(
    async (input: EnrolStudentPackageInput) => {
      try {
        setErrorMessage(null)
        await enrolStudentPackage(input)
        await reloadLedger()
        setSuccessMessage('Student enrolled in package successfully.')
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to enrol package.'
        setErrorMessage(msg)
        throw err
      }
    },
    [reloadLedger],
  )

  const handleRecordPayment = useCallback(
    async (input: RecordPaymentInput) => {
      try {
        setErrorMessage(null)
        const payment = await recordStudentPayment(input)
        await reloadLedger()
        setSuccessMessage(
          `Payment of LKR ${Number(input.amount).toLocaleString('en-LK')} recorded successfully. Receipt #${payment.receipt_number}`,
        )
        return payment
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to record payment.'
        setErrorMessage(msg)
        throw err
      }
    },
    [reloadLedger],
  )

  const handleDeletePayment = useCallback(
    async (paymentId: string) => {
      try {
        setErrorMessage(null)
        await deletePayment(paymentId)
        await reloadLedger()
        setSuccessMessage('Payment transaction removed.')
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to delete payment.'
        setErrorMessage(msg)
        throw err
      }
    },
    [reloadLedger],
  )

  return {
    ledger,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    reloadLedger,
    handleEnrolPackage,
    handleRecordPayment,
    handleDeletePayment,
  }
}
