import React from 'react'
import type { StudentLogbookData } from '../types/logbook'

interface DmtStudentLogbookDocumentProps {
  data: StudentLogbookData
}

export const DmtStudentLogbookDocument: React.FC<DmtStudentLogbookDocumentProps> = ({
  data,
}) => {
  const today = new Date().toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-white text-slate-900 text-[11px] leading-relaxed print:text-[10px]">
      {/* Document Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-4">
        <div className="text-center space-y-1">
          <p className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase">
            Department of Motor Traffic — Sri Lanka
          </p>
          <h1 className="text-lg font-black tracking-tight">
            Official Practical Training Logbook
          </h1>
          <p className="text-[10px] text-slate-600 font-mono">
            Document Reference: DMT/SL/LOG-01
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
          <div className="space-y-0.5">
            <p className="font-black text-sm">{data.school.schoolName}</p>
            <p className="text-[10px] text-slate-600">
              Reg. No: {data.school.registrationNumber}
            </p>
            <p className="text-[10px] text-slate-500">{data.school.address}</p>
            <p className="text-[10px] text-slate-500">Tel: {data.school.phone}</p>
          </div>
          <div className="h-16 w-16 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-[8px] text-slate-400 font-bold text-center">
            Official<br />Seal
          </div>
        </div>
      </div>

      {/* Section 1: Candidate Details */}
      <div className="mb-4">
        <h2 className="text-xs font-black text-slate-800 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wider">
          Section 1: Candidate Personal Details
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
          <div className="flex gap-1">
            <span className="font-bold text-slate-600 w-28 shrink-0">Full Name:</span>
            <span className="font-black border-b border-dotted border-slate-400 flex-1">{data.student.fullName}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold text-slate-600 w-28 shrink-0">Admission No:</span>
            <span className="font-black border-b border-dotted border-slate-400 flex-1">{data.student.admissionNumber}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold text-slate-600 w-28 shrink-0">NIC / Passport:</span>
            <span className="font-black border-b border-dotted border-slate-400 flex-1">{data.student.nicPassport}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold text-slate-600 w-28 shrink-0">Contact No:</span>
            <span className="border-b border-dotted border-slate-400 flex-1">{data.student.phone}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold text-slate-600 w-28 shrink-0">Registered Branch:</span>
            <span className="border-b border-dotted border-slate-400 flex-1">{data.student.branchName}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold text-slate-600 w-28 shrink-0">Registration Date:</span>
            <span className="border-b border-dotted border-slate-400 flex-1">{data.student.registrationDate}</span>
          </div>
          {data.licenceCategory && (
            <div className="flex gap-1 col-span-2">
              <span className="font-bold text-slate-600 w-28 shrink-0">Licence Category:</span>
              <span className="font-black border-b border-dotted border-slate-400 flex-1">
                Class {data.licenceCategory.code} — {data.licenceCategory.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: DMT Learner Permit & NTMI Medical */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="border border-slate-300 rounded-lg p-3">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-700 mb-2">
            DMT Learner Permit
          </h3>
          {data.permit ? (
            <div className="space-y-1">
              <p><span className="font-bold text-slate-500">Permit No:</span> <span className="font-black">{data.permit.permitNumber}</span></p>
              <p><span className="font-bold text-slate-500">Issued:</span> {data.permit.issueDate}</p>
              <p><span className="font-bold text-slate-500">Expiry:</span> <span className="font-black text-red-700">{data.permit.expiryDate}</span></p>
              <p><span className="font-bold text-slate-500">Status:</span>{' '}
                <span className={`font-black ${data.permit.status === 'active' ? 'text-emerald-700' : 'text-red-700'}`}>
                  {data.permit.status.toUpperCase()}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-slate-400 italic">Not recorded</p>
          )}
        </div>
        <div className="border border-slate-300 rounded-lg p-3">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-700 mb-2">
            NTMI Medical Certificate
          </h3>
          {data.medical ? (
            <div className="space-y-1">
              <p><span className="font-bold text-slate-500">Certificate No:</span> <span className="font-black">{data.medical.certificateNumber}</span></p>
              <p><span className="font-bold text-slate-500">NTMI Branch:</span> {data.medical.ntmiBranch}</p>
              <p><span className="font-bold text-slate-500">Expiry:</span> {data.medical.expiryDate}</p>
              <p><span className="font-bold text-slate-500">Status:</span>{' '}
                <span className={`font-black ${data.medical.status === 'passed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {data.medical.status.toUpperCase()}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-slate-400 italic">Not recorded</p>
          )}
        </div>
      </div>

      {/* Section 3: Theory Examination Record */}
      {data.theoryExams.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-black text-slate-800 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wider">
            Section 3: DMT Theory Examination Record
          </h2>
          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="border border-slate-300 px-2 py-1 font-bold">Exam Type</th>
                <th className="border border-slate-300 px-2 py-1 font-bold">Attempt</th>
                <th className="border border-slate-300 px-2 py-1 font-bold">Date</th>
                <th className="border border-slate-300 px-2 py-1 font-bold">Location</th>
                <th className="border border-slate-300 px-2 py-1 font-bold">Score</th>
                <th className="border border-slate-300 px-2 py-1 font-bold">Result</th>
              </tr>
            </thead>
            <tbody>
              {data.theoryExams.map((exam, i) => (
                <tr key={i} className="even:bg-slate-50">
                  <td className="border border-slate-300 px-2 py-1 capitalize">{exam.examType}</td>
                  <td className="border border-slate-300 px-2 py-1 text-center">{exam.attemptNumber}</td>
                  <td className="border border-slate-300 px-2 py-1">{exam.scheduledDate}</td>
                  <td className="border border-slate-300 px-2 py-1">{exam.location}</td>
                  <td className="border border-slate-300 px-2 py-1 text-center font-bold">{exam.score ?? '—'}%</td>
                  <td className="border border-slate-300 px-2 py-1 text-center">
                    <span className={`font-black ${exam.status === 'passed' ? 'text-emerald-700' : 'text-red-600'}`}>
                      {exam.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Section 4: Practical Driving Session Log */}
      <div className="mb-4">
        <h2 className="text-xs font-black text-slate-800 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wider">
          Section 4: Chronological Practical Driving Sessions Log
        </h2>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="border border-slate-300 px-1.5 py-1 font-bold w-6">#</th>
              <th className="border border-slate-300 px-1.5 py-1 font-bold">Date</th>
              <th className="border border-slate-300 px-1.5 py-1 font-bold">Time</th>
              <th className="border border-slate-300 px-1.5 py-1 font-bold">Hrs</th>
              <th className="border border-slate-300 px-1.5 py-1 font-bold">Vehicle</th>
              <th className="border border-slate-300 px-1.5 py-1 font-bold">Instructor</th>
              <th className="border border-slate-300 px-1.5 py-1 font-bold">DMT Maneuvers Covered</th>
              <th className="border border-slate-300 px-1.5 py-1 font-bold w-12">Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.sessions.map((session, i) => (
              <tr key={i} className="even:bg-slate-50">
                <td className="border border-slate-300 px-1.5 py-1 text-center font-mono">{i + 1}</td>
                <td className="border border-slate-300 px-1.5 py-1">{session.sessionDate}</td>
                <td className="border border-slate-300 px-1.5 py-1 font-mono">
                  {session.startTime}–{session.endTime}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-bold">
                  {(session.durationMinutes / 60).toFixed(1)}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 font-mono">{session.vehicleRegistration}</td>
                <td className="border border-slate-300 px-1.5 py-1">{session.instructorName}</td>
                <td className="border border-slate-300 px-1.5 py-1">
                  {session.skillsCovered.join(', ')}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center">
                  {session.studentRating ? `${'★'.repeat(session.studentRating)}${'☆'.repeat(5 - session.studentRating)}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 5: Summary & Certification */}
      <div className="mb-4 border-2 border-slate-900 rounded-lg p-4">
        <h2 className="text-xs font-black text-slate-800 mb-3 uppercase tracking-wider">
          Section 5: Summary & Certification
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center border border-slate-300 rounded-lg p-3 bg-slate-50">
            <span className="text-[10px] font-bold text-slate-500 block">Total Practical Hours</span>
            <p className="text-xl font-black text-slate-900">{data.totalPracticalHours} hrs</p>
            <span className="text-[9px] text-slate-400">{data.totalCompletedSessions} sessions completed</span>
          </div>
          <div className="text-center border border-slate-300 rounded-lg p-3 bg-slate-50">
            <span className="text-[10px] font-bold text-slate-500 block">AI Trial Readiness</span>
            <p className="text-xl font-black text-emerald-700">{data.aiReadinessScore}%</p>
            <span className="text-[9px] font-bold text-emerald-600">{data.readinessTier}</span>
          </div>
          <div className="text-center border border-slate-300 rounded-lg p-3 bg-slate-50">
            <span className="text-[10px] font-bold text-slate-500 block">Document Generated</span>
            <p className="text-sm font-bold text-slate-800">{today}</p>
          </div>
        </div>

        {/* Signature Block */}
        <div className="grid grid-cols-2 gap-8 mt-6 pt-4 border-t border-slate-300">
          <div className="space-y-8">
            <div className="border-b border-slate-900 w-full" />
            <p className="text-[10px] font-bold text-slate-600 text-center">
              Signature of Principal Instructor
            </p>
          </div>
          <div className="space-y-8">
            <div className="border-b border-slate-900 w-full" />
            <p className="text-[10px] font-bold text-slate-600 text-center">
              Official Stamp & Date
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[8px] text-slate-400 border-t border-slate-200 pt-2">
        <p>This document is generated by TrialReady LK — Driving Academy Management System</p>
        <p>Document Reference: DMT/SL/LOG-01 • {data.school.schoolName} • {data.school.registrationNumber}</p>
      </div>
    </div>
  )
}

export default DmtStudentLogbookDocument
