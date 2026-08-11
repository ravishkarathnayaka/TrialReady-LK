import { useMemo, useState } from 'react'
import type { Student } from '../types/student'

interface StudentTableProps {
  students: Student[]
  isLoading?: boolean
  onEdit?: (student: Student) => void
  onManageEnrolment?: (student: Student) => void
  onToggleStatus?: (student: Student) => void
}

type StatusFilter = 'all' | 'active' | 'inactive'

function StudentTable({
  students,
  isLoading = false,
  onEdit,
  onManageEnrolment,
  onToggleStatus,
}: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('all')

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return students.filter((student) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && student.is_active) ||
        (statusFilter === 'inactive' && !student.is_active)

      if (!matchesStatus) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const searchableValues = [
        student.full_name,
        student.student_code,
        student.nic,
        student.phone,
        student.email,
      ]

      return searchableValues.some((value) =>
        value?.toLowerCase().includes(normalizedSearch),
      )
    })
  }, [students, searchTerm, statusFilter])

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          Loading students...
        </p>
      </div>
    )
  }

  return (
    <section className="rounded-2xl bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Students
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredStudents.length} of {students.length} students
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search students..."
              aria-label="Search students"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as StatusFilter,
                )
              }
              aria-label="Filter students by status"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">All students</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="p-10 text-center">
          <p className="font-medium text-slate-700">
            No students found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Try changing the search term or status filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Student
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NIC
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Contact
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Registered
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="font-medium text-slate-900">
                      {student.full_name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {student.student_code || 'No student code'}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                    {student.nic || '—'}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">
                      {student.phone || '—'}
                    </p>

                    {student.email && (
                      <p className="mt-1 text-xs text-slate-500">
                        {student.email}
                      </p>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                    {student.registration_date}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${student.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      {student.is_active
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(student)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                      )}

                      {onManageEnrolment && (
                        <button
                          type="button"
                          onClick={() => onManageEnrolment(student)}
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
                        >
                          Licence Categories
                        </button>
                      )}

                      {onToggleStatus && (
                        <button
                          type="button"
                          onClick={() =>
                            onToggleStatus(student)
                          }
                          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${student.is_active
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                        >
                          {student.is_active
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default StudentTable