import React, { useState } from 'react'
import { useVehicleDetails } from '../hooks/useVehicleDetails'
import type { VehicleWithRelations } from '../types/vehicle'
import { VehicleAvailabilityManager } from './VehicleAvailabilityManager'
import { VehicleDocumentManager } from './VehicleDocumentManager'
import { VehicleMaintenanceManager } from './VehicleMaintenanceManager'

interface VehicleProfileViewProps {
  vehicleId: string
  drivingSchoolId: string
  onBack: () => void
  onEdit: (vehicle: VehicleWithRelations) => void
}

type TabType = 'overview' | 'documents' | 'maintenance' | 'availability'

export const VehicleProfileView: React.FC<VehicleProfileViewProps> = ({
  vehicleId,
  drivingSchoolId,
  onBack,
  onEdit,
}) => {
  const {
    vehicle,
    documents,
    maintenanceRecords,
    availabilityPeriods,
    isLoading,
    errorMessage,
    successMessage,
    handleAddDocument,
    handleDeleteDocument,
    handleAddMaintenance,
    handleAvailabilityStatus,
    handleAddAvailabilityPeriod,
  } = useVehicleDetails(vehicleId)

  const [activeTab, setActiveTab] = useState<TabType>('overview')

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="font-medium text-slate-900">Loading vehicle details...</p>
      </section>
    )
  }

  if (!vehicle) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="font-medium text-red-600">Vehicle not found</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
        >
          Back to Fleet List
        </button>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Navigation Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              ← Back to List
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 font-mono">
                  {vehicle.registration_number}
                </h2>
                {vehicle.display_name && (
                  <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {vehicle.display_name}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                {vehicle.manufacturer} {vehicle.model}{' '}
                {vehicle.year_of_manufacture
                  ? `(${vehicle.year_of_manufacture})`
                  : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(vehicle)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 shadow-sm"
            >
              Edit Vehicle
            </button>
          </div>
        </div>

        {/* Status and Spec Highlights Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5 text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">
              Licence Category
            </span>
            <span className="font-semibold text-slate-900 mt-0.5 block">
              {vehicle.licence_category
                ? `${vehicle.licence_category.code} – ${vehicle.licence_category.name}`
                : 'Not Set'}
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">
              Branch Location
            </span>
            <span className="font-semibold text-slate-900 mt-0.5 block">
              {vehicle.branch?.name ?? 'All Branches / Main'}
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">
              Transmission & Fuel
            </span>
            <span className="font-semibold text-slate-900 mt-0.5 block capitalize">
              {vehicle.transmission_type.replace('_', ' ')} •{' '}
              {vehicle.fuel_type ?? 'N/A'}
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">
              Odometer Reading
            </span>
            <span className="font-semibold font-mono text-slate-900 mt-0.5 block">
              {vehicle.current_odometer_km !== null
                ? `${vehicle.current_odometer_km.toLocaleString()} km`
                : 'Not logged'}
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">
              Operational Status
            </span>
            <span className="font-semibold text-slate-900 mt-0.5 block capitalize">
              {vehicle.operational_status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Alerts */}
      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-green-700">
          {successMessage}
        </div>
      )}

      {/* Tabs Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 px-4">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Specifications
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Documents ({documents.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('maintenance')}
            className={`border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
              activeTab === 'maintenance'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Maintenance & Service ({maintenanceRecords.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('availability')}
            className={`border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
              activeTab === 'availability'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Availability & Schedule ({availabilityPeriods.length})
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Technical & Operational Specifications
                </h3>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                  <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                    <span className="text-slate-400 block text-[11px]">
                      Registration Number
                    </span>
                    <span className="font-bold text-slate-900 font-mono text-sm">
                      {vehicle.registration_number}
                    </span>
                  </div>

                  <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                    <span className="text-slate-400 block text-[11px]">
                      Manufacturer & Model
                    </span>
                    <span className="font-semibold text-slate-900">
                      {vehicle.manufacturer} {vehicle.model}
                    </span>
                  </div>

                  <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                    <span className="text-slate-400 block text-[11px]">
                      Year of Manufacture
                    </span>
                    <span className="font-semibold text-slate-900">
                      {vehicle.year_of_manufacture ?? 'Not Specified'}
                    </span>
                  </div>

                  <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                    <span className="text-slate-400 block text-[11px]">
                      Transmission Type
                    </span>
                    <span className="font-semibold text-slate-900 capitalize">
                      {vehicle.transmission_type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                    <span className="text-slate-400 block text-[11px]">
                      Fuel Type
                    </span>
                    <span className="font-semibold text-slate-900 capitalize">
                      {vehicle.fuel_type ?? 'Not Specified'}
                    </span>
                  </div>

                  <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                    <span className="text-slate-400 block text-[11px]">
                      Training Sessions Use
                    </span>
                    <span
                      className={`font-semibold ${
                        vehicle.training_use_enabled
                          ? 'text-green-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {vehicle.training_use_enabled
                        ? 'Enabled for Student Training'
                        : 'Disabled'}
                    </span>
                  </div>

                  <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                    <span className="text-slate-400 block text-[11px]">
                      Date Added to Fleet
                    </span>
                    <span className="font-semibold text-slate-900">
                      {vehicle.date_added}
                    </span>
                  </div>

                  <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                    <span className="text-slate-400 block text-[11px]">
                      Next Recommended Service
                    </span>
                    <span className="font-semibold text-slate-900">
                      {vehicle.next_service_date ?? 'No date scheduled'}
                    </span>
                  </div>
                </div>
              </div>

              {vehicle.internal_notes && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase mb-2">
                    Internal Notes
                  </h4>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 whitespace-pre-wrap">
                    {vehicle.internal_notes}
                  </div>
                </div>
              )}

              {vehicle.deactivation_reason && (
                <div>
                  <h4 className="text-xs font-semibold text-red-700 uppercase mb-2">
                    Deactivation Information
                  </h4>
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-800">
                    <p className="font-semibold">
                      Reason: {vehicle.deactivation_reason}
                    </p>
                    {vehicle.deactivated_at && (
                      <p className="text-[11px] text-red-600 mt-1">
                        Deactivated on:{' '}
                        {new Date(vehicle.deactivated_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Documents */}
          {activeTab === 'documents' && (
            <VehicleDocumentManager
              vehicleId={vehicle.id}
              drivingSchoolId={drivingSchoolId}
              documents={documents}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {/* Tab 3: Maintenance */}
          {activeTab === 'maintenance' && (
            <VehicleMaintenanceManager
              vehicleId={vehicle.id}
              drivingSchoolId={drivingSchoolId}
              currentOdometer={vehicle.current_odometer_km}
              maintenanceRecords={maintenanceRecords}
              onAddMaintenance={handleAddMaintenance}
            />
          )}

          {/* Tab 4: Availability */}
          {activeTab === 'availability' && (
            <VehicleAvailabilityManager
              vehicleId={vehicle.id}
              drivingSchoolId={drivingSchoolId}
              currentAvailability={vehicle.availability_status}
              availabilityPeriods={availabilityPeriods}
              onChangeAvailabilityStatus={handleAvailabilityStatus}
              onAddAvailabilityPeriod={handleAddAvailabilityPeriod}
            />
          )}
        </div>
      </div>
    </div>
  )
}
