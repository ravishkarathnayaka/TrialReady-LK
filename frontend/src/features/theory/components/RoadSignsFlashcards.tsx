import React, { useState } from 'react'
import { SRI_LANKA_DMT_QUESTION_BANK } from '../data/sriLankaQuestionBank'

export const RoadSignsFlashcards: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const filteredQuestions = SRI_LANKA_DMT_QUESTION_BANK.filter((q) => {
    if (categoryFilter === 'all') return true
    return q.category === categoryFilter
  })

  const currentQ = filteredQuestions[currentCardIndex] || filteredQuestions[0]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentCardIndex((prev) => (prev + 1) % filteredQuestions.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentCardIndex(
      (prev) => (prev - 1 + filteredQuestions.length) % filteredQuestions.length,
    )
  }

  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat)
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  if (!currentQ) return null

  const correctOptionText = currentQ.options[currentQ.correct_option_index]

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Categories */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Road Signs & Highway Code Flashcards
          </h3>
          <p className="text-xs text-slate-500">
            Click the flashcard to flip and reveal the official DMT meaning
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Signs
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('road_signs_regulatory')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              categoryFilter === 'road_signs_regulatory'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🛑 Regulatory
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('road_signs_warning')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              categoryFilter === 'road_signs_warning'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⚠️ Warning
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('priority_and_junctions')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              categoryFilter === 'priority_and_junctions'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🚗 Priority
          </button>
        </div>
      </div>

      {/* Interactive Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="group relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-200 bg-linear-to-b from-blue-50/40 to-slate-50 p-8 text-center shadow-inner transition-all hover:border-blue-400"
      >
        <span className="absolute top-4 right-4 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-200 shadow-2xs">
          Card {currentCardIndex + 1} of {filteredQuestions.length} • Click to Flip
        </span>

        {!isFlipped ? (
          <div className="space-y-4">
            {currentQ.image_url && (
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-5xl border border-slate-200 shadow-xs">
                  {currentQ.image_url}
                </div>
              </div>
            )}
            <h4 className="text-base font-bold text-slate-900 max-w-md">
              {currentQ.question_text}
            </h4>
            <span className="inline-block text-xs font-bold text-blue-600 underline">
              Show Meaning & Rule ↓
            </span>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
              ✓ Correct Meaning
            </span>
            <p className="text-lg font-black text-slate-900 max-w-md">
              {correctOptionText}
            </p>
            <p className="text-xs text-slate-600 max-w-md bg-white p-3 rounded-xl border border-slate-200">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrev}
          className="rounded-2xl border border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          ← Previous Sign
        </button>

        <span className="text-xs font-mono font-bold text-slate-500">
          {currentCardIndex + 1} / {filteredQuestions.length}
        </span>

        <button
          type="button"
          onClick={handleNext}
          className="rounded-2xl bg-blue-600 px-6 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
        >
          Next Sign →
        </button>
      </div>
    </div>
  )
}

export default RoadSignsFlashcards
