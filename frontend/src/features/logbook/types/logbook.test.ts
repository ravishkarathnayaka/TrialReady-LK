import { describe, it, expect } from 'vitest'
import type { StudentLogbookData, TrialAdmissionSlipData } from './logbook'

describe('logbook domain models', () => {
  it('validates structured logbook data schema', () => {
    const mockLogbook: StudentLogbookData = {
      school: {
        schoolName: 'Royal Driving Academy',
        registrationNumber: 'DS-WP-2026-0042',
        phone: '+94 11 289 4400',
        address: '142 High Level Road, Nugegoda',
      },
      student: {
        fullName: 'Kavindu Dilshan',
        admissionNumber: 'ADM-2026-0104',
        nicPassport: '200219401822',
        phone: '077 441 9820',
        email: 'kavindu.d@gmail.com',
        registrationDate: '2026-05-10',
        branchName: 'Nugegoda Main Branch',
      },
      permit: {
        permitNumber: 'WP-884920',
        issueDate: '2026-05-12',
        expiryDate: '2026-11-12',
        status: 'active',
      },
      medical: {
        certificateNumber: 'MED-2026-9921',
        issueDate: '2026-05-08',
        expiryDate: '2026-11-08',
        ntmiBranch: 'Werahera',
        status: 'passed',
      },
      licenceCategory: {
        code: 'B',
        name: 'Dual-Purpose Motor Car (Auto/Manual)',
      },
      sessions: [
        {
          sessionDate: '2026-06-01',
          startTime: '08:00',
          endTime: '09:30',
          durationMinutes: 90,
          vehicleRegistration: 'WP CAB-4921',
          instructorName: 'Bandara Perera',
          skillsCovered: ['Hill Start / Gradient', 'Clutch Control & Gears'],
          studentRating: 5,
          attendanceStatus: 'present',
        },
      ],
      theoryExams: [
        {
          examType: 'theory',
          attemptNumber: 1,
          scheduledDate: '2026-06-15',
          status: 'passed',
          score: 88,
          location: 'DMT Werahera',
        },
      ],
      totalPracticalHours: 15.0,
      totalCompletedSessions: 10,
      aiReadinessScore: 92,
      readinessTier: '🏆 Trial Ready',
    }

    expect(mockLogbook.school.registrationNumber).toBe('DS-WP-2026-0042')
    expect(mockLogbook.student.fullName).toBe('Kavindu Dilshan')
    expect(mockLogbook.sessions).toHaveLength(1)
    expect(mockLogbook.aiReadinessScore).toBe(92)
  })

  it('validates trial admission slip schema', () => {
    const mockSlip: TrialAdmissionSlipData = {
      school: {
        schoolName: 'Royal Driving Academy',
        registrationNumber: 'DS-WP-2026-0042',
        phone: '+94 11 289 4400',
        address: '142 High Level Road, Nugegoda',
      },
      student: {
        fullName: 'Kavindu Dilshan',
        admissionNumber: 'ADM-2026-0104',
        nicPassport: '200219401822',
        phone: '077 441 9820',
        email: 'kavindu.d@gmail.com',
        registrationDate: '2026-05-10',
        branchName: 'Nugegoda Main Branch',
      },
      permit: null,
      medical: null,
      licenceCategory: {
        code: 'B',
        name: 'Dual-Purpose Motor Car (Auto/Manual)',
      },
      totalPracticalHours: 15.0,
      aiReadinessScore: 90,
      readinessTier: '🏆 Trial Ready',
      trialGroundLocation: 'DMT Werahera Practical Test Ground',
      reportingTime: '07:30 AM',
      trialDate: '2026-09-14',
      testVehicleRegistration: 'WP CAB-4921',
    }

    expect(mockSlip.trialGroundLocation).toContain('Werahera')
    expect(mockSlip.reportingTime).toBe('07:30 AM')
  })
})
