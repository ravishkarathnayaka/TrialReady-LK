import React, { useState } from 'react'
import { VehicleDeactivationModal } from '../components/VehicleDeactivationModal'
import { VehicleForm } from '../components/VehicleForm'
import { VehicleProfileView } from '../components/VehicleProfileView'
import { VehicleTable } from '../components/VehicleTable'
import { useVehicles } from '../hooks/useVehicles'
import { createVehicle, updateVehicle } from '../services/vehicleService'
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleOperationalStatus,
  VehicleWithRelations,
} from '../types/vehicle'

interface VehicleManagementPageProps {
  drivingSchoolId: string
}

type ViewMode = 'list' | 'create' | 'edit' | 'details'

export const VehicleManagementPage: React.FC<VehicleManagementPageProps> = ({
  drivingSchoolId,
}) => {
  const {
    vehicles,
    filteredVehicles,
    branches,
    licenceCategories,
    filters,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    setFilter,
    resetFilters,
    reloadVehicles,
    handleUpdateOperationalStatus,
  } = useVehicles(drivingSchoolId)

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleWithRelations | null>(null)
  const [deactivatingVehicle, setDeactivatingVehicle] =
    useState<VehicleWithRelations | null>(null)

  function openCreate() {
    setSelectedVehicle(null)
    setErrorMessage(null)
    setSuccessMessage(null)
    setViewMode('create')
  }

  function openEdit(vehicle: VehicleWithRelations) {
    setSelectedVehicle(vehicle)
    setErrorMessage(null)
    setSuccessMessage(null)
    setViewMode('edit')
  }

  function openDetails(vehicle: VehicleWithRelations) {
    setSelectedVehicle(vehicle)
    setErrorMessage(null)
    setSuccessMessage(null)
    setViewMode('details')
  }

  function returnToList() {
    setSelectedVehicle(null)
    setViewMode('list')
  }

  async function handleSaveVehicle(
    input: CreateVehicleInput | UpdateVehicleInput,
  ) {
    try {
      setErrorMessage(null)
      if (selectedVehicle) {
        await updateVehicle(
          selectedVehicle.id,
          input as UpdateVehicleInput,
        )
        setSuccessMessage('Vehicle details updated successfully.')
      } else {
        await createVehicle(input as CreateVehicleInput)
        setSuccessMessage('Vehicle registered to fleet successfully.')
      }
      await reloadVehicles()
      returnToList()
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unable to save vehicle.'
      setErrorMessage(msg)
      throw err
    }
  }

  async function handleConfirmStatusChange(
    status: VehicleOperationalStatus,
    reason?: string | null,
  ) {
    if (!deactivatingVehicle) return

    await handleUpdateOperationalStatus(
      deactivatingVehicle.id,
      status,
      reason,
    )
    setDeactivatingVehicle(null)
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Main Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Vehicle Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage fleet vehicles, compliance documents, maintenance history, and training session availability.
            </p>
          </div>

          {viewMode === 'list' && (
            <button
              type="button"
              onClick={openCreate}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              + Add Vehicle
            </button>
          )}
        </div>

        {/* Global Feedback Banners */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* View Routing */}
        {isLoading && viewMode === 'list' ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="font-medium text-slate-900">
              Loading vehicle fleet data...
            </p>
          </section>
        ) : viewMode === 'create' || viewMode === 'edit' ? (
          <VehicleForm
            key={selectedVehicle?.id ?? 'new-vehicle'}
            drivingSchoolId={drivingSchoolId}
            branches={branches}
            licenceCategories={licenceCategories}
            initialVehicle={selectedVehicle ?? undefined}
            onSubmit={handleSaveVehicle}
            onCancel={returnToList}
          />
        ) : viewMode === 'details' && selectedVehicle ? (
          <VehicleProfileView
            vehicleId={selectedVehicle.id}
            drivingSchoolId={drivingSchoolId}
            onBack={returnToList}
            onEdit={openEdit}
          />
        ) : (
          <VehicleTable
            vehicles={filteredVehicles}
            totalCount={vehicles.length}
            branches={branches}
            licenceCategories={licenceCategories}
            filters={filters}
            onFilterChange={setFilter}
            onResetFilters={resetFilters}
            onViewDetails={openDetails}
            onEdit={openEdit}
            onManageStatus={(vehicle) => setDeactivatingVehicle(vehicle)}
          />
        )}

        {/* Deactivation / Status Modal */}
        {deactivatingVehicle && (
          <VehicleDeactivationModal
            vehicle={deactivatingVehicle}
            onConfirm={handleConfirmStatusChange}
            onClose={() => setDeactivatingVehicle(null)}
          />
        )}
      </div>
    </main>
  )
}

export default VehicleManagementPage
