import { describe, it, expect } from 'vitest'
import {
  formatLKR,
  generateReceiptNumber,
  getPaymentStatus,
  formatPaymentMethod,
} from './financialUtils'

describe('financialUtils', () => {
  describe('formatLKR', () => {
    it('formats numbers to Sri Lankan Rupee currency string', () => {
      const formatted = formatLKR(45000)
      expect(formatted).toContain('LKR')
      expect(formatted).toContain('45,000.00')
    })

    it('handles 0 and invalid inputs gracefully', () => {
      expect(formatLKR(0)).toBe('LKR 0.00')
      expect(formatLKR(NaN)).toBe('LKR 0.00')
      // @ts-expect-error test invalid null input
      expect(formatLKR(null)).toBe('LKR 0.00')
    })
  })

  describe('generateReceiptNumber', () => {
    it('generates a valid receipt identifier in format REC-YYYYMMDD-XXXX', () => {
      const receipt = generateReceiptNumber()
      expect(receipt).toMatch(/^REC-\d{8}-\d{4}$/)
    })
  })

  describe('getPaymentStatus', () => {
    it('returns fully_paid when paid amount equals or exceeds fee', () => {
      const res = getPaymentStatus(50000, 50000)
      expect(res.status).toBe('fully_paid')
      expect(res.label).toContain('Fully Paid')
    })

    it('returns partially_paid when some payment is made but balance remains', () => {
      const res = getPaymentStatus(50000, 20000)
      expect(res.status).toBe('partially_paid')
      expect(res.label).toBe('Partially Paid')
    })

    it('returns unpaid when zero payment is made', () => {
      const res = getPaymentStatus(50000, 0)
      expect(res.status).toBe('unpaid')
      expect(res.label).toBe('Unpaid')
    })
  })

  describe('formatPaymentMethod', () => {
    it('formats payment method types with readable emoji labels', () => {
      expect(formatPaymentMethod('cash')).toContain('Cash')
      expect(formatPaymentMethod('bank_transfer')).toContain('Bank Transfer')
      expect(formatPaymentMethod('card')).toContain('Card')
      expect(formatPaymentMethod('online')).toContain('Online')
      expect(formatPaymentMethod('cheque')).toContain('Cheque')
    })
  })
})
