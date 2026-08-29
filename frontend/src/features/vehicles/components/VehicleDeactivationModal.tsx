import React, { useState } from 'react'
import type {
  VehicleOperationalStatus,
  VehicleWithRelations,
} from '../types/vehicle'

interface VehicleDeactivationModalProps {
  vehicle: VehicleWithRelations
  onConfirm: (
    status: VehicleOperationalStatus,
    reason?: string | null,
  ) => Promise<void>
  onClose: () => void
}

export const VehicleDeactivationModal: React.FC<
  VehicleDeactivationModalProps
> = ({ vehicle, onConfirm, onClose }) => {
  const isCurrentlyActive = vehicle.operational_status === 'active'
  const [targetStatus, setTargetStatus] =
    useState<VehicleOperationalStatus>(
      isCurrentlyActive ? 'inactive' : 'active',
    )
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleAction() {
    if (targetStatus !== 'active' && !reason.trim()) {
      setErrorMessage('Please provide a reason for the status change.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      await onConfirm(
        targetStatus,
        targetStatus === 'active' ? null : reason.trim(),
      )
      onClose()
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to update vehicle status.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Manage Vehicle Status
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {vehicle.registration_number} — {vehicle.manufacturer}{' '}
              {vehicle.model}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Select New Operational Status
            </label>
            <select
              value={targetStatus}
              onChange={(e) =>
                setTargetStatus(e.target.value as VehicleOperationalStatus)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="active">Active (Available for operation)</option>
              <option value="inactive">Inactive (Decommissioned / Off-fleet)</option>
              <option value="suspended">Suspended (Temporary hold / Inspection)</option>
              <option value="out_of_service">Out of Service (Major breakdown)</option>
            </select>
          </div>

          {targetStatus !== 'active' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Reason for Status Change *
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Awaiting engine overhaul, Lease returned, Sold"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 resize-y"
              />
            </div>
          )}

          {targetStatus === 'active' && !isCurrentlyActive && (
            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
              Reactivating this vehicle will restore it to the active fleet for driving sessions.
            </p>
          )}

          {vehicle.deactivation_reason && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
              <span className="font-semibold block text-slate-700">
                Previous Deactivation Reason:
              </span>
              <span>{vehicle.deactivation_reason}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAction}
            disabled={isSubmitting}
            className={`rounded-lg px-4 py-2 text-xs font-medium text-white shadow-sm disabled:opacity-50 ${
              targetStatus === 'active'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSubmitting
              ? 'Saving...'
              : targetStatus === 'active'
                ? 'Reactivate Vehicle'
                : 'Apply Status'}
          </button>
        </div>
      </div>
    </div>
  )
}
