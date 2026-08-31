import { describe, it, expect } from 'vitest'
import {
  getDaysDifference,
  calculateDefaultPermitExpiry,
  calculatePermitValidity,
  computeJourneyStages,
} from './journeyUtils'
import type { StudentExamTrial, StudentMedicalRecord, StudentPermit } from '../types/journey'

describe('journeyUtils', () => {
  describe('getDaysDifference', () => {
    it('calculates days between today and a future target date', () => {
      const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const diff = getDaysDifference(future)
      expect(diff).toBeGreaterThanOrEqual(9)
      expect(diff).toBeLessThanOrEqual(11)
    })
  })

  describe('calculateDefaultPermitExpiry', () => {
    it('calculates 6-month validity according to DMT Sri Lanka rules', () => {
      const issueDate = '2026-01-15'
      const expiry = calculateDefaultPermitExpiry(issueDate)
      expect(expiry).toBe('2026-07-15')
    })
  })

  describe('calculatePermitValidity', () => {
    it('returns missing state when no expiry date is passed', () => {
      const res = calculatePermitValidity(null)
      expect(res.state).toBe('missing')
      expect(res.label).toBe('No Permit Recorded')
    })

    it('returns expired state when date is in the past', () => {
      const past = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const res = calculatePermitValidity(past)
      expect(res.state).toBe('expired')
      expect(res.label).toContain('Expired')
    })

    it('returns expiring_soon when within 30 days', () => {
      const soon = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const res = calculatePermitValidity(soon)
      expect(res.state).toBe('expiring_soon')
      expect(res.label).toContain('Expiring in')
    })

    it('returns valid when more than 30 days remaining', () => {
      const valid = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const res = calculatePermitValidity(valid)
      expect(res.state).toBe('valid')
      expect(res.label).toContain('Active')
    })
  })

  describe('computeJourneyStages', () => {
    it('computes all 7 stages correctly for a new registered student', () => {
      const result = computeJourneyStages({
        permit: null,
        medical: null,
        theoryExams: [],
        practicalTrials: [],
        completedLessonsCount: 0,
      })

      expect(result.stages).toHaveLength(7)
      expect(result.stages[0].status).toBe('completed') // Stage 1: Registration
      expect(result.stages[1].status).toBe('pending')   // Stage 2: Medical
      expect(result.currentStageNumber).toBe(2)
      expect(result.completionPercentage).toBe(14) // 1 of 7 is 14%
    })

    it('shows 100% and Driving Licence Issued when practical trial is passed', () => {
      const futureExpiry = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const mockPermit: StudentPermit = {
        id: 'p-1',
        driving_school_id: 'ds-1',
        student_id: 's-1',
        permit_number: 'WP-123456',
        issue_date: '2026-01-01',
        expiry_date: futureExpiry,
        dmt_reference: null,
        notes: null,
        is_current: true,
        status: 'active',
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      }
      const mockMedical: StudentMedicalRecord = {
        id: 'm-1',
        driving_school_id: 'ds-1',
        student_id: 's-1',
        certificate_number: 'MED-123',
        appointment_date: null,
        issued_date: '2026-01-01',
        expiry_date: futureExpiry,
        ntmi_branch: 'Werahera',
        blood_group: null,
        restrictions: null,
        notes: null,
        status: 'passed',
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      }
      const mockTheory: StudentExamTrial[] = [
        {
          id: 'th-1',
          driving_school_id: 'ds-1',
          student_id: 's-1',
          exam_type: 'theory',
          attempt_number: 1,
          scheduled_date: '2026-02-01',
          status: 'passed',
          score: 90,
          location: 'DMT',
          examiner_notes: null,
          created_at: '2026-02-01',
          updated_at: '2026-02-01',
        },
      ]
      const mockTrial: StudentExamTrial[] = [
        {
          id: 'tr-1',
          driving_school_id: 'ds-1',
          student_id: 's-1',
          exam_type: 'practical_trial',
          attempt_number: 1,
          scheduled_date: '2026-04-01',
          status: 'passed',
          score: 100,
          location: 'DMT Werahera',
          examiner_notes: null,
          created_at: '2026-04-01',
          updated_at: '2026-04-01',
        },
      ]

      const result = computeJourneyStages({
        permit: mockPermit,
        medical: mockMedical,
        theoryExams: mockTheory,
        practicalTrials: mockTrial,
        completedLessonsCount: 12,
      })

      expect(result.completionPercentage).toBe(100)
      expect(result.currentStageNumber).toBe(7)
      expect(result.currentStageName).toContain('Driving Licence')
    })
  })
})
