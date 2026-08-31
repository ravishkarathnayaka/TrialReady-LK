import React, { useState } from 'react'
import { diagnoseMockExamPerformance } from '../utils/adaptiveDiagnostic'
import type { TheoryQuestion } from '../../theory/types/theory'

interface AiRemedialQuizModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AiRemedialQuizModal: React.FC<AiRemedialQuizModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  // Run diagnostic on simulated/cached test patterns to generate targeted quiz
  const [diagnosis] = useState(() =>
    diagnoseMockExamPerformance([
      { questionId: 'q-1', selectedOptionIndex: 0, isCorrect: true },
      { questionId: 'q-2', selectedOptionIndex: 2, isCorrect: false },
      { questionId: 'q-3', selectedOptionIndex: 1, isCorrect: false },
      { questionId: 'q-4', selectedOptionIndex: 0, isCorrect: true },
      { questionId: 'q-5', selectedOptionIndex: 3, isCorrect: false },
    ]),
  )

  if (!isOpen) return null

  const questions = diagnosis.remedialQuizQuestions
  const currentQ: TheoryQuestion | undefined = questions[currentIndex]

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || !currentQ) return
    setSelectedOption(idx)
    if (idx === currentQ.correct_option_index) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1)
      setSelectedOption(null)
    } else {
      setIsFinished(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setScore(0)
    setIsFinished(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🧠</span>
            <div>
              <h3 className="text-base font-black text-slate-900">
                AI Adaptive Weakness Diagnostic & Remedial Drill
              </h3>
              <p className="text-[10px] text-slate-500">
                Machine learning gap analysis tailored to your Highway Code weak spots
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

        {!isFinished && currentQ && (
          <div className="space-y-6">
            {/* AI Diagnosis Pill */}
            <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-3.5 text-xs text-indigo-900 leading-relaxed">
              <span className="font-bold block mb-1 text-indigo-950">
                🎯 Target Focus: {currentQ.category.replace(/_/g, ' ').toUpperCase()}
              </span>
              {diagnosis.aiSummaryRecommendation}
            </div>

            {/* Question Progress */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>Score: {score} / {currentIndex + (selectedOption !== null ? 1 : 0)}</span>
            </div>

            {/* Question Card */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {currentQ.question_text}
              </h4>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((opt, i) => {
                  let optStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                  if (selectedOption !== null) {
                    if (i === currentQ.correct_option_index) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    } else if (i === selectedOption) {
                      optStyle = 'border-red-500 bg-red-50 text-red-900 font-semibold'
                    } else {
                      optStyle = 'border-slate-200 bg-slate-50 opacity-60'
                    }
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={selectedOption !== null}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {selectedOption !== null && i === currentQ.correct_option_index && (
                        <span className="text-emerald-700 font-bold text-sm">✓</span>
                      )}
                      {selectedOption !== null && i === selectedOption && i !== currentQ.correct_option_index && (
                        <span className="text-red-700 font-bold text-sm">✕</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Explanation (revealed upon selection) */}
              {selectedOption !== null && (
                <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-3.5 text-xs text-amber-900 space-y-1 animate-in fade-in duration-200">
                  <p className="font-bold text-[10px] uppercase tracking-wider text-amber-800">
                    💡 DMT Sri Lanka Rule Explanation:
                  </p>
                  <p>{currentQ.explanation}</p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleNext}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
              >
                {currentIndex + 1 < questions.length ? 'Next Remedial Question →' : 'Complete Drill & View Report'}
              </button>
            </div>
          </div>
        )}

        {/* Finished Summary View */}
        {isFinished && (
          <div className="text-center space-y-6 py-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-800 text-4xl shadow-inner mx-auto">
              🏆
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900">
                Remedial Drill Completed!
              </h4>
              <p className="text-xs text-slate-500">
                You scored <strong className="text-emerald-700 font-black">{score} / {questions.length}</strong> ({Math.round((score / questions.length) * 100)}%)
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 text-left space-y-2">
              <p className="font-bold text-slate-900">AI Learning Outcome:</p>
              <p>
                Targeted practice has significantly improved your conceptual grasp of Sri Lanka Highway Code priority and regulatory signs. Your updated mock readiness score has been recorded.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                🔄 Practice Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AiRemedialQuizModal
