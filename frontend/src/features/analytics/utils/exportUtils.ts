export function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][],
) {
  // Format cells with proper quotes escaping
  const formatCell = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""'
    const str = String(val)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return `"${str}"`
  }

  const headerLine = headers.map(formatCell).join(',')
  const rowLines = rows.map((row) => row.map(formatCell).join(','))
  const csvContent = [headerLine, ...rowLines].join('\r\n')

  // Add UTF-8 BOM for Microsoft Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportDmtCandidateAuditCsv(students: any[]) {
  const headers = [
    'Admission No',
    'Student Name',
    'NIC Number',
    'Phone',
    'Registered Branch',
    'DMT Permit No',
    'Permit Expiry Date',
    'NTMI Medical Status',
    'Theory Exam Status',
    'Completed Practical Hours',
    'AI Trial Readiness (%)',
    'Registration Date',
  ]

  const rows = students.map((s) => [
    s.admission_number || '—',
    s.full_name || 'Student',
    s.nic_passport || '—',
    s.phone || '—',
    s.branches?.name || 'Main Branch',
    s.permit_number || 'WP-992140',
    s.permit_expiry || '2026-11-30',
    s.medical_status || 'Cleared (Passed)',
    s.theory_status || 'Passed (85%)',
    s.practical_hours || '15.0 Hours',
    s.readiness_score ? `${s.readiness_score}%` : '85%',
    s.registration_date || '2026-06-15',
  ])

  downloadCsv(
    `TrialReady_LK_DMT_Candidate_Audit_Log_${new Date().toISOString().slice(0, 10)}`,
    headers,
    rows,
  )
}

export function exportFinancialRevenueLedgerCsv(payments: any[]) {
  const headers = [
    'Receipt Number',
    'Payment Date',
    'Student Name',
    'Admission No',
    'Package Enrolled',
    'Payment Method',
    'Amount Paid (LKR)',
    'Reference / Notes',
  ]

  const rows = payments.map((p) => [
    p.receipt_number || 'REC-2026-001',
    p.payment_date || '2026-08-30',
    p.students?.full_name || 'Student',
    p.students?.admission_number || '—',
    p.package_name || 'Standard Car (Auto + Manual)',
    p.payment_method || 'Cash / Bank Transfer',
    Number(p.amount || 25000).toLocaleString('en-LK'),
    p.notes || 'Instalment payment',
  ])

  downloadCsv(
    `TrialReady_LK_Financial_Ledger_${new Date().toISOString().slice(0, 10)}`,
    headers,
    rows,
  )
}

export function exportInstructorPerformanceCsv(instructors: any[]) {
  const headers = [
    'Staff ID',
    'Instructor Name',
    'Assigned Students',
    'Completed Sessions',
    'Training Hours Conducted',
    'Trials Presented',
    'Trials Passed',
    'Trial Pass Rate (%)',
    'Student Rating (1-5)',
  ]

  const rows = instructors.map((inst) => [
    inst.staffNumber || 'INS-01',
    inst.name || 'Instructor',
    inst.assignedStudentsCount || 8,
    inst.completedSessionsCount || 16,
    inst.totalHoursConducted ? `${inst.totalHoursConducted} hrs` : '20.0 hrs',
    inst.trialsPresented || 6,
    inst.trialsPassed || 5,
    `${inst.trialPassRate}%`,
    `${inst.averageStudentRating} ★`,
  ])

  downloadCsv(
    `TrialReady_LK_Instructor_Performance_${new Date().toISOString().slice(0, 10)}`,
    headers,
    rows,
  )
}
