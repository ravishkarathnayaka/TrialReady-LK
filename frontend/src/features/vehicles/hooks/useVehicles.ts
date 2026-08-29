import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getBranchesForSchool,
  getLicenceCategoriesForSchool,
  getVehicles,
  setVehicleAvailabilityStatus,
  setVehicleOperationalStatus,
} from '../services/vehicleService'
import type {
  VehicleAvailabilityStatus,
  VehicleBranchSummary,
  VehicleFuelType,
  VehicleLicenceCategorySummary,
  VehicleOperationalStatus,
  VehicleTransmissionType,
  VehicleWithRelations,
} from '../types/vehicle'

export type VehicleSortOption =
  | 'registration_asc'
  | 'registration_desc'
  | 'manufacturer_asc'
  | 'year_desc'
  | 'date_added_desc'

export interface VehicleFilters {
  search: string
  branchId: string
  categoryId: string
  operationalStatus: VehicleOperationalStatus | 'all'
  availabilityStatus: VehicleAvailabilityStatus | 'all'
  transmissionType: VehicleTransmissionType | 'all'
  fuelType: VehicleFuelType | 'all'
  trainingOnly: boolean
  sortBy: VehicleSortOption
}

const DEFAULT_FILTERS: VehicleFilters = {
  search: '',
  branchId: 'all',
  categoryId: 'all',
  operationalStatus: 'all',
  availabilityStatus: 'all',
  transmissionType: 'all',
  fuelType: 'all',
  trainingOnly: false,
  sortBy: 'registration_asc',
}

export function useVehicles(drivingSchoolId: string) {
  const [vehicles, setVehicles] = useState<VehicleWithRelations[]>([])
  const [branches, setBranches] = useState<VehicleBranchSummary[]>([])
  const [licenceCategories, setLicenceCategories] = useState<
    VehicleLicenceCategorySummary[]
  >([])
  const [filters, setFilters] = useState<VehicleFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const reloadVehicles = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const [vehicleList, branchList, categoryList] = await Promise.all([
        getVehicles(drivingSchoolId),
        getBranchesForSchool(drivingSchoolId),
        getLicenceCategoriesForSchool(drivingSchoolId),
      ])

      setVehicles(vehicleList)
      setBranches(branchList)
      setLicenceCategories(categoryList)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to load vehicle data.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [drivingSchoolId])

  useEffect(() => {
    let isCancelled = false

    Promise.all([
      getVehicles(drivingSchoolId),
      getBranchesForSchool(drivingSchoolId),
      getLicenceCategoriesForSchool(drivingSchoolId),
    ])
      .then(([vehicleList, branchList, categoryList]) => {
        if (!isCancelled) {
          setVehicles(vehicleList)
          setBranches(branchList)
          setLicenceCategories(categoryList)
          setErrorMessage(null)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Unable to load vehicle data.',
          )
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [drivingSchoolId])

  const setFilter = useCallback(
    <K extends keyof VehicleFilters>(key: K, value: VehicleFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const filteredVehicles = useMemo(() => {
    const searchNormalized = filters.search.trim().toLowerCase()

    return vehicles
      .filter((vehicle) => {
        // Search filter
        if (searchNormalized) {
          const matchFields = [
            vehicle.registration_number,
            vehicle.display_name ?? '',
            vehicle.manufacturer,
            vehicle.model,
            vehicle.licence_category?.code ?? '',
            vehicle.licence_category?.name ?? '',
            vehicle.branch?.name ?? '',
          ]
          const matches = matchFields.some((field) =>
            field.toLowerCase().includes(searchNormalized),
          )
          if (!matches) return false
        }

        // Branch filter
        if (
          filters.branchId !== 'all' &&
          vehicle.branch_id !== filters.branchId
        ) {
          return false
        }

        // Category filter
        if (
          filters.categoryId !== 'all' &&
          vehicle.licence_category_id !== filters.categoryId
        ) {
          return false
        }

        // Operational Status filter
        if (
          filters.operationalStatus !== 'all' &&
          vehicle.operational_status !== filters.operationalStatus
        ) {
          return false
        }

        // Availability Status filter
        if (
          filters.availabilityStatus !== 'all' &&
          vehicle.availability_status !== filters.availabilityStatus
        ) {
          return false
        }

        // Transmission filter
        if (
          filters.transmissionType !== 'all' &&
          vehicle.transmission_type !== filters.transmissionType
        ) {
          return false
        }

        // Fuel filter
        if (
          filters.fuelType !== 'all' &&
          vehicle.fuel_type !== filters.fuelType
        ) {
          return false
        }

        // Training only filter
        if (filters.trainingOnly && !vehicle.training_use_enabled) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'registration_asc':
            return a.registration_number.localeCompare(b.registration_number)
          case 'registration_desc':
            return b.registration_number.localeCompare(a.registration_number)
          case 'manufacturer_asc':
            return `${a.manufacturer} ${a.model}`.localeCompare(
              `${b.manufacturer} ${b.model}`,
            )
          case 'year_desc':
            return (b.year_of_manufacture ?? 0) - (a.year_of_manufacture ?? 0)
          case 'date_added_desc':
            return (
              new Date(b.date_added).getTime() -
              new Date(a.date_added).getTime()
            )
          default:
            return 0
        }
      })
  }, [vehicles, filters])

  const handleUpdateOperationalStatus = useCallback(
    async (
      vehicleId: string,
      status: VehicleOperationalStatus,
      deactivationReason?: string | null,
    ) => {
      try {
        setErrorMessage(null)
        const updated = await setVehicleOperationalStatus(
          vehicleId,
          status,
          deactivationReason,
        )
        setVehicles((prev) =>
          prev.map((v) => (v.id === updated.id ? updated : v)),
        )
        setSuccessMessage(
          `Vehicle ${updated.registration_number} status updated to ${status}.`,
        )
        return updated
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to update vehicle status.'
        setErrorMessage(msg)
        throw err
      }
    },
    [],
  )

  const handleUpdateAvailabilityStatus = useCallback(
    async (vehicleId: string, status: VehicleAvailabilityStatus) => {
      try {
        setErrorMessage(null)
        const updated = await setVehicleAvailabilityStatus(
          vehicleId,
          status,
        )
        setVehicles((prev) =>
          prev.map((v) => (v.id === updated.id ? updated : v)),
        )
        setSuccessMessage(
          `Vehicle ${updated.registration_number} availability set to ${status}.`,
        )
        return updated
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to update availability status.'
        setErrorMessage(msg)
        throw err
      }
    },
    [],
  )

  return {
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
    setVehicles,
    handleUpdateOperationalStatus,
    handleUpdateAvailabilityStatus,
  }
}
