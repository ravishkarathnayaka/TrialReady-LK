export interface LogbookStudentProfile {
  fullName: string
  admissionNumber: string
  nicPassport: string
  phone: string
  email: string
  registrationDate: string
  branchName: string
}

export interface LogbookPermitInfo {
  permitNumber: string
  issueDate: string
  expiryDate: string
  status: string
}

export interface LogbookMedicalInfo {
  certificateNumber: string
  issueDate: string
  expiryDate: string
  ntmiBranch: string
  status: string
}

export interface LogbookSessionRecord {
  sessionDate: string
  startTime: string
  endTime: string
  durationMinutes: number
  vehicleRegistration: string
  instructorName: string
  skillsCovered: string[]
  studentRating: number | null
  attendanceStatus: string
}

export interface LogbookTheoryExam {
  examType: string
  attemptNumber: number
  scheduledDate: string
  status: string
  score: number | null
  location: string
}

export interface LogbookSchoolInfo {
  schoolName: string
  registrationNumber: string
  phone: string
  address: string
}

export interface LogbookLicenceCategory {
  code: string
  name: string
}

export interface StudentLogbookData {
  school: LogbookSchoolInfo
  student: LogbookStudentProfile
  permit: LogbookPermitInfo | null
  medical: LogbookMedicalInfo | null
  licenceCategory: LogbookLicenceCategory | null
  sessions: LogbookSessionRecord[]
  theoryExams: LogbookTheoryExam[]
  totalPracticalHours: number
  totalCompletedSessions: number
  aiReadinessScore: number
  readinessTier: string
}

export interface TrialAdmissionSlipData {
  school: LogbookSchoolInfo
  student: LogbookStudentProfile
  permit: LogbookPermitInfo | null
  medical: LogbookMedicalInfo | null
  licenceCategory: LogbookLicenceCategory | null
  totalPracticalHours: number
  aiReadinessScore: number
  readinessTier: string
  trialGroundLocation: string
  reportingTime: string
  trialDate: string
  testVehicleRegistration: string
}
