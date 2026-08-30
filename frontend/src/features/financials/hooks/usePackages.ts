import { useCallback, useEffect, useState } from 'react'
import {
  createPackage,
  deletePackage,
  getPackages,
  updatePackage,
} from '../services/financialService'
import type {
  CreatePackageInput,
  Package,
  UpdatePackageInput,
} from '../types/financials'

export function usePackages(drivingSchoolId: string) {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const reloadPackages = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const data = await getPackages(drivingSchoolId)
      setPackages(data)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load packages.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [drivingSchoolId])

  useEffect(() => {
    let isMounted = true
    getPackages(drivingSchoolId)
      .then((data) => {
        if (isMounted) {
          setPackages(data)
          setErrorMessage(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Failed to load packages.',
          )
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [drivingSchoolId])

  const handleCreatePackage = useCallback(
    async (input: CreatePackageInput) => {
      try {
        setErrorMessage(null)
        const created = await createPackage(input)
        setPackages((prev) => [...prev, created])
        setSuccessMessage('Course package created successfully.')
        return created
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to create package.'
        setErrorMessage(msg)
        throw err
      }
    },
    [],
  )

  const handleUpdatePackage = useCallback(
    async (id: string, input: UpdatePackageInput) => {
      try {
        setErrorMessage(null)
        const updated = await updatePackage(id, input)
        setPackages((prev) => prev.map((p) => (p.id === id ? updated : p)))
        setSuccessMessage('Course package updated successfully.')
        return updated
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to update package.'
        setErrorMessage(msg)
        throw err
      }
    },
    [],
  )

  const handleDeletePackage = useCallback(async (id: string) => {
    try {
      setErrorMessage(null)
      await deletePackage(id)
      setPackages((prev) => prev.filter((p) => p.id !== id))
      setSuccessMessage('Package deleted.')
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to delete package.'
      setErrorMessage(msg)
      throw err
    }
  }, [])

  return {
    packages,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    reloadPackages,
    handleCreatePackage,
    handleUpdatePackage,
    handleDeletePackage,
  }
}
