import type { PaymentMethod, PaymentStatus } from '../types/financials'

export function formatLKR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'LKR 0.00'
  }
  return `LKR ${Number(amount).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function generateReceiptNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `REC-${dateStr}-${randomSuffix}`
}

export function getPaymentStatus(
  totalFee: number,
  totalPaid: number,
): {
  status: PaymentStatus
  label: string
  badgeClass: string
} {
  if (totalFee > 0 && totalPaid >= totalFee) {
    return {
      status: 'fully_paid',
      label: '✓ Fully Paid',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
    }
  }

  if (totalPaid > 0) {
    return {
      status: 'partially_paid',
      label: 'Partially Paid',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
    }
  }

  return {
    status: 'unpaid',
    label: 'Unpaid',
    badgeClass: 'bg-red-100 text-red-800 border-red-300 font-semibold',
  }
}

export function formatPaymentMethod(method: PaymentMethod): string {
  switch (method) {
    case 'cash':
      return '💵 Cash'
    case 'bank_transfer':
      return '🏦 Bank Transfer'
    case 'card':
      return '💳 Card Payment'
    case 'cheque':
      return '📄 Cheque'
    case 'online':
      return '🌐 Online Payment'
    default:
      return method
  }
}
