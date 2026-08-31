import { describe, it, expect } from 'vitest'
import { generateAiSessionFeedback } from './feedbackGenerator'

describe('feedbackGenerator', () => {
  it('generates encouraging feedback for high-rated session', () => {
    const fb = generateAiSessionFeedback({
      studentName: 'Kavindu Dilshan',
      sessionDate: '2026-08-31',
      durationMinutes: 90,
      skillsCovered: ['Hill Start / Gradient', 'Reverse S-Bend'],
      studentRating: 5,
      vehicleReg: 'WP CAB-4921',
      instructorName: 'Bandara Perera',
    })

    expect(fb.summaryParagraph).toContain('Kavindu Dilshan')
    expect(fb.summaryParagraph).toContain('1.5') // 90 min = 1.5 hr
    expect(fb.strengths.length).toBeGreaterThan(0)
    expect(fb.focusAreasForNextLesson.length).toBeGreaterThan(0)
    expect(fb.formalInstructorNote).toContain('WP CAB-4921')
    expect(fb.formalInstructorNote).toContain('Bandara Perera')
  })

  it('generates constructive improvement feedback for low-rated session', () => {
    const fb = generateAiSessionFeedback({
      studentName: 'Nadeesha Fernando',
      sessionDate: '2026-08-31',
      durationMinutes: 60,
      skillsCovered: ['Clutch Control & Gears'],
      studentRating: 2,
    })

    expect(fb.summaryParagraph).toContain('practice is strongly recommended')
    expect(fb.homeworkRecommendation).toContain('bite-point')
  })
})
