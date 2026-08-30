export type PaymentMethod =
  | 'cash'
  | 'bank_transfer'
  | 'card'
  | 'cheque'
  | 'online'

export type PaymentStatus = 'fully_paid' | 'partially_paid' | 'unpaid'

export interface Package {
  id: string
  driving_school_id: string
  name: string
  code: string
  description: string | null
  fee: number
  practical_hours_included: number
  theory_classes_included: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StudentPackageEnrolment {
  id: string
  driving_school_id: string
  student_id: string
  package_id: string
  enrolled_date: string
  agreed_total_fee: number
  discount_amount: number
  status: 'active' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
  package?: Package
}

export interface StudentPayment {
  id: string
  driving_school_id: string
  student_id: string
  enrolment_id: string | null
  receipt_number: string
  payment_date: string
  amount: number
  payment_method: PaymentMethod
  payment_reference: string | null
  collected_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
  student?: {
    id: string
    full_name: string
    admission_number: string
    phone: string | null
  }
}

export interface StudentFinancialLedger {
  student: {
    id: string
    full_name: string
    admission_number: string
    phone: string | null
    email: string | null
    branch_name?: string
  }
  enrolment: (StudentPackageEnrolment & { package: Package }) | null
  payments: StudentPayment[]
  totalFee: number
  totalPaid: number
  balance: number
  paymentStatus: PaymentStatus
  percentagePaid: number
}

export interface CreatePackageInput {
  driving_school_id: string
  name: string
  code: string
  description?: string | null
  fee: number
  practical_hours_included?: number
  theory_classes_included?: number
}

export interface UpdatePackageInput {
  name?: string
  code?: string
  description?: string | null
  fee?: number
  practical_hours_included?: number
  theory_classes_included?: number
  is_active?: boolean
}

export interface EnrolStudentPackageInput {
  driving_school_id: string
  student_id: string
  package_id: string
  agreed_total_fee: number
  discount_amount?: number
  notes?: string | null
}

export interface RecordPaymentInput {
  driving_school_id: string
  student_id: string
  enrolment_id?: string | null
  receipt_number?: string
  payment_date: string
  amount: number
  payment_method: PaymentMethod
  payment_reference?: string | null
  notes?: string | null
}
