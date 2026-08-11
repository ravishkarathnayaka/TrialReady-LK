import { useEffect, useMemo, useState } from 'react'
import {
  enrolStudentInLicenceCategory,
  getLicenceCategories,
  getStudentLicenceEnrolments,
  removeStudentLicenceEnrolment,
} from '../services/studentEnrolmentService'

import type {
  LicenceCategory,
  StudentLicenceEnrolment as StudentLicenceEnrolmentRecord,
} from '../types/studentEnrolment'

interface StudentLicenceEnrolmentProps {
  studentId: string
  drivingSchoolId: string
}

function StudentLicenceEnrolment({
  studentId,
  drivingSchoolId,
}: StudentLicenceEnrolmentProps) {
  const [licenceCategories, setLicenceCategories] = useState<
    LicenceCategory[]
  >([])
  const [enrolments, setEnrolments] = useState<
  StudentLicenceEnrolmentRecord[]
>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingCategoryId, setSavingCategoryId] = useState<string | null>(
    null,
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    Promise.all([
      getLicenceCategories(drivingSchoolId),
      getStudentLicenceEnrolments(studentId),
    ])
      .then(([categories, studentEnrolments]) => {
        if (isCancelled) {
          return
        }

        setLicenceCategories(categories)
        setEnrolments(studentEnrolments)
        setErrorMessage(null)
      })
      .catch((error: unknown) => {
        if (isCancelled) {
          return
        }

        console.error(error)

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load licence enrolment information.',
        )
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [drivingSchoolId, studentId])

  const activeLicenceCategoryIds = useMemo(
    () =>
      new Set(
        enrolments
          .filter((enrolment) => enrolment.is_active)
          .map((enrolment) => enrolment.licence_category_id),
      ),
    [enrolments],
  )

  async function handleToggleLicenceCategory(
  licenceCategoryId: string,
) {
  const existingEnrolment = enrolments.find(
    (enrolment) =>
      enrolment.licence_category_id === licenceCategoryId,
  )

  setSavingCategoryId(licenceCategoryId)
  setErrorMessage(null)

  try {
    if (existingEnrolment) {
      await removeStudentLicenceEnrolment(
        studentId,
        licenceCategoryId,
      )

      setEnrolments((current) =>
        current.filter(
          (enrolment) =>
            enrolment.licence_category_id !== licenceCategoryId,
        ),
      )
    } else {
      const createdEnrolment =
        await enrolStudentInLicenceCategory({
          student_id: studentId,
          licence_category_id: licenceCategoryId,
          driving_school_id: drivingSchoolId,
        })

      setEnrolments((current) => [
        ...current,
        createdEnrolment,
      ])
    }
  } catch (error) {
    console.error(error)

    setErrorMessage(
      error instanceof Error
        ? error.message
        : 'Unable to update licence enrolment.',
    )
  } finally {
    setSavingCategoryId(null)
  }
}

  if (isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">
          Loading licence categories...
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Licence Category Enrolment
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Select the licence categories this student is enrolled in.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {licenceCategories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-5 text-center">
          <p className="text-sm text-slate-500">
            No active licence categories are available.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {licenceCategories.map((category) => {
            const isActive = activeLicenceCategoryIds.has(category.id)
            const isSaving = savingCategoryId === category.id

            return (
              <button
                key={category.id}
                type="button"
                disabled={isSaving}
                onClick={() => {
                  void handleToggleLicenceCategory(category.id)
                }}
                className={`rounded-xl border p-4 text-left transition ${
                  isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {category.code}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {category.name}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isSaving
                      ? 'Saving...'
                      : isActive
                        ? 'Enrolled'
                        : 'Not enrolled'}
                  </span>
                </div>

                {category.description && (
                  <p className="mt-3 text-xs text-slate-500">
                    {category.description}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default StudentLicenceEnrolment