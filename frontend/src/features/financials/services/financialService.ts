import { supabase } from '../../../lib/supabase'
import type {
  CreatePackageInput,
  EnrolStudentPackageInput,
  Package,
  RecordPaymentInput,
  StudentFinancialLedger,
  StudentPackageEnrolment,
  StudentPayment,
  UpdatePackageInput,
} from '../types/financials'
import { generateReceiptNumber, getPaymentStatus } from '../utils/financialUtils'

// ==========================================
// 1. Packages
// ==========================================

export async function getPackages(
  drivingSchoolId: string,
): Promise<Package[]> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('driving_school_id', drivingSchoolId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to load packages: ${error.message}`)
  }

  return (data as Package[]) ?? []
}

export async function createPackage(
  input: CreatePackageInput,
): Promise<Package> {
  const { data, error } = await supabase
    .from('packages')
    .insert([
      {
        driving_school_id: input.driving_school_id,
        name: input.name,
        code: input.code.toUpperCase(),
        description: input.description ?? null,
        fee: input.fee,
        practical_hours_included: input.practical_hours_included ?? 15,
        theory_classes_included: input.theory_classes_included ?? 5,
        is_active: true,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create package: ${error.message}`)
  }

  return data as Package
}

export async function updatePackage(
  id: string,
  input: UpdatePackageInput,
): Promise<Package> {
  const { data, error } = await supabase
    .from('packages')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update package: ${error.message}`)
  }

  return data as Package
}

export async function deletePackage(id: string): Promise<void> {
  const { error } = await supabase.from('packages').delete().eq('id', id)
  if (error) {
    throw new Error(`Failed to delete package: ${error.message}`)
  }
}

// ==========================================
// 2. Student Package Enrolments
// ==========================================

export async function getStudentEnrolment(
  studentId: string,
): Promise<(StudentPackageEnrolment & { package: Package }) | null> {
  const { data, error } = await supabase
    .from('student_package_enrolments')
    .select('*, package:packages(*)')
    .eq('student_id', studentId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load student enrolment: ${error.message}`)
  }

  return (data as (StudentPackageEnrolment & { package: Package })) ?? null
}

export async function enrolStudentPackage(
  input: EnrolStudentPackageInput,
): Promise<StudentPackageEnrolment> {
  // If an existing active enrolment exists, mark it completed or replaced
  await supabase
    .from('student_package_enrolments')
    .update({ status: 'completed' })
    .eq('student_id', input.student_id)

  const { data, error } = await supabase
    .from('student_package_enrolments')
    .insert([
      {
        driving_school_id: input.driving_school_id,
        student_id: input.student_id,
        package_id: input.package_id,
        agreed_total_fee: input.agreed_total_fee,
        discount_amount: input.discount_amount ?? 0,
        status: 'active',
        notes: input.notes ?? null,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to enrol student in package: ${error.message}`)
  }

  return data as StudentPackageEnrolment
}

// ==========================================
// 3. Student Payments
// ==========================================

export async function getStudentPayments(
  studentId: string,
): Promise<StudentPayment[]> {
  const { data, error } = await supabase
    .from('student_payments')
    .select('*')
    .eq('student_id', studentId)
    .order('payment_date', { ascending: false })

  if (error) {
    throw new Error(`Failed to load payments: ${error.message}`)
  }

  return (data as StudentPayment[]) ?? []
}

export async function recordStudentPayment(
  input: RecordPaymentInput,
): Promise<StudentPayment> {
  const receiptNum = input.receipt_number || generateReceiptNumber()

  const { data, error } = await supabase
    .from('student_payments')
    .insert([
      {
        driving_school_id: input.driving_school_id,
        student_id: input.student_id,
        enrolment_id: input.enrolment_id ?? null,
        receipt_number: receiptNum,
        payment_date: input.payment_date,
        amount: input.amount,
        payment_method: input.payment_method,
        payment_reference: input.payment_reference ?? null,
        notes: input.notes ?? null,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to record payment: ${error.message}`)
  }

  return data as StudentPayment
}

export async function deletePayment(id: string): Promise<void> {
  const { error } = await supabase
    .from('student_payments')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete payment: ${error.message}`)
  }
}

// ==========================================
// 4. Financial Ledgers & Overviews
// ==========================================

export async function getStudentFinancialLedger(
  studentId: string,
): Promise<StudentFinancialLedger> {
  const [studentRes, enrolment, payments] = await Promise.all([
    supabase
      .from('students')
      .select('id, full_name, admission_number, phone, email, branches(name)')
      .eq('id', studentId)
      .single(),
    getStudentEnrolment(studentId),
    getStudentPayments(studentId),
  ])

  if (studentRes.error || !studentRes.data) {
    throw new Error(`Student not found: ${studentRes.error?.message}`)
  }

  const s = studentRes.data
  const totalFee = enrolment
    ? Math.max(0, Number(enrolment.agreed_total_fee) - Number(enrolment.discount_amount))
    : 0

  const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount), 0)
  const balance = Math.max(0, totalFee - totalPaid)
  const statusInfo = getPaymentStatus(totalFee, totalPaid)
  const percentagePaid = totalFee > 0 ? Math.min(100, Math.round((totalPaid / totalFee) * 100)) : 0

  return {
    student: {
      id: s.id,
      full_name: s.full_name,
      admission_number: s.admission_number ?? '—',
      phone: s.phone ?? null,
      email: s.email ?? null,
      branch_name: (s.branches as any)?.name ?? 'Main Branch',
    },
    enrolment,
    payments,
    totalFee,
    totalPaid,
    balance,
    paymentStatus: statusInfo.status,
    percentagePaid,
  }
}

export async function getAllFinancialLedgers(
  drivingSchoolId: string,
): Promise<StudentFinancialLedger[]> {
  const { data: students, error: studError } = await supabase
    .from('students')
    .select('id, full_name, admission_number, phone, email, branches(name)')
    .eq('driving_school_id', drivingSchoolId)
    .eq('is_active', true)
    .order('full_name', { ascending: true })

  if (studError || !students) {
    throw new Error(`Failed to load students: ${studError?.message}`)
  }

  const studentIds = students.map((s) => s.id)
  if (studentIds.length === 0) return []

  const [enrolmentsRes, paymentsRes] = await Promise.all([
    supabase
      .from('student_package_enrolments')
      .select('*, package:packages(*)')
      .eq('driving_school_id', drivingSchoolId)
      .eq('status', 'active'),
    supabase
      .from('student_payments')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
  ])

  const enrolmentsMap = new Map<string, StudentPackageEnrolment & { package: Package }>()
  for (const e of (enrolmentsRes.data as (StudentPackageEnrolment & { package: Package })[]) ?? []) {
    enrolmentsMap.set(e.student_id, e)
  }

  const paymentsMap = new Map<string, StudentPayment[]>()
  for (const p of (paymentsRes.data as StudentPayment[]) ?? []) {
    const list = paymentsMap.get(p.student_id) || []
    list.push(p)
    paymentsMap.set(p.student_id, list)
  }

  return students.map((s) => {
    const enrolment = enrolmentsMap.get(s.id) || null
    const payments = paymentsMap.get(s.id) || []

    const totalFee = enrolment
      ? Math.max(0, Number(enrolment.agreed_total_fee) - Number(enrolment.discount_amount))
      : 0
    const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount), 0)
    const balance = Math.max(0, totalFee - totalPaid)
    const statusInfo = getPaymentStatus(totalFee, totalPaid)
    const percentagePaid = totalFee > 0 ? Math.min(100, Math.round((totalPaid / totalFee) * 100)) : 0

    return {
      student: {
        id: s.id,
        full_name: s.full_name,
        admission_number: s.admission_number ?? '—',
        phone: s.phone ?? null,
        email: s.email ?? null,
        branch_name: (s.branches as any)?.name ?? 'Main Branch',
      },
      enrolment,
      payments,
      totalFee,
      totalPaid,
      balance,
      paymentStatus: statusInfo.status,
      percentagePaid,
    }
  })
}

export async function getAllRecentPayments(
  drivingSchoolId: string,
): Promise<StudentPayment[]> {
  const { data, error } = await supabase
    .from('student_payments')
    .select('*, student:students(id, full_name, admission_number, phone)')
    .eq('driving_school_id', drivingSchoolId)
    .order('payment_date', { ascending: false })
    .limit(100)

  if (error) {
    throw new Error(`Failed to load recent payments: ${error.message}`)
  }

  return (data as unknown as StudentPayment[]) ?? []
}
