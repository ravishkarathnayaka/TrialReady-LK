import { useMemo, useRef, useState } from 'react'
import type { Branch } from '../types/branch'

type BranchStatusFilter = 'all' | 'active' | 'inactive'

interface BranchTableProps {
    branches: Branch[]
    onEdit: (branch: Branch) => void
    onToggleActive: (branch: Branch) => Promise<void>
}

function BranchTable({
    branches,
    onEdit,
    onToggleActive,
}: BranchTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] =
        useState<BranchStatusFilter>('all')
    const [updatingBranchId, setUpdatingBranchId] =
        useState<string | null>(null)

    const updatingBranchIdRef = useRef<string | null>(null)
    const isUpdatingAnyBranch = updatingBranchId !== null

    const filteredBranches = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase()

        return branches.filter((branch) => {
            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && branch.is_active) ||
                (statusFilter === 'inactive' && !branch.is_active)

            if (!matchesStatus) {
                return false
            }

            if (!normalizedSearch) {
                return true
            }

            const searchableValues = [
                branch.name,
                branch.address ?? '',
                branch.phone ?? '',
                branch.email ?? '',
            ]

            return searchableValues.some((value) =>
                value.toLowerCase().includes(normalizedSearch),
            )
        })
    }, [branches, searchTerm, statusFilter])

    async function handleToggleActive(branch: Branch) {
        if (updatingBranchIdRef.current !== null) {
            return
        }

        updatingBranchIdRef.current = branch.id
        setUpdatingBranchId(branch.id)

        try {
            await onToggleActive(branch)
        } finally {
            if (updatingBranchIdRef.current === branch.id) {
                updatingBranchIdRef.current = null
                setUpdatingBranchId(null)
            }
        }
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        Branches
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {filteredBranches.length} of {branches.length}{' '}
                        {branches.length === 1 ? 'branch' : 'branches'}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        placeholder="Search branches..."
                        aria-label="Search branches"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
                    />

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value as BranchStatusFilter,
                            )
                        }
                        aria-label="Filter branches by status"
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
                    >
                        <option value="all">All branches</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {filteredBranches.length === 0 ? (
                <div className="px-6 py-16 text-center">
                    <p className="font-medium text-slate-900">
                        No branches found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        {branches.length === 0
                            ? 'Add the first branch for this driving school.'
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
                                    Address
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
                            {filteredBranches.map((branch) => {
                                const isUpdating =
                                    updatingBranchId === branch.id

                                return (
                                    <tr key={branch.id}>
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-slate-900">
                                                {branch.name}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-slate-600">
                                            {branch.phone || branch.email ? (
                                                <>
                                                    {branch.phone && (
                                                        <p>{branch.phone}</p>
                                                    )}

                                                    {branch.email && (
                                                        <p className="mt-1">
                                                            {branch.email}
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-slate-400">
                                                    Not provided
                                                </span>
                                            )}
                                        </td>

                                        <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                                            {branch.address ?? (
                                                <span className="text-slate-400">
                                                    Not provided
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={
                                                    branch.is_active
                                                        ? 'inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700'
                                                        : 'inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600'
                                                }
                                            >
                                                {branch.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(branch)}
                                                    disabled={isUpdatingAnyBranch}
                                                    className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        void handleToggleActive(branch)
                                                    }
                                                    disabled={isUpdatingAnyBranch}
                                                    className={
                                                        branch.is_active
                                                            ? 'rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60'
                                                            : 'rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60'
                                                    }
                                                >
                                                    {isUpdating
                                                        ? 'Updating...'
                                                        : branch.is_active
                                                            ? 'Deactivate'
                                                            : 'Activate'}
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

export default BranchTable