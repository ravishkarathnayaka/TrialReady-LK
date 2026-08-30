import React from 'react'
import type { StudentExamTrial, StudentMedicalRecord, StudentPermit } from '../../../journey/types/journey'
import { calculatePermitValidity } from '../../../journey/utils/journeyUtils'

interface StudentJourneyHeroCardProps {
  student: {
    id: string
    full_name: string
    admission_number: string
    phone: string | null
    branch_name?: string
  }
  permit: StudentPermit | null
  medical: StudentMedicalRecord | null
  theoryExams: StudentExamTrial[]
}

export const StudentJourneyHeroCard: React.FC<StudentJourneyHeroCardProps> = ({
  student,
  permit,
  medical,
  theoryExams,
}) => {
  const permitVal = calculatePermitValidity(permit?.expiry_date)
  const passedTheory = theoryExams.find((e) => e.status === 'passed')

  return (
    <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 p-6 text-white shadow-xl sm:p-8">
      {/* Top Greeting */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
            Learner Student Portal
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl text-white">
            Welcome, {student.full_name}
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            Admission: <strong className="font-mono text-white">{student.admission_number}</strong> • Branch: {student.branch_name || 'Main Branch'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-xs border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">
              DMT Target
            </span>
            <span className="text-sm font-black text-emerald-400">
              Driving Licence
            </span>
          </div>
        </div>
      </div>

      {/* 3 DMT Pre-requisite Badges */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* 1. Learner Permit */}
        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xs border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">📄 DMT Permit</span>
            <span
              className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                permitVal.state === 'valid'
                  ? 'bg-emerald-400/20 text-emerald-300'
                  : permitVal.state === 'expiring_soon'
                    ? 'bg-amber-400/20 text-amber-300'
                    : 'bg-red-400/20 text-red-300'
              }`}
            >
              {permitVal.label}
            </span>
          </div>
          <p className="font-mono font-bold text-white text-sm">
            {permit ? permit.permit_number : 'Not Applied'}
          </p>
          <p className="text-[11px] text-slate-400">
            {permit ? `Valid until ${permit.expiry_date}` : 'Contact academy'}
          </p>
        </div>

        {/* 2. NTMI Medical */}
        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xs border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">🏥 NTMI Medical</span>
            <span
              className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                medical?.status === 'passed'
                  ? 'bg-emerald-400/20 text-emerald-300'
                  : 'bg-slate-400/20 text-slate-300'
              }`}
            >
              {medical?.status === 'passed' ? '✓ Cleared' : 'Pending'}
            </span>
          </div>
          <p className="font-mono font-bold text-white text-sm">
            {medical?.certificate_number || 'Pending Certificate'}
          </p>
          <p className="text-[11px] text-slate-400">
            {medical?.ntmi_branch || 'NTMI Testing Center'}
          </p>
        </div>

        {/* 3. Theory Exam */}
        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xs border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">📖 Theory Exam</span>
            <span
              className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                passedTheory
                  ? 'bg-emerald-400/20 text-emerald-300'
                  : 'bg-blue-400/20 text-blue-300'
              }`}
            >
              {passedTheory ? '✓ Passed' : 'In Progress'}
            </span>
          </div>
          <p className="font-bold text-white text-sm">
            {passedTheory
              ? `Score: ${passedTheory.score || 85}%`
              : 'Highway Rules & Signs'}
          </p>
          <p className="text-[11px] text-slate-400">
            {passedTheory ? `Passed on ${passedTheory.scheduled_date}` : 'Computerized DMT Test'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StudentJourneyHeroCard
