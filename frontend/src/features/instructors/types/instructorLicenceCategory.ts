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

export interface InstructorLicenceCategory {
  instructor_id: string
  licence_category_id: string
  driving_school_id: string
  created_at: string
}

export interface InstructorLicenceCategoryWithDetails
  extends InstructorLicenceCategory {
  licence_category: LicenceCategory
}

export interface AssignInstructorLicenceCategoryInput {
  instructor_id: string
  licence_category_id: string
  driving_school_id: string
}