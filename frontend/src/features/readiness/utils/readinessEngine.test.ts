import { describe, it, expect } from 'vitest'
import {
  evaluateStudentTrialReadiness,
  getReadinessTierInfo,
  CORE_DMT_PRACTICAL_SKILLS,
} from './readinessEngine'
import type { StudentExamTrial, StudentMedicalRecord, StudentPermit } from '../../journey/types/journey'
import type { PracticalSessionWithRelations } from '../../sessions/types/session'

describe('readinessEngine', () => {
  describe('getReadinessTierInfo', () => {
    it('returns correct label and color for trial_ready', () => {
      const info = getReadinessTierInfo('trial_ready')
      expect(info.label).toContain('Trial Ready')
      expect(info.color).toBe('#059669')
    })

    it('returns correct label and color for nearly_ready', () => {
      const info = getReadinessTierInfo('nearly_ready')
      expect(info.label).toContain('Nearly Ready')
      expect(info.color).toBe('#2563eb')
    })

    it('returns correct label and color for needs_practice', () => {
      const info = getReadinessTierInfo('needs_practice')
      expect(info.label).toContain('Needs Practice')
      expect(info.color).toBe('#d97706')
    })

    it('returns correct label and color for not_ready', () => {
      const info = getReadinessTierInfo('not_ready')
      expect(info.label).toContain('Not Ready')
      expect(info.color).toBe('#dc2626')
    })
  })

  describe('evaluateStudentTrialReadiness', () => {
    const validFutureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const expiredPastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    it('scores full marks (100%) and returns trial_ready for a fully qualified student', () => {
      const mockPermit: StudentPermit = {
        id: 'p-1',
        driving_school_id: 'ds-1',
        student_id: 's-1',
        permit_number: 'WP-884920',
        issue_date: '2026-01-01',
        expiry_date: validFutureDate,
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
        certificate_number: 'MED-2026-9921',
        appointment_date: null,
        issued_date: '2026-01-01',
        expiry_date: validFutureDate,
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
          id: 't-1',
          driving_school_id: 'ds-1',
          student_id: 's-1',
          exam_type: 'theory',
          attempt_number: 1,
          scheduled_date: '2026-02-01',
          status: 'passed',
          score: 95,
          location: 'DMT Werahera',
          examiner_notes: null,
          created_at: '2026-02-01',
          updated_at: '2026-02-01',
        },
      ]

      const mockSessions = Array.from({ length: 12 }, (_, i) => ({
        id: `sess-${i}`,
        driving_school_id: 'ds-1',
        student_id: 's-1',
        instructor_id: 'inst-1',
        vehicle_id: 'veh-1',
        licence_category_id: 'cat-1',
        branch_id: 'br-1',
        session_date: '2026-03-01',
        start_time: '08:00',
        end_time: '09:30',
        status: 'completed' as const,
        attendance_status: 'present' as const,
        skills_covered: [...CORE_DMT_PRACTICAL_SKILLS],
        student_rating: 5,
        instructor_notes: null,
        student_feedback: null,
        created_at: '2026-03-01',
        updated_at: '2026-03-01',
      })) as unknown as PracticalSessionWithRelations[]

      const result = evaluateStudentTrialReadiness({
        studentId: 's-1',
        drivingSchoolId: 'ds-1',
        permit: mockPermit,
        medical: mockMedical,
        theoryExams: mockTheory,
        completedSessions: mockSessions,
        financialBalance: 0,
      })

      expect(result.evaluation.readiness_score).toBe(100)
      expect(result.evaluation.readiness_tier).toBe('trial_ready')
      expect(result.evaluation.skills_mastered_count).toBe(CORE_DMT_PRACTICAL_SKILLS.length)
      expect(result.evaluation.skills_missing).toHaveLength(0)
      expect(result.averageRating).toBe(5)
    })

    it('penalizes expired permits and flags risk warnings', () => {
      const expiredPermit: StudentPermit = {
        id: 'p-2',
        driving_school_id: 'ds-1',
        student_id: 's-2',
        permit_number: 'WP-111111',
        issue_date: '2025-01-01',
        expiry_date: expiredPastDate,
        dmt_reference: null,
        notes: null,
        is_current: true,
        status: 'active',
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      }

      const result = evaluateStudentTrialReadiness({
        studentId: 's-2',
        drivingSchoolId: 'ds-1',
        permit: expiredPermit,
        medical: null,
        theoryExams: [],
        completedSessions: [],
        financialBalance: 15000,
      })

      expect(result.evaluation.readiness_score).toBeLessThan(50)
      expect(result.evaluation.readiness_tier).toBe('not_ready')
      expect(result.evaluation.risk_warnings.some((w) => w.includes('expired'))).toBe(true)
      expect(result.evaluation.risk_warnings.some((w) => w.includes('balance'))).toBe(true)
    })
  })
})
