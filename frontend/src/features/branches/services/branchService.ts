import { supabase } from '../../../lib/supabase'
import type {
  Branch,
  CreateBranchInput,
  UpdateBranchInput,
} from '../types/branch'

const BRANCHES_TABLE = 'branches'

export async function getBranches(): Promise<Branch[]> {
  const { data, error } = await supabase
    .from(BRANCHES_TABLE)
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Unable to load branches: ${error.message}`)
  }

  return (data ?? []) as Branch[]
}

export async function getBranchById(
  branchId: string,
): Promise<Branch> {
  const { data, error } = await supabase
    .from(BRANCHES_TABLE)
    .select('*')
    .eq('id', branchId)
    .single()

  if (error) {
    throw new Error(`Unable to load branch: ${error.message}`)
  }

  return data as Branch
}

export async function createBranch(
  input: CreateBranchInput,
): Promise<Branch> {
  const { data, error } = await supabase
    .from(BRANCHES_TABLE)
    .insert(input)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Unable to create branch: ${error.message}`)
  }

  return data as Branch
}

export async function updateBranch(
  branchId: string,
  input: UpdateBranchInput,
): Promise<Branch> {
  const { data, error } = await supabase
    .from(BRANCHES_TABLE)
    .update(input)
    .eq('id', branchId)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Unable to update branch: ${error.message}`)
  }

  return data as Branch
}

export async function setBranchActiveStatus(
  branchId: string,
  isActive: boolean,
): Promise<Branch> {
  return updateBranch(branchId, {
    is_active: isActive,
  })
}