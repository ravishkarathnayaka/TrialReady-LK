export interface LicenceCategory {
  id: string
  driving_school_id: string
  code: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StudentLicenceEnrolment {
  student_id: string
  licence_category_id: string
  driving_school_id: string
  enrolled_at: string
  is_active: boolean
}

export interface CreateStudentLicenceEnrolmentInput {
  student_id: string
  licence_category_id: string
  driving_school_id: string
}