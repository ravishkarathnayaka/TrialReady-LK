export interface ManeuverRisk {
  name: string
  riskPercentage: number
  riskLevel: 'low' | 'moderate' | 'high'
  mitigationAdvice: string
}

export interface TrialPredictionResult {
  passProbability: number // 0 to 100
  confidenceScore: number // 0 to 100
  predictedOutcome: 'high_probability_pass' | 'moderate_pass' | 'at_risk_failure'
  maneuverRisks: ManeuverRisk[]
  optimalTrialDateStart: string
  optimalTrialDateEnd: string
  recommendedMockSessionsCount: number
  keyInsight: string
}

export function predictTrialOutcome(params: {
  practicalHours: number
  skillsCovered: string[]
  averageRating: number | null
  permitDaysRemaining: number
  hasMedicalCleared: boolean
  hasTheoryPassed: boolean
  previousTrialFailuresCount?: number
}): TrialPredictionResult {
  const {
    practicalHours,
    skillsCovered,
    averageRating = 3.5,
    permitDaysRemaining,
    hasMedicalCleared,
    hasTheoryPassed,
    previousTrialFailuresCount = 0,
  } = params

  const rating = averageRating ?? 3.5

  // 1. Base probability weightings
  const hoursWeight = Math.min(practicalHours / 15, 1) * 35 // Max 35%
  const skillsWeight = Math.min(skillsCovered.length / 7, 1) * 30 // Max 30%
  const ratingWeight = ((rating - 1) / 4) * 20 // Max 20%
  const theoryBonus = hasTheoryPassed ? 10 : 0
  const medicalBonus = hasMedicalCleared ? 5 : 0

  let rawProbability = hoursWeight + skillsWeight + ratingWeight + theoryBonus + medicalBonus

  // Penalties
  if (previousTrialFailuresCount > 0) {
    rawProbability = Math.max(10, rawProbability - previousTrialFailuresCount * 8)
  }
  if (permitDaysRemaining < 15 && permitDaysRemaining >= 0) {
    rawProbability = Math.max(15, rawProbability - 5) // Stress factor
  }

  const passProbability =
    permitDaysRemaining < 0 ? 0 : Math.round(Math.max(5, Math.min(98, rawProbability)))

  // 2. Maneuver Risk Modeling
  const hasSkill = (skill: string) => skillsCovered.some((s) => s.toLowerCase().includes(skill.toLowerCase()))

  const maneuverRisks: ManeuverRisk[] = [
    {
      name: 'Hill Start / Gradient Balance',
      riskPercentage: hasSkill('hill') ? Math.max(10, Math.round(45 - rating * 7)) : 75,
      riskLevel: hasSkill('hill') ? (rating >= 4 ? 'low' : 'moderate') : 'high',
      mitigationAdvice: 'Practice biting point handbrake coordination on incline slopes.',
    },
    {
      name: 'Reverse S-Bend (Serpentine)',
      riskPercentage: hasSkill('reverse') ? Math.max(15, Math.round(50 - rating * 7)) : 80,
      riskLevel: hasSkill('reverse') ? (rating >= 4 ? 'low' : 'moderate') : 'high',
      mitigationAdvice: 'Maintain slow clutch crawl speed and monitor side mirror cone distance.',
    },
    {
      name: 'Parallel Parking & Curb Distance',
      riskPercentage: hasSkill('parallel') ? Math.max(12, Math.round(40 - rating * 6)) : 70,
      riskLevel: hasSkill('parallel') ? (rating >= 4 ? 'low' : 'moderate') : 'high',
      mitigationAdvice: 'Align 45-degree angle before locking full wheel to avoid touching curb.',
    },
    {
      name: '3-Point Turn (Narrow Road)',
      riskPercentage: hasSkill('turn') || hasSkill('point') ? Math.max(8, Math.round(35 - rating * 6)) : 60,
      riskLevel: hasSkill('turn') ? 'low' : 'moderate',
      mitigationAdvice: 'Check all blind spots thoroughly before and after every gear change.',
    },
    {
      name: 'City Road Traffic & Roundabouts',
      riskPercentage: hasSkill('traffic') || hasSkill('roundabout') ? Math.max(10, Math.round(35 - rating * 5)) : 55,
      riskLevel: hasSkill('traffic') ? 'low' : 'moderate',
      mitigationAdvice: 'Signal early and always yield to traffic from the right inside roundabouts.',
    },
  ]

  // 3. Predicted outcome tier
  let predictedOutcome: TrialPredictionResult['predictedOutcome'] = 'at_risk_failure'
  if (passProbability >= 80) {
    predictedOutcome = 'high_probability_pass'
  } else if (passProbability >= 60) {
    predictedOutcome = 'moderate_pass'
  }

  // 4. Optimal trial window calculation
  const today = new Date()
  const daysUntilReady = Math.max(7, Math.round((15 - Math.min(practicalHours, 15)) * 2))
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() + daysUntilReady)

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 14)

  const confidenceScore = Math.min(95, Math.round(70 + practicalHours * 1.5))
  const recommendedMockSessionsCount = passProbability >= 85 ? 1 : passProbability >= 65 ? 2 : 4

  let keyInsight = ''
  if (passProbability >= 85) {
    keyInsight = 'Candidate exhibits high practical vehicle mastery and strong readiness across all key DMT checkpoints.'
  } else if (passProbability >= 65) {
    keyInsight = 'Candidate is progressing well but requires targeted practice on higher-risk maneuvers (e.g. Hill Start / Reverse S-Bend).'
  } else {
    keyInsight = 'Significant risk of trial failure due to low practical hours and unpracticed key maneuvers. Trial booking not recommended yet.'
  }

  return {
    passProbability,
    confidenceScore,
    predictedOutcome,
    maneuverRisks,
    optimalTrialDateStart: startDate.toISOString().split('T')[0],
    optimalTrialDateEnd: endDate.toISOString().split('T')[0],
    recommendedMockSessionsCount,
    keyInsight,
  }
}
