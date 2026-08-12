import { useEffect, useState } from 'react'
import { getBranches } from '../../branches/services/branchService'
import type { Branch } from '../../branches/types/branch'
import InstructorForm from '../components/InstructorForm'
import InstructorTable from '../components/InstructorTable'
import {
  createInstructor,
  getInstructors,
  setInstructorActiveStatus,
  updateInstructor,
} from '../services/instructorService'
import type {
  CreateInstructorInput,
  Instructor,
  UpdateInstructorInput,
} from '../types/instructor'

interface InstructorManagementPageProps {
  drivingSchoolId: string
}

function InstructorManagementPage({
  drivingSchoolId,
}: InstructorManagementPageProps) {
  const [instructors, setInstructors] = useState<Instructor[]>(
    [],
  )
  const [branches, setBranches] = useState<Branch[]>([])
  const [editingInstructor, setEditingInstructor] =
    useState<Instructor | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null)

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    Promise.all([getInstructors(), getBranches()])
      .then(([instructorData, branchData]) => {
        if (!isCancelled) {
          setInstructors(instructorData)
          setBranches(branchData)
          setErrorMessage(null)
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Unable to load instructor management data.',
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
  }, [])

  function openCreateForm() {
    setEditingInstructor(null)
    setSuccessMessage(null)
    setErrorMessage(null)
    setIsFormOpen(true)
  }

  function openEditForm(instructor: Instructor) {
    setEditingInstructor(instructor)
    setSuccessMessage(null)
    setErrorMessage(null)
    setIsFormOpen(true)
  }

  function closeForm() {
    setEditingInstructor(null)
    setIsFormOpen(false)
  }

  async function handleSave(
    input: CreateInstructorInput | UpdateInstructorInput,
  ) {
    try {
      setIsSaving(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      if (editingInstructor) {
        const updatedInstructor = await updateInstructor(
          editingInstructor.id,
          input as UpdateInstructorInput,
        )

        setInstructors((current) =>
          current
            .map((instructor) =>
              instructor.id === updatedInstructor.id
                ? updatedInstructor
                : instructor,
            )
            .sort((a, b) =>
              a.full_name.localeCompare(b.full_name),
            ),
        )

        setSuccessMessage(
          'Instructor updated successfully.',
        )
      } else {
        const createdInstructor = await createInstructor(
          input as CreateInstructorInput,
        )

        setInstructors((current) =>
          [...current, createdInstructor].sort((a, b) =>
            a.full_name.localeCompare(b.full_name),
          ),
        )

        setSuccessMessage(
          'Instructor added successfully.',
        )
      }

      closeForm()
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to save instructor.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleToggleActive(
    instructor: Instructor,
  ) {
    try {
      setErrorMessage(null)
      setSuccessMessage(null)

      const updatedInstructor =
        await setInstructorActiveStatus(
          instructor.id,
          !instructor.is_active,
        )

      setInstructors((current) =>
        current.map((currentInstructor) =>
          currentInstructor.id === updatedInstructor.id
            ? updatedInstructor
            : currentInstructor,
        ),
      )

      setSuccessMessage(
        updatedInstructor.is_active
          ? 'Instructor activated successfully.'
          : 'Instructor deactivated successfully.',
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to update instructor status.',
      )
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Instructor Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, view and manage driving school
              instructors.
            </p>
          </div>

          {!isFormOpen && (
            <button
              type="button"
              onClick={openCreateForm}
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add Instructor
            </button>
          )}
        </div>

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

        {isFormOpen && (
          <div className="mb-6">
            <InstructorForm
              key={
                editingInstructor?.id ?? 'new-instructor'
              }
              drivingSchoolId={drivingSchoolId}
              branches={branches}
              initialInstructor={
                editingInstructor ?? undefined
              }
              isSubmitting={isSaving}
              onSubmit={handleSave}
              onCancel={closeForm}
            />
          </div>
        )}

        {isLoading ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="font-medium text-slate-900">
              Loading instructors...
            </p>
          </section>
        ) : (
          <InstructorTable
            instructors={instructors}
            branches={branches}
            onEdit={openEditForm}
            onToggleActive={handleToggleActive}
          />
        )}
      </div>
    </main>
  )
}

export default InstructorManagementPage