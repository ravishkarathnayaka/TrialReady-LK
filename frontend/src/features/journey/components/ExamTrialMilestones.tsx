import React, { useState } from 'react'
import type {
  ExamType,
  SaveExamTrialInput,
  StudentExamTrial,
} from '../types/journey'
import ExamTrialModal from './ExamTrialModal'

interface ExamTrialMilestonesProps {
  studentId: string
  drivingSchoolId: string
  theoryExams: StudentExamTrial[]
  practicalTrials: StudentExamTrial[]
  onSaveExamTrial: (input: SaveExamTrialInput) => Promise<void>
}

export const ExamTrialMilestones: React.FC<ExamTrialMilestonesProps> = ({
  studentId,
  drivingSchoolId,
  theoryExams,
  practicalTrials,
  onSaveExamTrial,
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalExamType, setModalExamType] = useState<ExamType>('theory')
  const [modalAttemptCount, setModalAttemptCount] = useState(0)

  const handleOpenSchedule = (type: ExamType, count: number) => {
    setModalExamType(type)
    setModalAttemptCount(count)
    setModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
            ✓ Passed
          </span>
        )
      case 'failed':
        return (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
            ✕ Failed
          </span>
        )
      case 'scheduled':
        return (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
            Scheduled
          </span>
        )
      default:
        return (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* 1. Theory Exam Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-xl border border-purple-100">
              📖
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                DMT Theory Exam
              </h3>
              <p className="text-xs text-slate-500">
                Computerized Road Rules Test
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenSchedule('theory', theoryExams.length)}
            className="rounded-xl border border-purple-200 bg-purple-50/60 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-all cursor-pointer"
          >
            + Schedule Theory
          </button>
        </div>

        {theoryExams.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
            No theory exams recorded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {theoryExams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">
                    Attempt #{exam.attempt_number} • {exam.scheduled_date}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {exam.location || 'DMT Center'}
                    {exam.score !== null ? ` • Score: ${exam.score}%` : ''}
                  </p>
                </div>
                {getStatusBadge(exam.status)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Practical Trial Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-xl border border-amber-100">
              🎯
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                DMT Practical Trial
              </h3>
              <p className="text-xs text-slate-500">
                Final Practical Driving Test
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleOpenSchedule('practical_trial', practicalTrials.length)
            }
            className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-all cursor-pointer"
          >
            + Schedule Trial
          </button>
        </div>

        {practicalTrials.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
            No practical trials recorded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {practicalTrials.map((trial) => (
              <div
                key={trial.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">
                    Trial #{trial.attempt_number} • {trial.scheduled_date}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {trial.location || 'Werahera DMT'}
                  </p>
                  {trial.examiner_notes && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Notes: {trial.examiner_notes}
                    </p>
                  )}
                </div>
                {getStatusBadge(trial.status)}
              </div>
            ))}
          </div>
        )}
      </div>

      <ExamTrialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        studentId={studentId}
        drivingSchoolId={drivingSchoolId}
        defaultExamType={modalExamType}
        existingAttemptCount={modalAttemptCount}
        onSave={onSaveExamTrial}
      />
    </div>
  )
}

export default ExamTrialMilestones
