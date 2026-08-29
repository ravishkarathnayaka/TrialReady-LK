import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { AppRole } from '../types/auth'

interface ProtectedRouteProps {
  children?: React.ReactNode
  allowedRoles?: AppRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, profile, role } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">
            Verifying authentication session...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (profile && profile.status !== 'active') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-lg border border-red-200">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl font-bold">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Account {profile.status.toUpperCase()}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Your driving school account status is currently{' '}
            <span className="font-semibold text-red-600">
              {profile.status}
            </span>
            . Please contact your driving school administrator for
            assistance.
          </p>
        </div>
      </div>
    )
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children ? <>{children}</> : null
}
