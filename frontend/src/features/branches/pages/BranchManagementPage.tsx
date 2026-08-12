import { useEffect, useState } from 'react'
import BranchForm from '../components/BranchForm'
import BranchTable from '../components/BranchTable'
import {
  createBranch,
  getBranches,
  setBranchActiveStatus,
  updateBranch,
} from '../services/branchService'
import type {
  Branch,
  CreateBranchInput,
  UpdateBranchInput,
} from '../types/branch'

interface BranchManagementPageProps {
  drivingSchoolId: string
}

function BranchManagementPage({
  drivingSchoolId,
}: BranchManagementPageProps) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [editingBranch, setEditingBranch] =
    useState<Branch | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null)
  const [successMessage, setSuccessMessage] =
    useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    getBranches()
      .then((data) => {
        if (!isCancelled) {
          setBranches(data)
          setErrorMessage(null)
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Unable to load branches.',
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
    setEditingBranch(null)
    setSuccessMessage(null)
    setErrorMessage(null)
    setIsFormOpen(true)
  }

  function openEditForm(branch: Branch) {
    setEditingBranch(branch)
    setSuccessMessage(null)
    setErrorMessage(null)
    setIsFormOpen(true)
  }

  function closeForm() {
    setEditingBranch(null)
    setIsFormOpen(false)
  }

  async function handleSave(
    input: CreateBranchInput | UpdateBranchInput,
  ) {
    if (editingBranch) {
      const updatedBranch = await updateBranch(
        editingBranch.id,
        input as UpdateBranchInput,
      )

      setBranches((current) =>
        current
          .map((branch) =>
            branch.id === updatedBranch.id
              ? updatedBranch
              : branch,
          )
          .sort((a, b) => a.name.localeCompare(b.name)),
      )

      setSuccessMessage('Branch updated successfully.')
    } else {
      const createdBranch = await createBranch(
        input as CreateBranchInput,
      )

      setBranches((current) =>
        [...current, createdBranch].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      )

      setSuccessMessage('Branch added successfully.')
    }

    setErrorMessage(null)
    closeForm()
  }

  async function handleToggleActive(branch: Branch) {
    try {
      setErrorMessage(null)
      setSuccessMessage(null)

      const updatedBranch = await setBranchActiveStatus(
        branch.id,
        !branch.is_active,
      )

      setBranches((current) =>
        current.map((currentBranch) =>
          currentBranch.id === updatedBranch.id
            ? updatedBranch
            : currentBranch,
        ),
      )

      setSuccessMessage(
        updatedBranch.is_active
          ? 'Branch activated successfully.'
          : 'Branch deactivated successfully.',
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to update branch status.',
      )
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Branch Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, view and manage driving school branches.
            </p>
          </div>

          {!isFormOpen && (
            <button
              type="button"
              onClick={openCreateForm}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Add Branch
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
            <BranchForm
              key={editingBranch?.id ?? 'new-branch'}
              drivingSchoolId={drivingSchoolId}
              initialBranch={editingBranch ?? undefined}
              onSubmit={handleSave}
              onCancel={closeForm}
            />
          </div>
        )}

        {isLoading ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="font-medium text-slate-900">
              Loading branches...
            </p>
          </section>
        ) : (
          <BranchTable
            branches={branches}
            onEdit={openEditForm}
            onToggleActive={handleToggleActive}
          />
        )}
      </div>
    </main>
  )
}

export default BranchManagementPage