import React, { useState } from 'react'
import { FinancialSummaryCards } from '../components/FinancialSummaryCards'
import { PackageCard } from '../components/PackageCard'
import { PackageModal } from '../components/PackageModal'
import { PaymentLedgerTable } from '../components/PaymentLedgerTable'
import { RecordPaymentModal } from '../components/RecordPaymentModal'
import { useFinancialOverview } from '../hooks/useFinancialOverview'
import { usePackages } from '../hooks/usePackages'
import type {
  Package,
  RecordPaymentInput,
  StudentFinancialLedger,
} from '../types/financials'
import { recordStudentPayment } from '../services/financialService'

interface FinancialManagementPageProps {
  drivingSchoolId: string
}

export const FinancialManagementPage: React.FC<
  FinancialManagementPageProps
> = ({ drivingSchoolId }) => {
  const [activeTab, setActiveTab] = useState<'ledgers' | 'packages'>('ledgers')

  // Financial Overview Hook
  const {
    filteredLedgers,
    filters,
    metrics,
    isLoading: isFinancialsLoading,
    errorMessage: financialsError,
    setFilter,
    resetFilters,
    reloadAll,
  } = useFinancialOverview(drivingSchoolId)

  // Packages Hook
  const {
    packages,
    isLoading: isPackagesLoading,
    errorMessage: packagesError,
    handleCreatePackage,
    handleUpdatePackage,
  } = usePackages(drivingSchoolId)

  // Modals state
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false)
  const [selectedLedgerForPayment, setSelectedLedgerForPayment] =
    useState<StudentFinancialLedger | null>(null)

  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false)
  const [selectedPackageForEdit, setSelectedPackageForEdit] =
    useState<Package | null>(null)

  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const handleOpenRecordPayment = (ledger?: StudentFinancialLedger) => {
    setSelectedLedgerForPayment(ledger || filteredLedgers[0] || null)
    setIsRecordPaymentOpen(true)
  }

  const handleOpenCreatePackage = () => {
    setSelectedPackageForEdit(null)
    setIsPackageModalOpen(true)
  }

  const handleOpenEditPackage = (pkg: Package) => {
    setSelectedPackageForEdit(pkg)
    setIsPackageModalOpen(true)
  }

  const handleSavePaymentDirect = async (input: RecordPaymentInput) => {
    await recordStudentPayment(input)
    await reloadAll()
    setActionSuccess(
      `Payment of LKR ${Number(input.amount).toLocaleString('en-LK')} recorded. Receipt #${input.receipt_number}`,
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Financials & Course Packages
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Manage student payment instalments, track outstanding fee balances, and configure course package fees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="inline-flex rounded-xl bg-slate-200/80 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('ledgers')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ledgers'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💳 Student Ledgers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('packages')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'packages'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📦 Course Packages
            </button>
          </div>

          {activeTab === 'ledgers' ? (
            <button
              type="button"
              onClick={() => handleOpenRecordPayment()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
            >
              + Record Payment
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenCreatePackage}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
            >
              + Create Package
            </button>
          )}
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <FinancialSummaryCards metrics={metrics} />

      {/* Alerts */}
      {(financialsError || packagesError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
          {financialsError || packagesError}
        </div>
      )}

      {actionSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'ledgers' ? (
        isFinancialsLoading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-xs font-medium text-slate-500">
                Loading financial ledgers...
              </p>
            </div>
          </div>
        ) : (
          <PaymentLedgerTable
            ledgers={filteredLedgers}
            filters={filters}
            onFilterChange={setFilter}
            onResetFilters={resetFilters}
            onOpenRecordPayment={handleOpenRecordPayment}
          />
        )
      ) : isPackagesLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-xs font-medium text-slate-500">
              Loading course packages...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onEdit={handleOpenEditPackage}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        drivingSchoolId={drivingSchoolId}
        ledger={selectedLedgerForPayment}
        onSavePayment={handleSavePaymentDirect}
      />

      <PackageModal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        drivingSchoolId={drivingSchoolId}
        existingPackage={selectedPackageForEdit}
        onSave={async (input) => {
          if (selectedPackageForEdit) {
            await handleUpdatePackage(selectedPackageForEdit.id, input)
          } else {
            await handleCreatePackage(input as any)
          }
        }}
      />
    </div>
  )
}

export default FinancialManagementPage
