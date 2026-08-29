import React from 'react'
import type { VehicleFilters, VehicleSortOption } from '../hooks/useVehicles'
import type {
  VehicleAvailabilityStatus,
  VehicleBranchSummary,
  VehicleLicenceCategorySummary,
  VehicleOperationalStatus,
  VehicleTransmissionType,
  VehicleWithRelations,
} from '../types/vehicle'

interface VehicleTableProps {
  vehicles: VehicleWithRelations[]
  totalCount: number
  branches: VehicleBranchSummary[]
  licenceCategories: VehicleLicenceCategorySummary[]
  filters: VehicleFilters
  onFilterChange: <K extends keyof VehicleFilters>(
    key: K,
    value: VehicleFilters[K],
  ) => void
  onResetFilters: () => void
  onViewDetails: (vehicle: VehicleWithRelations) => void
  onEdit: (vehicle: VehicleWithRelations) => void
  onManageStatus: (vehicle: VehicleWithRelations) => void
}

function getOperationalBadgeClass(status: VehicleOperationalStatus): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border border-green-200'
    case 'inactive':
      return 'bg-slate-100 text-slate-700 border border-slate-200'
    case 'suspended':
      return 'bg-amber-100 text-amber-800 border border-amber-200'
    case 'out_of_service':
      return 'bg-red-100 text-red-800 border border-red-200'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function getAvailabilityBadgeClass(status: VehicleAvailabilityStatus): string {
  switch (status) {
    case 'available':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    case 'unavailable':
      return 'bg-amber-100 text-amber-800 border border-amber-200'
    case 'in_maintenance':
      return 'bg-indigo-100 text-indigo-800 border border-indigo-200'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function formatStatusText(text: string): string {
  return text
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  totalCount,
  branches,
  licenceCategories,
  filters,
  onFilterChange,
  onResetFilters,
  onViewDetails,
  onEdit,
  onManageStatus,
}) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header with Title and Search/Filters */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Vehicles
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing {vehicles.length} of {totalCount}{' '}
              {totalCount === 1 ? 'vehicle' : 'vehicles'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="search"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Search registration, make, model..."
              aria-label="Search vehicles"
              className="w-full sm:w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
            />

            {(filters.search ||
              filters.branchId !== 'all' ||
              filters.categoryId !== 'all' ||
              filters.operationalStatus !== 'all' ||
              filters.availabilityStatus !== 'all' ||
              filters.transmissionType !== 'all' ||
              filters.fuelType !== 'all' ||
              filters.trainingOnly) && (
              <button
                type="button"
                onClick={onResetFilters}
                className="whitespace-nowrap rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-3 lg:grid-cols-6">
          {/* Branch filter */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Branch
            </label>
            <select
              value={filters.branchId}
              onChange={(e) => onFilterChange('branchId', e.target.value)}
              aria-label="Filter by branch"
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Licence Category filter */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Category
            </label>
            <select
              value={filters.categoryId}
              onChange={(e) => onFilterChange('categoryId', e.target.value)}
              aria-label="Filter by licence category"
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {licenceCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Operational Status filter */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Operational
            </label>
            <select
              value={filters.operationalStatus}
              onChange={(e) =>
                onFilterChange(
                  'operationalStatus',
                  e.target.value as VehicleOperationalStatus | 'all',
                )
              }
              aria-label="Filter by operational status"
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="out_of_service">Out of Service</option>
            </select>
          </div>

          {/* Availability Status filter */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Availability
            </label>
            <select
              value={filters.availabilityStatus}
              onChange={(e) =>
                onFilterChange(
                  'availabilityStatus',
                  e.target.value as VehicleAvailabilityStatus | 'all',
                )
              }
              aria-label="Filter by availability status"
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="in_maintenance">In Maintenance</option>
            </select>
          </div>

          {/* Transmission filter */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Transmission
            </label>
            <select
              value={filters.transmissionType}
              onChange={(e) =>
                onFilterChange(
                  'transmissionType',
                  e.target.value as VehicleTransmissionType | 'all',
                )
              }
              aria-label="Filter by transmission"
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Transmissions</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
              <option value="semi_automatic">Semi-Automatic</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Sort option */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange(
                  'sortBy',
                  e.target.value as VehicleSortOption,
                )
              }
              aria-label="Sort vehicles"
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="registration_asc">Registration (A-Z)</option>
              <option value="registration_desc">Registration (Z-A)</option>
              <option value="manufacturer_asc">Make & Model (A-Z)</option>
              <option value="year_desc">Year (Newest)</option>
              <option value="date_added_desc">Recently Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table / Empty State */}
      {vehicles.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="font-medium text-slate-900">No vehicles found</p>
          <p className="mt-1 text-sm text-slate-500">
            {totalCount === 0
              ? 'Register the first vehicle for this driving school.'
              : 'Try clearing or changing your search filters.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Vehicle
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Category & Branch
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Specs
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Operational Status
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Availability
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 bg-white">
              {vehicles.map((vehicle) => {
                return (
                  <tr
                    key={vehicle.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Vehicle info */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">
                          {vehicle.registration_number}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          {vehicle.manufacturer} {vehicle.model}
                          {vehicle.year_of_manufacture
                            ? ` (${vehicle.year_of_manufacture})`
                            : ''}
                        </span>
                        {vehicle.display_name && (
                          <span className="text-xs text-slate-400">
                            {vehicle.display_name}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category & Branch */}
                    <td className="px-5 py-4 text-sm text-slate-600">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex w-fit items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
                          {vehicle.licence_category
                            ? `${vehicle.licence_category.code} – ${vehicle.licence_category.name}`
                            : 'Unassigned Category'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {vehicle.branch?.name ?? 'All / Head Branch'}
                        </span>
                      </div>
                    </td>

                    {/* Specs */}
                    <td className="px-5 py-4 text-xs text-slate-600">
                      <div className="flex flex-col gap-0.5">
                        <span className="capitalize">
                          {vehicle.transmission_type.replace('_', ' ')}
                        </span>
                        {vehicle.fuel_type && (
                          <span className="capitalize text-slate-400">
                            {vehicle.fuel_type}
                          </span>
                        )}
                        {vehicle.current_odometer_km !== null && (
                          <span className="text-slate-500 font-mono text-[11px]">
                            {vehicle.current_odometer_km.toLocaleString()} km
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Operational Status */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getOperationalBadgeClass(
                            vehicle.operational_status,
                          )}`}
                        >
                          {formatStatusText(vehicle.operational_status)}
                        </span>
                        {vehicle.training_use_enabled ? (
                          <span className="text-[11px] text-green-600 font-medium">
                            ✓ Training enabled
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Training disabled
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Availability */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getAvailabilityBadgeClass(
                          vehicle.availability_status,
                        )}`}
                      >
                        {formatStatusText(vehicle.availability_status)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onViewDetails(vehicle)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(vehicle)}
                          className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onManageStatus(vehicle)}
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                            vehicle.operational_status === 'active'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                              : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                          }`}
                        >
                          {vehicle.operational_status === 'active'
                            ? 'Status'
                            : 'Reactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
