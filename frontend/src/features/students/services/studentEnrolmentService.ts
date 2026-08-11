import { supabase } from '../../../lib/supabase'
import type {
  CreateStudentLicenceEnrolmentInput,
  LicenceCategory,
  StudentLicenceEnrolment,
} from '../types/studentEnrolment'

const LICENCE_CATEGORIES_TABLE = 'licence_categories'
const STUDENT_LICENCE_CATEGORIES_TABLE =
  'student_licence_categories'

export async function getLicenceCategories(
  drivingSchoolId: string,
): Promise<LicenceCategory[]> {
  const { data, error } = await supabase
    .from(LICENCE_CATEGORIES_TABLE)
    .select('*')
    .eq('driving_school_id', drivingSchoolId)
    .eq('is_active', true)
    .order('code', { ascending: true })

  if (error) {
    throw new Error(
      `Unable to load licence categories: ${error.message}`,
    )
  }

  return (data ?? []) as LicenceCategory[]
}

export async function getStudentLicenceEnrolments(
  studentId: string,
): Promise<StudentLicenceEnrolment[]> {
  const { data, error } = await supabase
    .from(STUDENT_LICENCE_CATEGORIES_TABLE)
    .select('*')
    .eq('student_id', studentId)
    .eq('is_active', true)
    .order('enrolled_at', { ascending: true })

  if (error) {
    throw new Error(
      `Unable to load student licence enrolments: ${error.message}`,
    )
  }

  return (data ?? []) as StudentLicenceEnrolment[]
}

export async function enrolStudentInLicenceCategory(
  input: CreateStudentLicenceEnrolmentInput,
): Promise<StudentLicenceEnrolment> {
  const { data, error } = await supabase
    .from(STUDENT_LICENCE_CATEGORIES_TABLE)
    .insert({
      ...input,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    throw new Error(
      `Unable to enrol student in licence category: ${error.message}`,
    )
  }

  return data as StudentLicenceEnrolment
}

export async function removeStudentLicenceEnrolment(
  studentId: string,
  licenceCategoryId: string,
): Promise<void> {
  const { error } = await supabase
    .from(STUDENT_LICENCE_CATEGORIES_TABLE)
    .delete()
    .eq('student_id', studentId)
    .eq('licence_category_id', licenceCategoryId)

  if (error) {
    throw new Error(
      `Unable to remove student licence enrolment: ${error.message}`,
    )
  }
}