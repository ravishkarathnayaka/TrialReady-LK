import { useEffect, useMemo, useRef, useState } from 'react'
import {
  assignInstructorLicenceCategory,
  getActiveLicenceCategories,
  getInstructorLicenceCategories,
  removeInstructorLicenceCategory,
} from '../services/instructorLicenceCategoryService'
import type { Instructor } from '../types/instructor'
import type {
  InstructorLicenceCategoryWithDetails,
  LicenceCategory,
} from '../types/instructorLicenceCategory'

interface InstructorLicenceCategoryManagerProps {
  instructor: Instructor
  drivingSchoolId: string
  onClose: () => void
}

function InstructorLicenceCategoryManager({
  instructor,
  drivingSchoolId,
  onClose,
}: InstructorLicenceCategoryManagerProps) {
  const [licenceCategories, setLicenceCategories] = useState<
    LicenceCategory[]
  >([])
  const [assignments, setAssignments] = useState<
    InstructorLicenceCategoryWithDetails[]
  >([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [processingCategoryId, setProcessingCategoryId] =
    useState<string | null>(null)
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null)
  const [successMessage, setSuccessMessage] =
    useState<string | null>(null)

  const processingCategoryIdRef = useRef<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    Promise.all([
      getActiveLicenceCategories(drivingSchoolId),
      getInstructorLicenceCategories(
        instructor.id,
        drivingSchoolId,
      ),
    ])
      .then(([categories, instructorAssignments]) => {
        if (!isCancelled) {
          setLicenceCategories(categories)
          setAssignments(instructorAssignments)
          setErrorMessage(null)
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Unable to load licence-category assignments.',
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
  }, [drivingSchoolId, instructor.id])

  const assignedCategoryIds = useMemo(
    () =>
      new Set(
        assignments.map(
          (assignment) => assignment.licence_category_id,
        ),
      ),
    [assignments],
  )

  const availableCategories = useMemo(
    () =>
      licenceCategories.filter(
        (category) => !assignedCategoryIds.has(category.id),
      ),
    [assignedCategoryIds, licenceCategories],
  )

  const isProcessing = processingCategoryId !== null

  async function handleAssign() {
    if (!selectedCategoryId || processingCategoryIdRef.current) {
      return
    }

    const selectedCategory = licenceCategories.find(
      (category) => category.id === selectedCategoryId,
    )

    if (!selectedCategory) {
      setErrorMessage('Select a valid licence category.')
      return
    }

    processingCategoryIdRef.current = selectedCategoryId
    setProcessingCategoryId(selectedCategoryId)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const assignment = await assignInstructorLicenceCategory({
        instructor_id: instructor.id,
        licence_category_id: selectedCategory.id,
        driving_school_id: drivingSchoolId,
      })

      const assignmentWithDetails: InstructorLicenceCategoryWithDetails =
        {
          ...assignment,
          licence_category: selectedCategory,
        }

      setAssignments((current) =>
        [...current, assignmentWithDetails].sort(
          (first, second) =>
            first.licence_category.code.localeCompare(
              second.licence_category.code,
            ),
        ),
      )

      setSelectedCategoryId('')
      setSuccessMessage(
        `${selectedCategory.code} – ${selectedCategory.name} assigned successfully.`,
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to assign licence category.',
      )
    } finally {
      processingCategoryIdRef.current = null
      setProcessingCategoryId(null)
    }
  }

  async function handleRemove(
    assignment: InstructorLicenceCategoryWithDetails,
  ) {
    if (processingCategoryIdRef.current) {
      return
    }

    processingCategoryIdRef.current =
      assignment.licence_category_id
    setProcessingCategoryId(assignment.licence_category_id)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await removeInstructorLicenceCategory(
        instructor.id,
        assignment.licence_category_id,
        drivingSchoolId,
      )

      setAssignments((current) =>
        current.filter(
          (currentAssignment) =>
            currentAssignment.licence_category_id !==
            assignment.licence_category_id,
        ),
      )

      setSuccessMessage(
        `${assignment.licence_category.code} – ${assignment.licence_category.name} removed successfully.`,
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to remove licence category.',
      )
    } finally {
      processingCategoryIdRef.current = null
      setProcessingCategoryId(null)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Instructor Licence Categories
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage the licence categories that{' '}
            <span className="font-medium text-slate-700">
              {instructor.full_name}
            </span>{' '}
            is qualified to teach.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Close
        </button>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center">
          <p className="font-medium text-slate-900">
            Loading licence categories...
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label
              htmlFor="licence-category"
              className="block text-sm font-medium text-slate-700"
            >
              Assign licence category
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <select
                id="licence-category"
                value={selectedCategoryId}
                onChange={(event) =>
                  setSelectedCategoryId(event.target.value)
                }
                disabled={
                  availableCategories.length === 0 || isProcessing
                }
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">
                  {availableCategories.length === 0
                    ? 'All active categories are assigned'
                    : 'Select a licence category'}
                </option>

                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.code} – {category.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => void handleAssign()}
                disabled={!selectedCategoryId || isProcessing}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processingCategoryId === selectedCategoryId
                  ? 'Assigning...'
                  : 'Assign Category'}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3">
              <h3 className="font-semibold text-slate-900">
                Assigned Categories
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {assignments.length}{' '}
                {assignments.length === 1
                  ? 'category assigned'
                  : 'categories assigned'}
              </p>
            </div>

            {assignments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
                <p className="font-medium text-slate-900">
                  No licence categories assigned
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Select a category above to create the first
                  assignment.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => {
                  const isRemoving =
                    processingCategoryId ===
                    assignment.licence_category_id

                  return (
                    <div
                      key={assignment.licence_category_id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {assignment.licence_category.code} –{' '}
                          {assignment.licence_category.name}
                        </p>

                        {assignment.licence_category.description && (
                          <p className="mt-1 text-sm text-slate-500">
                            {
                              assignment.licence_category
                                .description
                            }
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          void handleRemove(assignment)
                        }
                        disabled={isProcessing}
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isRemoving ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default InstructorLicenceCategoryManager