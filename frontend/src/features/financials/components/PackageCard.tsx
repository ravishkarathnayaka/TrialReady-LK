import React from 'react'
import type { Package } from '../types/financials'
import { formatLKR } from '../utils/financialUtils'

interface PackageCardProps {
  pkg: Package
  onEdit: (pkg: Package) => void
  onToggleActive?: (pkg: Package) => void
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  onEdit,
  onToggleActive,
}) => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 transition-all">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold font-mono uppercase text-blue-700 border border-blue-200">
              {pkg.code}
            </span>
            <h3 className="mt-2 text-base font-bold text-slate-900 leading-snug">
              {pkg.name}
            </h3>
          </div>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              pkg.is_active
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {pkg.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Fee Display */}
        <div className="mt-3">
          <span className="text-xl font-black text-slate-900">
            {formatLKR(pkg.fee)}
          </span>
          <span className="text-xs text-slate-500 ml-1">/ course</span>
        </div>

        {/* Features / Inclusions */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-slate-700 font-medium border border-slate-200">
            🚗 {pkg.practical_hours_included} Practical Hours
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-slate-700 font-medium border border-slate-200">
            📖 {pkg.theory_classes_included} Theory Classes
          </span>
        </div>

        {pkg.description && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-2">
            {pkg.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        {onToggleActive && (
          <button
            type="button"
            onClick={() => onToggleActive(pkg)}
            className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            {pkg.is_active ? 'Deactivate' : 'Activate'}
          </button>
        )}

        <button
          type="button"
          onClick={() => onEdit(pkg)}
          className="rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer ml-auto"
        >
          Edit Package
        </button>
      </div>
    </div>
  )
}

export default PackageCard
