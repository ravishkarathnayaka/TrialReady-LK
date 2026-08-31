import { describe, it, expect } from 'vitest'
import {
  computeTrialAnalytics,
  computeInstructorMetrics,
  computeFleetMetrics,
  computeRevenueAnalytics,
} from './analyticsEngine'

describe('analyticsEngine', () => {
  describe('computeTrialAnalytics', () => {
    it('computes trial pass rate and failure point distribution', () => {
      const mockExams = [
        { exam_type: 'practical_trial', attempt_number: 1, status: 'passed' },
        { exam_type: 'practical_trial', attempt_number: 1, status: 'passed' },
        { exam_type: 'practical_trial', attempt_number: 1, status: 'failed' },
        { exam_type: 'practical_trial', attempt_number: 2, status: 'passed' },
      ]

      const analytics = computeTrialAnalytics(mockExams)
      expect(analytics.totalTrials).toBe(4)
      expect(analytics.passedTrials).toBe(3)
      expect(analytics.failedTrials).toBe(1)
      expect(analytics.overallPassRate).toBe(75)
      expect(analytics.firstAttemptPassRate).toBe(67) // 2 passed out of 3
      expect(analytics.commonFailurePoints).toHaveLength(5)
    })
  })

  describe('computeInstructorMetrics', () => {
    it('computes instructor performance metrics including session count and rating', () => {
      const mockInstructors = [
        { id: 'inst-1', full_name: 'Bandara Perera', staff_number: 'INS-01' },
      ]
      const mockSessions = [
        { instructor_id: 'inst-1', status: 'completed', student_rating: 5 },
        { instructor_id: 'inst-1', status: 'completed', student_rating: 4 },
      ]

      const metrics = computeInstructorMetrics(mockInstructors, mockSessions)
      expect(metrics).toHaveLength(1)
      expect(metrics[0].name).toBe('Bandara Perera')
      expect(metrics[0].completedSessionsCount).toBe(2)
      expect(metrics[0].totalHoursConducted).toBe(2.5) // 2 * 1.25
      expect(metrics[0].averageStudentRating).toBe(4.5)
    })
  })

  describe('computeFleetMetrics', () => {
    it('computes vehicle utilization and maintenance estimations', () => {
      const mockVehicles = [
        { id: 'veh-1', registration_number: 'WP CAB-4921', make: 'Toyota', model: 'Vitz', transmission_type: 'Auto' },
      ]
      const mockSessions = [
        { vehicle_id: 'veh-1', status: 'completed' },
        { vehicle_id: 'veh-1', status: 'completed' },
      ]

      const metrics = computeFleetMetrics(mockVehicles, mockSessions)
      expect(metrics).toHaveLength(1)
      expect(metrics[0].registrationNumber).toBe('WP CAB-4921')
      expect(metrics[0].completedSessionsCount).toBe(2)
      expect(metrics[0].totalHoursDriven).toBe(2.5)
      expect(metrics[0].maintenanceExpenses).toBe(15000 + 2 * 1200)
    })
  })

  describe('computeRevenueAnalytics', () => {
    it('computes total enrolled fees, revenue collected, and collection efficiency percentage', () => {
      const enrolments = [{ agreed_fee: 50000 }, { agreed_fee: 40000 }]
      const payments = [{ amount: 30000 }, { amount: 30000 }]

      const rev = computeRevenueAnalytics(payments, enrolments)
      expect(rev.totalEnrolledFees).toBe(90000)
      expect(rev.totalRevenueCollected).toBe(60000)
      expect(rev.totalOutstandingBalance).toBe(30000)
      expect(rev.collectionEfficiencyPercentage).toBe(67) // 60k/90k = 66.6% -> 67%
    })
  })
})
