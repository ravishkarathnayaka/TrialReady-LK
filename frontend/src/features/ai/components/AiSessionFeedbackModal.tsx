import React, { useState } from 'react'
import { generateAiSessionFeedback, type GeneratedFeedback } from '../utils/feedbackGenerator'

interface AiSessionFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  sessionDate: string
  durationMinutes: number
  skillsCovered: string[]
  studentRating: number
  vehicleReg?: string
  instructorName?: string
}

export const AiSessionFeedbackModal: React.FC<AiSessionFeedbackModalProps> = ({
  isOpen,
  onClose,
  studentName,
  sessionDate,
  durationMinutes,
  skillsCovered,
  studentRating,
  vehicleReg,
  instructorName,
}) => {
  const [feedback, setFeedback] = useState<GeneratedFeedback>(() =>
    generateAiSessionFeedback({
      studentName,
      sessionDate,
      durationMinutes,
      skillsCovered,
      studentRating,
      vehicleReg,
      instructorName,
    }),
  )
  const [isCopied, setIsCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = () => {
    const textToCopy = `📋 SESSION EVALUATION REPORT\nStudent: ${studentName}\nDate: ${sessionDate} (${(durationMinutes / 60).toFixed(1)} hrs)\n\n${feedback.summaryParagraph}\n\nSTRENGTHS:\n${feedback.strengths.map((s) => `• ${s}`).join('\n')}\n\nFOCUS AREAS:\n${feedback.focusAreasForNextLesson.map((f) => `• ${f}`).join('\n')}\n\nRECOMMENDED REVISION:\n${feedback.homeworkRecommendation}\n\nLOGBOOK NOTE:\n${feedback.formalInstructorNote}`

    void navigator.clipboard.writeText(textToCopy)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2500)
  }

  const handleRegenerate = () => {
    setFeedback(
      generateAiSessionFeedback({
        studentName,
        sessionDate,
        durationMinutes,
        skillsCovered,
        studentRating,
        vehicleReg,
        instructorName,
      }),
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📝</span>
            <div>
              <h3 className="text-base font-black text-slate-900">
                AI Practical Session Evaluation Synthesizer
              </h3>
              <p className="text-[10px] text-slate-500">
                Automated natural language report synthesized for {studentName} ({sessionDate})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Evaluation Summary Paragraph */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Synthesized Evaluation Summary
          </label>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-800 leading-relaxed">
            {feedback.summaryParagraph}
          </div>
        </div>

        {/* Strengths & Next Lesson Focus 2-Column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
              <span>✓</span> Strengths Observed
            </h4>
            <ul className="text-xs text-emerald-950 space-y-1">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
              <span>🎯</span> Next Lesson Focus Drill
            </h4>
            <ul className="text-xs text-amber-950 space-y-1">
              {feedback.focusAreasForNextLesson.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Homework Recommendation */}
        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-3.5 text-xs text-blue-900 space-y-1">
          <span className="font-bold text-[10px] uppercase tracking-wider text-blue-800 block">
            💡 Recommended Student Homework:
          </span>
          <p>{feedback.homeworkRecommendation}</p>
        </div>

        {/* Formal Logbook Note */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Official Logbook Entry Note
          </label>
          <div className="rounded-xl bg-slate-900 text-slate-200 p-3 font-mono text-[11px] select-all">
            {feedback.formalInstructorNote}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={handleRegenerate}
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🔄</span> Regenerate
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>{isCopied ? '✓' : '📋'}</span>
              <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Complete Report'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiSessionFeedbackModal
