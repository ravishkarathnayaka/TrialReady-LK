import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import {
  getCurrentSession,
  getUserProfile,
  signInWithEmail,
  signOutUser,
  subscribeToAuthChanges,
} from '../services/authService'
import type { AppRole, UserProfile } from '../types/auth'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  role: AppRole | null
  drivingSchoolId: string
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  clearError: () => void
  setDemoUser: (role: AppRole, drivingSchoolId?: string) => void
}

const DEFAULT_DEMO_SCHOOL_ID = '00000000-0000-0000-0000-000000000001'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [demoRole, setDemoRole] = useState<AppRole | null>(null)
  const [demoSchoolId, setDemoSchoolId] = useState<string>(
    DEFAULT_DEMO_SCHOOL_ID,
  )

  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      const p = await getUserProfile(userId)
      setProfile(p)
    } catch (err) {
      console.error('Failed to load profile:', err)
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    getCurrentSession()
      .then((activeSession) => {
        if (isCancelled) return
        setSession(activeSession)
        setUser(activeSession?.user ?? null)
        if (activeSession?.user) {
          return getUserProfile(activeSession.user.id)
        }
        return null
      })
      .then((userProfile) => {
        if (isCancelled) return
        if (userProfile) {
          setProfile(userProfile)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          console.warn('Session check initialization warning:', err)
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    const { data: authListener } = subscribeToAuthChanges(
      (_event, updatedSession) => {
        if (isCancelled) return
        setSession(updatedSession)
        setUser(updatedSession?.user ?? null)
        if (updatedSession?.user) {
          void loadUserProfile(updatedSession.user.id)
        } else {
          setProfile(null)
        }
      },
    )

    return () => {
      isCancelled = true
      authListener.subscription.unsubscribe()
    }
  }, [loadUserProfile])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true)
        setError(null)
        const { session: newSession, profile: newProfile } =
          await signInWithEmail(email, password)
        setSession(newSession)
        setUser(newSession.user)
        setProfile(newProfile)
        setDemoRole(null)
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Authentication failed.'
        setError(msg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await signOutUser()
    } finally {
      setUser(null)
      setSession(null)
      setProfile(null)
      setDemoRole(null)
      setError(null)
      setIsLoading(false)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }, [user, loadUserProfile])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const setDemoUser = useCallback(
    (role: AppRole, schoolId?: string) => {
      const activeSchoolId = schoolId || DEFAULT_DEMO_SCHOOL_ID
      setDemoRole(role)
      setDemoSchoolId(activeSchoolId)
      setProfile({
        id: `demo-${role}-id`,
        driving_school_id: activeSchoolId,
        branch_id: null,
        role,
        full_name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        phone: '+94 77 123 4567',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        driving_school: {
          id: activeSchoolId,
          name: 'TrialReady Driving Academy',
          registration_number: 'DS-WP-2026-0042',
        },
      })
    },
    [],
  )

  const effectiveRole = useMemo(() => {
    if (demoRole) return demoRole
    return profile?.role ?? null
  }, [demoRole, profile?.role])

  const effectiveDrivingSchoolId = useMemo(() => {
    if (profile?.driving_school_id) return profile.driving_school_id
    return demoSchoolId
  }, [profile?.driving_school_id, demoSchoolId])

  const isAuthenticated = useMemo(() => {
    return Boolean(session || demoRole)
  }, [session, demoRole])

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      role: effectiveRole,
      drivingSchoolId: effectiveDrivingSchoolId,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      refreshProfile,
      clearError,
      setDemoUser,
    }),
    [
      user,
      session,
      profile,
      effectiveRole,
      effectiveDrivingSchoolId,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      refreshProfile,
      clearError,
      setDemoUser,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
