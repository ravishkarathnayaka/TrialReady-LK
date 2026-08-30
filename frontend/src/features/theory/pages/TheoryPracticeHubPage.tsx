import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import { LanguageSelectorPill } from '../components/LanguageSelectorPill'
import { RoadSignsFlashcards } from '../components/RoadSignsFlashcards'
import { TheoryLanguageProvider } from '../context/TheoryLanguageContext'
import { useTheoryHistory } from '../hooks/useTheoryHistory'

interface TheoryPracticeHubPageProps {
  drivingSchoolId: string
  studentId?: string
}

export const TheoryPracticeHubContent: React.FC<
  TheoryPracticeHubPageProps
> = ({ studentId }) => {
  const { user } = useAuth()
  const activeStudentId = studentId || user?.id || 'demo-student'

  const [activeTab, setActiveTab] = useState<'flashcards' | 'history'>(
    'flashcards',
  )

  const {
    attempts,
    totalAttempts,
    passedAttempts,
    passRate,
    averageScore,
    isLoading,
  } = useTheoryHistory(activeStudentId)

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="rounded-3xl border border-blue-200 bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
              DMT Highway Code Practice Center
            </span>
            <LanguageSelectorPill />
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Computerized Mock Exam Simulator
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Practice with authentic Sri Lankan Department of Motor Traffic (DMT) Highway Code questions, road signs, and traffic rules in English, Sinhala (සිංහල), and Tamil (தமிழ்).
          </p>
        </div>

        <div className="shrink-0">
          <Link
            to="/theory/exam"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-black text-slate-900 shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all cursor-pointer"
          >
            <span>📝</span> Start Mock Exam Now
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">
            Tests Attempted
          </span>
          <p className="mt-1.5 text-2xl font-black text-slate-900">
            {totalAttempts}
          </p>
          <span className="text-[10px] text-slate-400">Total Practice Sessions</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">
            Tests Passed
          </span>
          <p className="mt-1.5 text-2xl font-black text-emerald-600">
            {passedAttempts}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">
            ≥ 75% Pass Standard
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">
            Pass Rate
          </span>
          <p className="mt-1.5 text-2xl font-black text-indigo-600">
            {passRate}%
          </p>
          <span className="text-[10px] text-indigo-600 font-bold">
            Success Probability
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">
            Average Score
          </span>
          <p className="mt-1.5 text-2xl font-black text-slate-900">
            {averageScore}%
          </p>
          <span className="text-[10px] text-slate-400">Mean Score</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('flashcards')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'flashcards'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🛑 Road Signs Flashcards & Learning
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📋 Past Mock Test History
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'flashcards' ? (
        <RoadSignsFlashcards />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Loading test history...
            </div>
          ) : attempts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No mock tests attempted yet. Click "Start Mock Exam Now" to test your knowledge!
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Correct Answers</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attempts.map((att, i) => (
                  <tr key={att.id || i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {att.attempted_at.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 font-black text-slate-900">
                      {att.score_percentage}%
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {att.correct_answers_count} / {att.total_questions}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      {Math.floor(att.time_spent_seconds / 60)}m {att.time_spent_seconds % 60}s
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          att.passed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {att.passed ? '✓ PASSED' : '✕ FAILED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export const TheoryPracticeHubPage: React.FC<TheoryPracticeHubPageProps> = (
  props,
) => {
  return (
    <TheoryLanguageProvider>
      <TheoryPracticeHubContent {...props} />
    </TheoryLanguageProvider>
  )
}

export default TheoryPracticeHubPage
