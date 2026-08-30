import React from 'react'

interface DmtAuditExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExportDmtAudit: () => void
  onExportFinancialLedger: () => void
  onExportInstructorPerformance: () => void
}

export const DmtAuditExportModal: React.FC<DmtAuditExportModalProps> = ({
  isOpen,
  onClose,
  onExportDmtAudit,
  onExportFinancialLedger,
  onExportInstructorPerformance,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📥</span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Export Compliance & Audit Reports
              </h3>
              <p className="text-xs text-slate-500">
                Official Department of Motor Traffic (DMT) and driving academy audit data in Excel-ready CSV format
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 3 Report Cards */}
        <div className="space-y-3">
          {/* 1. DMT Student Audit Log */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 hover:border-blue-300 transition-colors">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                📄 DMT Candidate Compliance Audit Log
              </span>
              <p className="text-[11px] text-slate-500 max-w-sm">
                Full student roster with NIC, DMT 6-month permit #, expiry dates, NTMI medical clearance, theory status, and AI trial readiness scores.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onExportDmtAudit()
                onClose()
              }}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer shrink-0"
            >
              Export CSV
            </button>
          </div>

          {/* 2. Financial Ledger */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 hover:border-emerald-300 transition-colors">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                💳 Academy Revenue & Payment Ledger
              </span>
              <p className="text-[11px] text-slate-500 max-w-sm">
                Official receipts log, enrolled packages, payment methods (Cash, Card, Transfer), and student instalment payment histories.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onExportFinancialLedger()
                onClose()
              }}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer shrink-0"
            >
              Export CSV
            </button>
          </div>

          {/* 3. Instructor Performance */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 hover:border-purple-300 transition-colors">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                👨‍🏫 Instructor Performance & Pass Rate Audit
              </span>
              <p className="text-[11px] text-slate-500 max-w-sm">
                Staff training hours, assigned student volume, trial pass rates %, and student satisfaction ratings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onExportInstructorPerformance()
                onClose()
              }}
              className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition-all cursor-pointer shrink-0"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DmtAuditExportModal
