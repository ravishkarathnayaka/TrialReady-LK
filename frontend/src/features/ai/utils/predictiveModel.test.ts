import { describe, it, expect } from 'vitest'
import { predictTrialOutcome } from './predictiveModel'

describe('predictiveModel', () => {
  it('calculates high pass probability for well-prepared candidate', () => {
    const result = predictTrialOutcome({
      practicalHours: 15,
      skillsCovered: [
        'Hill Start / Gradient',
        'Reverse S-Bend',
        'Parallel Parking',
        '3-Point Turn',
        'Traffic',
        'Clutch Control',
        'Emergency Braking',
      ],
      averageRating: 4.8,
      permitDaysRemaining: 75,
      hasMedicalCleared: true,
      hasTheoryPassed: true,
    })

    expect(result.passProbability).toBeGreaterThanOrEqual(80)
    expect(result.predictedOutcome).toBe('high_probability_pass')
    expect(result.confidenceScore).toBeGreaterThanOrEqual(80)
    expect(result.maneuverRisks).toHaveLength(5)
    expect(result.recommendedMockSessionsCount).toBe(1)
  })

  it('calculates low probability and flags high risk for candidate with low hours and unmastered maneuvers', () => {
    const result = predictTrialOutcome({
      practicalHours: 3,
      skillsCovered: ['Basic Steering'],
      averageRating: 2.0,
      permitDaysRemaining: 90,
      hasMedicalCleared: false,
      hasTheoryPassed: false,
      previousTrialFailuresCount: 1,
    })

    expect(result.passProbability).toBeLessThan(50)
    expect(result.predictedOutcome).toBe('at_risk_failure')
    expect(result.maneuverRisks.some((m) => m.riskLevel === 'high')).toBe(true)
    expect(result.recommendedMockSessionsCount).toBe(4)
  })

  it('sets pass probability to 0 when permit is expired', () => {
    const result = predictTrialOutcome({
      practicalHours: 15,
      skillsCovered: ['Hill Start', 'Reverse S-Bend'],
      averageRating: 5.0,
      permitDaysRemaining: -10, // Expired
      hasMedicalCleared: true,
      hasTheoryPassed: true,
    })

    expect(result.passProbability).toBe(0)
  })
})
