import React, { useEffect, useState } from 'react'
import type { CreatePackageInput, Package, UpdatePackageInput } from '../types/financials'

interface PackageModalProps {
  isOpen: boolean
  onClose: () => void
  drivingSchoolId: string
  existingPackage: Package | null
  onSave: (input: CreatePackageInput | UpdatePackageInput) => Promise<unknown>
}

export const PackageModal: React.FC<PackageModalProps> = ({
  isOpen,
  onClose,
  drivingSchoolId,
  existingPackage,
  onSave,
}) => {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [fee, setFee] = useState('')
  const [practicalHours, setPracticalHours] = useState('15')
  const [theoryClasses, setTheoryClasses] = useState('5')
  const [description, setDescription] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (existingPackage) {
      setName(existingPackage.name)
      setCode(existingPackage.code)
      setFee(existingPackage.fee.toString())
      setPracticalHours(existingPackage.practical_hours_included.toString())
      setTheoryClasses(existingPackage.theory_classes_included.toString())
      setDescription(existingPackage.description || '')
    } else {
      setName('')
      setCode('')
      setFee('45000')
      setPracticalHours('15')
      setTheoryClasses('5')
      setDescription('')
    }
    setError(null)
  }, [existingPackage, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Package name is required.')
      return
    }
    if (!code.trim()) {
      setError('Package code is required.')
      return
    }
    const feeNum = parseFloat(fee)
    if (isNaN(feeNum) || feeNum < 0) {
      setError('Please enter a valid course fee.')
      return
    }

    try {
      setIsSubmitting(true)
      if (existingPackage) {
        await onSave({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          fee: feeNum,
          practical_hours_included: parseInt(practicalHours, 10) || 0,
          theory_classes_included: parseInt(theoryClasses, 10) || 0,
          description: description.trim() || null,
        })
      } else {
        await onSave({
          driving_school_id: drivingSchoolId,
          name: name.trim(),
          code: code.trim().toUpperCase(),
          fee: feeNum,
          practical_hours_included: parseInt(practicalHours, 10) || 0,
          theory_classes_included: parseInt(theoryClasses, 10) || 0,
          description: description.trim() || null,
        })
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save package.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {existingPackage ? 'Edit Course Package' : 'Create Course Package'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Define training fees, included practical hours & curriculum
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Package Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Package Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Light Vehicle Car (Manual & Auto)"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Package Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. PKG-CAR-01"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono uppercase text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            {/* Fee (LKR) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Fee (LKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="45000"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Practical Hours Included */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Practical Hours Included
              </label>
              <input
                type="number"
                min={0}
                value={practicalHours}
                onChange={(e) => setPracticalHours(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            {/* Theory Classes Included */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Theory Classes Included
              </label>
              <input
                type="number"
                min={0}
                value={theoryClasses}
                onChange={(e) => setTheoryClasses(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Package Details & Curriculum
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Includes DMT trial vehicle hire, unlimited mock tests, and fuel."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : existingPackage ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PackageModal
