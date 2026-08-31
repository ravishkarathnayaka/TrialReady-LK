import React from 'react'
import type { TrialAdmissionSlipData } from '../types/logbook'

interface DmtTrialAdmissionSlipProps {
  data: TrialAdmissionSlipData
}

export const DmtTrialAdmissionSlip: React.FC<DmtTrialAdmissionSlipProps> = ({
  data,
}) => {
  return (
    <div className="bg-white text-slate-900 text-[11px] leading-relaxed print:text-[10px]">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
        <p className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase">
          Department of Motor Traffic — Sri Lanka
        </p>
        <h1 className="text-lg font-black tracking-tight">
          Practical Driving Trial — Candidate Admission Slip
        </h1>
        <p className="text-[10px] text-slate-600 font-mono">
          Document Reference: DMT/SL/ADM-PASS
        </p>
      </div>

      {/* Academy & Candidate */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="border border-slate-300 rounded-lg p-3">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
            Driving Academy
          </h3>
          <p className="font-black text-sm">{data.school.schoolName}</p>
          <p className="text-[10px] text-slate-600">Reg. No: {data.school.registrationNumber}</p>
          <p className="text-[10px] text-slate-500">{data.school.address}</p>
        </div>
        <div className="border border-slate-300 rounded-lg p-3">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
            Candidate Details
          </h3>
          <p className="font-black text-sm">{data.student.fullName}</p>
          <p><span className="font-bold text-slate-500">NIC:</span> {data.student.nicPassport}</p>
          <p><span className="font-bold text-slate-500">Admission No:</span> {data.student.admissionNumber}</p>
          <p><span className="font-bold text-slate-500">Contact:</span> {data.student.phone}</p>
        </div>
      </div>

      {/* Trial Details */}
      <div className="border-2 border-blue-900 rounded-lg p-4 mb-4 bg-blue-50/40">
        <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-3 text-center">
          Examination Details
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <div className="flex gap-1">
            <span className="font-bold text-slate-600 w-32 shrink-0">Trial Ground:</span>
            <span className="font-black">{data.trialGroundLocation}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold text-slate-600 w-32 shrink-0">Examination Date:</span>
            <span className="font-black">{data.trialDate}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold text-slate-600 w-32 shrink-0">Reporting Time:</span>
            <span className="font-black text-red-700">{data.reportingTime}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold text-slate-600 w-32 shrink-0">Test Vehicle:</span>
            <span className="font-mono font-black">{data.testVehicleRegistration}</span>
          </div>
          {data.licenceCategory && (
            <div className="flex gap-1 col-span-2">
              <span className="font-bold text-slate-600 w-32 shrink-0">Licence Category:</span>
              <span className="font-black">Class {data.licenceCategory.code} — {data.licenceCategory.name}</span>
            </div>
          )}
          <div className="flex gap-1">
            <span className="font-bold text-slate-600 w-32 shrink-0">DMT Permit No:</span>
            <span className="font-black">{data.permit?.permitNumber ?? '—'}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold text-slate-600 w-32 shrink-0">Practical Hours:</span>
            <span className="font-black">{data.totalPracticalHours} hrs</span>
          </div>
        </div>
      </div>

      {/* Readiness Certification */}
      <div className="border border-emerald-400 rounded-lg p-3 mb-4 bg-emerald-50/40 text-center">
        <span className="text-[10px] font-bold text-emerald-800 block">AI Trial Readiness Certification</span>
        <p className="text-2xl font-black text-emerald-800">{data.aiReadinessScore}% — {data.readinessTier}</p>
      </div>

      {/* Required Documents Checklist */}
      <div className="mb-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">
          Required Documents Checklist (Trial Day)
        </h3>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          {[
            'Original National Identity Card (NIC)',
            'Original DMT Learner Permit',
            'Original NTMI Medical Fitness Certificate',
            'Driving Academy Training Logbook (DMT/SL/LOG-01)',
            'This Admission Slip (DMT/SL/ADM-PASS)',
            'Two (2) Passport-size Photographs',
          ].map((doc, i) => (
            <div key={i} className="flex items-center gap-2 border border-slate-200 rounded-md px-2 py-1.5">
              <span className="h-3.5 w-3.5 border border-slate-400 rounded-sm shrink-0 flex items-center justify-center text-[8px]">
                ☐
              </span>
              <span>{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DMT Examiner On-Site Evaluation Scorecard */}
      <div className="mb-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">
          DMT Examiner On-Site Evaluation Scorecard
        </h3>
        <p className="text-[9px] text-slate-400 mb-2 italic">
          (To be completed by the DMT Examiner at the Practical Test Center)
        </p>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 px-2 py-1.5 text-left font-bold w-6">#</th>
              <th className="border border-slate-300 px-2 py-1.5 text-left font-bold">Evaluation Maneuver</th>
              <th className="border border-slate-300 px-2 py-1.5 text-center font-bold w-16">Pass</th>
              <th className="border border-slate-300 px-2 py-1.5 text-center font-bold w-16">Fail</th>
              <th className="border border-slate-300 px-2 py-1.5 text-left font-bold">Examiner Remarks</th>
            </tr>
          </thead>
          <tbody>
            {[
              'Hill Start / Gradient Control',
              'Reverse S-Bend (Serpentine)',
              'Parallel Parking (Curb Distance)',
              'Three-Point Turn (K-Turn)',
              'On-Road Traffic Driving (City)',
              'Emergency Braking Response',
              'Lane Discipline & Roundabout Entry',
              'Overall Driver Confidence & Road Awareness',
            ].map((maneuver, i) => (
              <tr key={i} className="even:bg-slate-50">
                <td className="border border-slate-300 px-2 py-1.5 text-center font-mono">{i + 1}</td>
                <td className="border border-slate-300 px-2 py-1.5 font-semibold">{maneuver}</td>
                <td className="border border-slate-300 px-2 py-1.5 text-center">☐</td>
                <td className="border border-slate-300 px-2 py-1.5 text-center">☐</td>
                <td className="border border-slate-300 px-2 py-1.5"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Examiner Signature Block */}
      <div className="grid grid-cols-3 gap-6 mt-6 pt-4 border-t-2 border-slate-900">
        <div className="space-y-8">
          <div className="border-b border-slate-900 w-full" />
          <p className="text-[10px] font-bold text-slate-600 text-center">
            DMT Examiner Signature
          </p>
        </div>
        <div className="space-y-8">
          <div className="border-b border-slate-900 w-full" />
          <p className="text-[10px] font-bold text-slate-600 text-center">
            Final Result: PASS / FAIL
          </p>
        </div>
        <div className="space-y-8">
          <div className="border-b border-slate-900 w-full" />
          <p className="text-[10px] font-bold text-slate-600 text-center">
            Official DMT Stamp & Date
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[8px] text-slate-400 border-t border-slate-200 pt-2 mt-4">
        <p>This document is generated by TrialReady LK — Driving Academy Management System</p>
        <p>Document Reference: DMT/SL/ADM-PASS • {data.school.schoolName} • {data.school.registrationNumber}</p>
      </div>
    </div>
  )
}

export default DmtTrialAdmissionSlip
