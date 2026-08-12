import { supabase } from '../../../lib/supabase'
import type {
  CreateInstructorInput,
  Instructor,
  UpdateInstructorInput,
} from '../types/instructor'

const INSTRUCTORS_TABLE = 'instructors'

export async function getInstructors(): Promise<Instructor[]> {
  const { data, error } = await supabase
    .from(INSTRUCTORS_TABLE)
    .select('*')
    .order('full_name', { ascending: true })

  if (error) {
    throw new Error(`Unable to load instructors: ${error.message}`)
  }

  return (data ?? []) as Instructor[]
}

export async function getInstructorById(
  instructorId: string,
): Promise<Instructor> {
  const { data, error } = await supabase
    .from(INSTRUCTORS_TABLE)
    .select('*')
    .eq('id', instructorId)
    .single()

  if (error) {
    throw new Error(`Unable to load instructor: ${error.message}`)
  }

  return data as Instructor
}

export async function createInstructor(
  input: CreateInstructorInput,
): Promise<Instructor> {
  const { data, error } = await supabase
    .from(INSTRUCTORS_TABLE)
    .insert(input)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Unable to create instructor: ${error.message}`)
  }

  return data as Instructor
}

export async function updateInstructor(
  instructorId: string,
  input: UpdateInstructorInput,
): Promise<Instructor> {
  const { data, error } = await supabase
    .from(INSTRUCTORS_TABLE)
    .update(input)
    .eq('id', instructorId)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Unable to update instructor: ${error.message}`)
  }

  return data as Instructor
}

export async function setInstructorActiveStatus(
  instructorId: string,
  isActive: boolean,
): Promise<Instructor> {
  const { data, error } = await supabase
    .from(INSTRUCTORS_TABLE)
    .update({ is_active: isActive })
    .eq('id', instructorId)
    .select('*')
    .single()

  if (error) {
    throw new Error(
      `Unable to update instructor status: ${error.message}`,
    )
  }

  return data as Instructor
}