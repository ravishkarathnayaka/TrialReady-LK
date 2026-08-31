import { useCallback, useEffect, useState } from 'react'
import { fetchStudentLogbookData } from '../services/logbookService'
import type { StudentLogbookData, TrialAdmissionSlipData } from '../types/logbook'

export function useStudentLogbook(drivingSchoolId: string, studentId: string) {
  const [logbookData, setLogbookData] = useState<StudentLogbookData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!drivingSchoolId || !studentId) return

    const load = async () => {
      try {
        setIsLoading(true)
        setErrorMessage(null)
        const data = await fetchStudentLogbookData(drivingSchoolId, studentId)
        setLogbookData(data)
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to load logbook data')
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [drivingSchoolId, studentId])

  const getTrialSlipData = useCallback((): TrialAdmissionSlipData | null => {
    if (!logbookData) return null

    const today = new Date()
    const trialDate = new Date(today)
    trialDate.setDate(trialDate.getDate() + 14)

    return {
      school: logbookData.school,
      student: logbookData.student,
      permit: logbookData.permit,
      medical: logbookData.medical,
      licenceCategory: logbookData.licenceCategory,
      totalPracticalHours: logbookData.totalPracticalHours,
      aiReadinessScore: logbookData.aiReadinessScore,
      readinessTier: logbookData.readinessTier,
      trialGroundLocation: 'DMT Werahera Practical Test Ground',
      reportingTime: '07:30 AM',
      trialDate: trialDate.toISOString().split('T')[0],
      testVehicleRegistration: logbookData.sessions.length > 0
        ? logbookData.sessions[logbookData.sessions.length - 1].vehicleRegistration
        : 'WP CAB-4921',
    }
  }, [logbookData])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  return {
    logbookData,
    isLoading,
    errorMessage,
    getTrialSlipData,
    handlePrint,
  }
}
