import { supabase } from '../../../lib/supabase'
import type {
  CreateStudentInput,
  Student,
  UpdateStudentInput,
} from '../types/student'

const STUDENTS_TABLE = 'students'

export async function getStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .select('*')
    .order('full_name', { ascending: true })

  if (error) {
    throw new Error(`Unable to load students: ${error.message}`)
  }

  return (data ?? []) as Student[]
}

export async function getStudentById(id: string): Promise<Student> {
  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Unable to load student: ${error.message}`)
  }

  return data as Student
}

export async function createStudent(
  input: CreateStudentInput,
): Promise<Student> {
  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .insert(input)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Unable to create student: ${error.message}`)
  }

  return data as Student
}

export async function updateStudent(
  id: string,
  input: UpdateStudentInput,
): Promise<Student> {
  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .update(input)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Unable to update student: ${error.message}`)
  }

  return data as Student
}

export async function setStudentActiveStatus(
  id: string,
  isActive: boolean,
): Promise<Student> {
  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .update({ is_active: isActive })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(
      `Unable to change student status: ${error.message}`,
    )
  }

  return data as Student
}