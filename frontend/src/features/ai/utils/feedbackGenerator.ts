export interface SessionFeedbackInput {
  studentName: string
  sessionDate: string
  durationMinutes: number
  skillsCovered: string[]
  studentRating: number // 1 to 5
  vehicleReg?: string
  instructorName?: string
}

export interface GeneratedFeedback {
  summaryParagraph: string
  strengths: string[]
  focusAreasForNextLesson: string[]
  homeworkRecommendation: string
  formalInstructorNote: string
}

export function generateAiSessionFeedback(input: SessionFeedbackInput): GeneratedFeedback {
  const {
    studentName,
    sessionDate,
    durationMinutes,
    skillsCovered,
    studentRating,
    vehicleReg = 'Training Vehicle',
    instructorName = 'Principal Instructor',
  } = input

  const hours = (durationMinutes / 60).toFixed(1)
  const skillsList = skillsCovered.length > 0 ? skillsCovered.join(', ') : 'Basic Vehicle Controls & Steering'

  let performanceTone = 'satisfactory'
  if (studentRating >= 4) {
    performanceTone = 'excellent'
  } else if (studentRating <= 2) {
    performanceTone = 'needs_improvement'
  }

  // 1. Summary narrative
  let summaryParagraph = ''
  if (performanceTone === 'excellent') {
    summaryParagraph = `${studentName} demonstrated strong driving competence and confident vehicle control during today's ${hours}-hour session on ${sessionDate}. Successfully executed key maneuvers (${skillsList}) with smooth clutch transition and sharp situational awareness.`
  } else if (performanceTone === 'satisfactory') {
    summaryParagraph = `${studentName} made steady progress in today's ${hours}-hour practical training session (${sessionDate}), focusing on ${skillsList}. Vehicle handling and steering control were consistent, with minor coaching required during complex maneuvers.`
  } else {
    summaryParagraph = `${studentName} completed a ${hours}-hour session on ${sessionDate} covering ${skillsList}. Additional practice is strongly recommended to build muscle memory, reduce hesitation during gear changes, and improve mirror observation.`
  }

  // 2. Strengths
  const strengths: string[] = []
  if (skillsCovered.some((s) => s.toLowerCase().includes('hill'))) {
    strengths.push('Incline gradient balance and handbrake timing')
  }
  if (skillsCovered.some((s) => s.toLowerCase().includes('reverse') || s.toLowerCase().includes('parking'))) {
    strengths.push('Spatial orientation and mirror scanning during reversing')
  }
  if (skillsCovered.some((s) => s.toLowerCase().includes('clutch') || s.toLowerCase().includes('gear'))) {
    strengths.push('Smooth clutch pedal engagement and progressive braking')
  }
  if (strengths.length === 0) {
    strengths.push('Attentive listening to instructor instructions', 'Correct cockpit drill and seatbelt discipline')
  }

  // 3. Focus areas for next session
  const focusAreasForNextLesson: string[] = []
  if (!skillsCovered.some((s) => s.toLowerCase().includes('hill'))) {
    focusAreasForNextLesson.push('Hill Start on gradient slopes with zero rollback')
  }
  if (!skillsCovered.some((s) => s.toLowerCase().includes('reverse'))) {
    focusAreasForNextLesson.push('Reverse S-Bend serpentine path between cones')
  }
  if (focusAreasForNextLesson.length === 0) {
    focusAreasForNextLesson.push('Live city traffic navigation and roundabout entry right-of-way', 'Emergency braking reaction time')
  }

  // 4. Homework / revision
  const homeworkRecommendation =
    studentRating >= 4
      ? 'Review Highway Code roundabout lane discipline and road signs in the TrialReady practice hub.'
      : 'Review DMT Hill Start bite-point principles and watch the maneuver tutorial before next week’s lesson.'

  // 5. Formal DMT logbook note
  const formalInstructorNote = `[Verified Session: ${sessionDate}] ${hours} hrs logged in ${vehicleReg}. Skills: ${skillsList}. Competency rating: ${studentRating}/5. Evaluated by ${instructorName}.`

  return {
    summaryParagraph,
    strengths,
    focusAreasForNextLesson,
    homeworkRecommendation,
    formalInstructorNote,
  }
}
