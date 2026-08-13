import { supabase } from '../../../lib/supabase'
import type {
  AssignInstructorLicenceCategoryInput,
  InstructorLicenceCategory,
  InstructorLicenceCategoryWithDetails,
  LicenceCategory,
} from '../types/instructorLicenceCategory'

const LICENCE_CATEGORIES_TABLE = 'licence_categories'
const INSTRUCTOR_LICENCE_CATEGORIES_TABLE =
  'instructor_licence_categories'

export async function getActiveLicenceCategories(
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

export async function getInstructorLicenceCategories(
  instructorId: string,
  drivingSchoolId: string,
): Promise<InstructorLicenceCategoryWithDetails[]> {
  const { data, error } = await supabase
    .from(INSTRUCTOR_LICENCE_CATEGORIES_TABLE)
    .select(`
      instructor_id,
      licence_category_id,
      driving_school_id,
      created_at,
      licence_category:licence_categories (
        id,
        driving_school_id,
        code,
        name,
        description,
        is_active,
        created_at,
        updated_at
      )
    `)
    .eq('instructor_id', instructorId)
    .eq('driving_school_id', drivingSchoolId)

  if (error) {
    throw new Error(
      `Unable to load instructor licence categories: ${error.message}`,
    )
  }

  const assignments = (data ??
    []) as unknown as InstructorLicenceCategoryWithDetails[]

  return assignments.sort((first, second) =>
    first.licence_category.code.localeCompare(
      second.licence_category.code,
    ),
  )
}

export async function assignInstructorLicenceCategory(
  input: AssignInstructorLicenceCategoryInput,
): Promise<InstructorLicenceCategory> {
  const { data, error } = await supabase
    .from(INSTRUCTOR_LICENCE_CATEGORIES_TABLE)
    .insert(input)
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error(
        'This licence category is already assigned to the instructor.',
      )
    }

    throw new Error(
      `Unable to assign licence category: ${error.message}`,
    )
  }

  return data as InstructorLicenceCategory
}

export async function removeInstructorLicenceCategory(
  instructorId: string,
  licenceCategoryId: string,
  drivingSchoolId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from(INSTRUCTOR_LICENCE_CATEGORIES_TABLE)
    .delete()
    .eq('instructor_id', instructorId)
    .eq('licence_category_id', licenceCategoryId)
    .eq('driving_school_id', drivingSchoolId)
    .select('instructor_id')
    .maybeSingle()

  if (error) {
    throw new Error(
      `Unable to remove licence category: ${error.message}`,
    )
  }

  if (!data) {
    throw new Error(
      'The licence category assignment was not found or could not be removed.',
    )
  }
}