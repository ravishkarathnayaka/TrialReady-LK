import { SRI_LANKA_DMT_QUESTION_BANK } from '../../theory/data/sriLankaQuestionBank'
import type { TheoryQuestion, TheoryQuestionCategory } from '../../theory/types/theory'

export interface CategoryDiagnosis {
  category: TheoryQuestionCategory
  categoryLabel: string
  accuracyPercentage: number
  totalAnswered: number
  status: 'proficient' | 'needs_review' | 'critical_weakness'
}

export interface DiagnosticResult {
  overallAccuracy: number
  identifiedWeaknesses: CategoryDiagnosis[]
  remedialQuizQuestions: TheoryQuestion[]
  aiSummaryRecommendation: string
}

export const CATEGORY_LABELS: Record<TheoryQuestionCategory, string> = {
  road_signs_regulatory: 'Mandatory & Regulatory Signs (Red Circles)',
  road_signs_warning: 'Hazard & Warning Signs (Red Triangles)',
  road_signs_informative: 'Informative & Directional Signs (Blue/Green)',
  priority_and_junctions: 'Priority at Junctions & Roundabouts',
  general_road_safety: 'General Traffic Rules & Safety',
  vehicle_mechanics_controls: 'Vehicle Controls, Dashboard & Maintenance',
}

export function diagnoseMockExamPerformance(
  answers: { questionId: string; selectedOptionIndex: number; isCorrect: boolean }[],
): DiagnosticResult {
  const categoryStats: Record<
    TheoryQuestionCategory,
    { total: number; correct: number }
  > = {
    road_signs_regulatory: { total: 0, correct: 0 },
    road_signs_warning: { total: 0, correct: 0 },
    road_signs_informative: { total: 0, correct: 0 },
    priority_and_junctions: { total: 0, correct: 0 },
    general_road_safety: { total: 0, correct: 0 },
    vehicle_mechanics_controls: { total: 0, correct: 0 },
  }

  // Aggregate user answer statistics by category
  for (const ans of answers) {
    const q = SRI_LANKA_DMT_QUESTION_BANK.find((item) => item.id === ans.questionId)
    if (q) {
      categoryStats[q.category].total += 1
      if (ans.isCorrect) {
        categoryStats[q.category].correct += 1
      }
    }
  }

  // Compute breakdown
  const identifiedWeaknesses: CategoryDiagnosis[] = []
  let totalAnsweredAll = 0
  let totalCorrectAll = 0

  const categories = Object.keys(categoryStats) as TheoryQuestionCategory[]

  for (const cat of categories) {
    const stat = categoryStats[cat]
    if (stat.total > 0) {
      totalAnsweredAll += stat.total
      totalCorrectAll += stat.correct
      const accuracy = Math.round((stat.correct / stat.total) * 100)

      let status: CategoryDiagnosis['status'] = 'proficient'
      if (accuracy < 50) {
        status = 'critical_weakness'
      } else if (accuracy < 75) {
        status = 'needs_review'
      }

      identifiedWeaknesses.push({
        category: cat,
        categoryLabel: CATEGORY_LABELS[cat] || cat,
        accuracyPercentage: accuracy,
        totalAnswered: stat.total,
        status,
      })
    }
  }

  const overallAccuracy =
    totalAnsweredAll > 0
      ? Math.round((totalCorrectAll / totalAnsweredAll) * 100)
      : 80

  // Filter weak categories for remedial quiz selection
  const weakCategoryKeys = identifiedWeaknesses
    .filter((w) => w.status !== 'proficient')
    .map((w) => w.category)

  let targetedPool: TheoryQuestion[] = []

  if (weakCategoryKeys.length > 0) {
    targetedPool = SRI_LANKA_DMT_QUESTION_BANK.filter((q) =>
      weakCategoryKeys.includes(q.category),
    )
  } else {
    // If user is proficient in all, pick from challenging priority & regulatory questions
    targetedPool = SRI_LANKA_DMT_QUESTION_BANK.filter(
      (q) => q.category === 'priority_and_junctions' || q.category === 'road_signs_regulatory',
    )
  }

  // Shuffle and take up to 10 questions for the adaptive remedial quiz
  const shuffled = [...targetedPool].sort(() => 0.5 - Math.random())
  const remedialQuizQuestions = shuffled.slice(0, Math.min(10, shuffled.length))

  let aiSummaryRecommendation = ''
  const critical = identifiedWeaknesses.filter((w) => w.status === 'critical_weakness')
  if (critical.length > 0) {
    const list = critical.map((c) => c.categoryLabel).join(', ')
    aiSummaryRecommendation = `AI Diagnosis: Significant knowledge gaps identified in [${list}]. An adaptive 10-question drill has been generated to reinforce these specific topics.`
  } else if (weakCategoryKeys.length > 0) {
    aiSummaryRecommendation = `AI Diagnosis: Moderate review recommended for [${weakCategoryKeys.map((c) => CATEGORY_LABELS[c]).join(', ')}]. Practice the remedial drill to solidify your 85%+ target.`
  } else {
    aiSummaryRecommendation = 'AI Diagnosis: Exceptional theoretical comprehension! High mastery across all DMT Highway Code categories. Keep up the great work.'
  }

  return {
    overallAccuracy,
    identifiedWeaknesses,
    remedialQuizQuestions,
    aiSummaryRecommendation,
  }
}
