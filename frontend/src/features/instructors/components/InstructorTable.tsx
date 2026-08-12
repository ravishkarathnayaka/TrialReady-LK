import { useMemo, useRef, useState } from 'react'
import type { Branch } from '../../branches/types/branch'
import type { Instructor } from '../types/instructor'

type InstructorStatusFilter = 'all' | 'active' | 'inactive'

interface InstructorTableProps {
  instructors: Instructor[]
  branches: Branch[]
  onEdit: (instructor: Instructor) => void
  onToggleActive: (instructor: Instructor) => Promise<void>
}

function InstructorTable({
  instructors,
  branches,
  onEdit,
  onToggleActive,
}: InstructorTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<InstructorStatusFilter>('all')

  const [updatingInstructorId, setUpdatingInstructorId] =
    useState<string | null>(null)

  const updatingInstructorIdRef = useRef<string | null>(null)

  const isUpdatingAnyInstructor =
    updatingInstructorId !== null

  const branchNames = useMemo(
    () =>
      new Map(
        branches.map((branch) => [
          branch.id,
          branch.name,
        ]),
      ),
    [branches],
  )

  const filteredInstructors = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase()

    return instructors.filter((instructor) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' &&
          instructor.is_active) ||
        (statusFilter === 'inactive' &&
          !instructor.is_active)

      if (!matchesStatus) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const branchName = instructor.branch_id
        ? branchNames.get(instructor.branch_id) ?? ''
        : ''

      const searchableValues = [
        instructor.full_name,
        instructor.employee_code ?? '',
        instructor.nic ?? '',
        instructor.phone ?? '',
        instructor.email ?? '',
        instructor.driving_licence_number ?? '',
        branchName,
      ]

      return searchableValues.some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      )
    })
  }, [
    instructors,
    searchTerm,
    statusFilter,
    branchNames,
  ])

  async function handleToggleActive(
    instructor: Instructor,
  ) {
    if (updatingInstructorIdRef.current !== null) {
      return
    }

    updatingInstructorIdRef.current = instructor.id
    setUpdatingInstructorId(instructor.id)

    try {
      await onToggleActive(instructor)
    } finally {
      if (
        updatingInstructorIdRef.current === instructor.id
      ) {
        updatingInstructorIdRef.current = null
        setUpdatingInstructorId(null)
      }
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Instructors
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredInstructors.length} of{' '}
            {instructors.length}{' '}
            {instructors.length === 1
              ? 'instructor'
              : 'instructors'}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search instructors..."
            aria-label="Search instructors"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target
                  .value as InstructorStatusFilter,
              )
            }
            aria-label="Filter instructors by status"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
          >
            <option value="all">
              All instructors
            </option>
            <option value="active">Active</option>
            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>
      </div>

      {filteredInstructors.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="font-medium text-slate-900">
            No instructors found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {instructors.length === 0
              ? 'Add the first instructor for this driving school.'
              : 'Try changing the search term or status filter.'}
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
                  Instructor
                </th>

                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Branch
                </th>

                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Contact
                </th>

                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Licence
                </th>

                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Status
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
              {filteredInstructors.map(
                (instructor) => {
                  const isUpdating =
                    updatingInstructorId ===
                    instructor.id

                  const branchName =
                    instructor.branch_id
                      ? branchNames.get(
                          instructor.branch_id,
                        ) ?? 'Unknown branch'
                      : 'Not assigned'

                  return (
                    <tr key={instructor.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {instructor.full_name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {instructor.employee_code ||
                            'No employee code'}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {branchName}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {instructor.phone ||
                        instructor.email ? (
                          <>
                            {instructor.phone && (
                              <p>
                                {instructor.phone}
                              </p>
                            )}

                            {instructor.email && (
                              <p className="mt-1">
                                {instructor.email}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400">
                            Not provided
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {instructor.driving_licence_number ? (
                          <>
                            <p>
                              {
                                instructor.driving_licence_number
                              }
                            </p>

                            {instructor.driving_licence_expiry_date && (
                              <p className="mt-1 text-xs text-slate-500">
                                Expires:{' '}
                                {
                                  instructor.driving_licence_expiry_date
                                }
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400">
                            Not provided
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            instructor.is_active
                              ? 'inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700'
                              : 'inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600'
                          }
                        >
                          {instructor.is_active
                            ? 'Active'
                            : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onEdit(instructor)
                            }
                            disabled={
                              isUpdatingAnyInstructor
                            }
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void handleToggleActive(
                                instructor,
                              )
                            }
                            disabled={
                              isUpdatingAnyInstructor
                            }
                            className={
                              instructor.is_active
                                ? 'rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60'
                                : 'rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60'
                            }
                          >
                            {isUpdating
                              ? 'Updating...'
                              : instructor.is_active
                                ? 'Deactivate'
                                : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                },
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default InstructorTable