import { describe, it, expect } from 'vitest'
import { diagnoseMockExamPerformance } from './adaptiveDiagnostic'

describe('adaptiveDiagnostic', () => {
  it('diagnoses weak categories and generates targeted remedial drill', () => {
    // 3 correct, 2 incorrect using verified question bank IDs
    const mockAnswers = [
      { questionId: 'q-reg-01', selectedOptionIndex: 1, isCorrect: true },
      { questionId: 'q-reg-02', selectedOptionIndex: 0, isCorrect: false },
      { questionId: 'q-warn-01', selectedOptionIndex: 1, isCorrect: false },
      { questionId: 'q-prio-01', selectedOptionIndex: 0, isCorrect: true },
      { questionId: 'q-law-01', selectedOptionIndex: 0, isCorrect: true },
    ]

    const diagnosis = diagnoseMockExamPerformance(mockAnswers)

    expect(diagnosis.overallAccuracy).toBe(60) // 3 of 5 is 60%
    expect(diagnosis.identifiedWeaknesses.length).toBeGreaterThan(0)
    expect(diagnosis.remedialQuizQuestions.length).toBeGreaterThan(0)
    expect(diagnosis.remedialQuizQuestions.length).toBeLessThanOrEqual(10)
    expect(diagnosis.aiSummaryRecommendation).toContain('AI Diagnosis')
  })

  it('generates proficient recommendation when accuracy is high', () => {
    const mockAllCorrect = [
      { questionId: 'q-reg-01', selectedOptionIndex: 1, isCorrect: true },
      { questionId: 'q-warn-01', selectedOptionIndex: 0, isCorrect: true },
      { questionId: 'q-prio-01', selectedOptionIndex: 0, isCorrect: true },
    ]

    const diagnosis = diagnoseMockExamPerformance(mockAllCorrect)
    expect(diagnosis.overallAccuracy).toBe(100)
    expect(diagnosis.aiSummaryRecommendation).toContain('Exceptional')
  })
})
