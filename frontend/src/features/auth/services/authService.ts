import type {
  AuthChangeEvent,
  Session,
} from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabase'
import type { UserProfile } from '../types/auth'

const PROFILES_TABLE = 'profiles'

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .select('*, driving_school:driving_schools(id, name, registration_number)')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to load user profile: ${error.message}`)
  }

  return (data as unknown as UserProfile) ?? null
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<{ session: Session; profile: UserProfile | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data.session || !data.user) {
    throw new Error('No session returned after authentication.')
  }

  const profile = await getUserProfile(data.user.id)

  return {
    session: data.session,
    profile,
  }
}

export async function signOutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(`Unable to sign out: ${error.message}`)
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    throw new Error(`Unable to get current session: ${error.message}`)
  }
  return data.session
}

export function subscribeToAuthChanges(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  return supabase.auth.onAuthStateChange(callback)
}
