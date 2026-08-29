import { useCallback, useEffect, useState } from 'react'
import {
  createVehicleAvailabilityPeriod,
  getVehicleAvailabilityPeriods,
} from '../services/vehicleAvailabilityService'
import {
  createVehicleDocument,
  deleteVehicleDocument,
  getVehicleDocuments,
} from '../services/vehicleDocumentService'
import {
  createVehicleMaintenanceRecord,
  getVehicleMaintenanceRecords,
} from '../services/vehicleMaintenanceService'
import {
  getVehicleById,
  setVehicleAvailabilityStatus,
  setVehicleOperationalStatus,
  updateVehicle,
} from '../services/vehicleService'
import type {
  UpdateVehicleInput,
  VehicleAvailabilityStatus,
  VehicleOperationalStatus,
  VehicleWithRelations,
} from '../types/vehicle'
import type {
  CreateVehicleAvailabilityPeriodInput,
  VehicleAvailabilityPeriod,
} from '../types/vehicleAvailability'
import type {
  CreateVehicleDocumentInput,
  VehicleDocument,
} from '../types/vehicleDocument'
import type {
  CreateVehicleMaintenanceRecordInput,
  VehicleMaintenanceRecord,
} from '../types/vehicleMaintenance'

export function useVehicleDetails(vehicleId: string) {
  const [vehicle, setVehicle] = useState<VehicleWithRelations | null>(null)
  const [documents, setDocuments] = useState<VehicleDocument[]>([])
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    VehicleMaintenanceRecord[]
  >([])
  const [availabilityPeriods, setAvailabilityPeriods] = useState<
    VehicleAvailabilityPeriod[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const reloadDetails = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const [vData, dData, mData, aData] = await Promise.all([
        getVehicleById(vehicleId),
        getVehicleDocuments(vehicleId),
        getVehicleMaintenanceRecords(vehicleId),
        getVehicleAvailabilityPeriods(vehicleId),
      ])

      setVehicle(vData)
      setDocuments(dData)
      setMaintenanceRecords(mData)
      setAvailabilityPeriods(aData)
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to load vehicle details.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [vehicleId])

  useEffect(() => {
    let isCancelled = false

    Promise.all([
      getVehicleById(vehicleId),
      getVehicleDocuments(vehicleId),
      getVehicleMaintenanceRecords(vehicleId),
      getVehicleAvailabilityPeriods(vehicleId),
    ])
      .then(([vData, dData, mData, aData]) => {
        if (!isCancelled) {
          setVehicle(vData)
          setDocuments(dData)
          setMaintenanceRecords(mData)
          setAvailabilityPeriods(aData)
          setErrorMessage(null)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Unable to load vehicle details.',
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
  }, [vehicleId])

  const handleUpdateVehicle = useCallback(
    async (input: UpdateVehicleInput) => {
      try {
        setErrorMessage(null)
        const updated = await updateVehicle(vehicleId, input)
        setVehicle(updated)
        setSuccessMessage('Vehicle details updated successfully.')
        return updated
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to update vehicle details.'
        setErrorMessage(msg)
        throw err
      }
    },
    [vehicleId],
  )

  const handleOperationalStatus = useCallback(
    async (
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
        setVehicle(updated)
        setSuccessMessage(
          `Vehicle operational status changed to ${status}.`,
        )
        return updated
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to change operational status.'
        setErrorMessage(msg)
        throw err
      }
    },
    [vehicleId],
  )

  const handleAvailabilityStatus = useCallback(
    async (status: VehicleAvailabilityStatus) => {
      try {
        setErrorMessage(null)
        const updated = await setVehicleAvailabilityStatus(
          vehicleId,
          status,
        )
        setVehicle(updated)
        setSuccessMessage(
          `Vehicle availability status changed to ${status}.`,
        )
        return updated
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to change availability status.'
        setErrorMessage(msg)
        throw err
      }
    },
    [vehicleId],
  )

  const handleAddDocument = useCallback(
    async (input: CreateVehicleDocumentInput) => {
      try {
        setErrorMessage(null)
        const newDoc = await createVehicleDocument(input)
        setDocuments((prev) => [newDoc, ...prev])
        setSuccessMessage('Document added successfully.')
        return newDoc
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Unable to add document.'
        setErrorMessage(msg)
        throw err
      }
    },
    [],
  )

  const handleDeleteDocument = useCallback(async (docId: string) => {
    try {
      setErrorMessage(null)
      await deleteVehicleDocument(docId)
      setDocuments((prev) => prev.filter((d) => d.id !== docId))
      setSuccessMessage('Document removed successfully.')
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unable to delete document.'
      setErrorMessage(msg)
      throw err
    }
  }, [])

  const handleAddMaintenance = useCallback(
    async (input: CreateVehicleMaintenanceRecordInput) => {
      try {
        setErrorMessage(null)
        const newRec = await createVehicleMaintenanceRecord(input)
        setMaintenanceRecords((prev) => [newRec, ...prev])
        // If odometer reading or next service date was updated, refresh vehicle
        if (input.odometer_reading_km || input.next_recommended_service_date) {
          const updatedVehicle = await getVehicleById(vehicleId)
          setVehicle(updatedVehicle)
        }
        setSuccessMessage('Maintenance record saved successfully.')
        return newRec
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to save maintenance record.'
        setErrorMessage(msg)
        throw err
      }
    },
    [vehicleId],
  )

  const handleAddAvailabilityPeriod = useCallback(
    async (input: CreateVehicleAvailabilityPeriodInput) => {
      try {
        setErrorMessage(null)
        const newPeriod = await createVehicleAvailabilityPeriod(input)
        setAvailabilityPeriods((prev) => [newPeriod, ...prev])
        // Also sync vehicle availability status with latest period status
        const updatedVehicle = await setVehicleAvailabilityStatus(
          vehicleId,
          input.availability_status,
        )
        setVehicle(updatedVehicle)
        setSuccessMessage('Availability period recorded successfully.')
        return newPeriod
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to record availability period.'
        setErrorMessage(msg)
        throw err
      }
    },
    [vehicleId],
  )

  return {
    vehicle,
    documents,
    maintenanceRecords,
    availabilityPeriods,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    reloadDetails,
    handleUpdateVehicle,
    handleOperationalStatus,
    handleAvailabilityStatus,
    handleAddDocument,
    handleDeleteDocument,
    handleAddMaintenance,
    handleAddAvailabilityPeriod,
  }
}
