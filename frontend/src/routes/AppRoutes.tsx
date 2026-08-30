import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { useAuth } from '../features/auth/context/AuthContext'
import LoginPage from '../features/auth/pages/LoginPage'
import UnauthorizedPage from '../features/auth/pages/UnauthorizedPage'
import BranchManagementPage from '../features/branches/pages/BranchManagementPage'
import AdminDashboardPage from '../features/dashboard/pages/AdminDashboardPage'
import InstructorManagementPage from '../features/instructors/pages/InstructorManagementPage'
import AppShell from '../features/layout/components/AppShell'
import StudentManagementPage from '../features/students/pages/StudentManagementPage'
import StudentJourneyOverviewPage from '../features/journey/pages/StudentJourneyOverviewPage'
import StudentJourneyDetailPage from '../features/journey/pages/StudentJourneyDetailPage'
import SchoolReadinessDashboardPage from '../features/readiness/pages/SchoolReadinessDashboardPage'
import StudentReadinessPage from '../features/readiness/pages/StudentReadinessPage'
import FinancialManagementPage from '../features/financials/pages/FinancialManagementPage'
import StudentPaymentDetailPage from '../features/financials/pages/StudentPaymentDetailPage'
import PracticalSessionManagementPage from '../features/sessions/pages/PracticalSessionManagementPage'
import VehicleManagementPage from '../features/vehicles/pages/VehicleManagementPage'

export const AppRoutes: React.FC = () => {
  const { drivingSchoolId } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Layout Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboardPage />} />

        {/* Learner Journey & Compliance */}
        <Route
          path="/journey"
          element={
            <ProtectedRoute allowedRoles={['administrator', 'instructor']}>
              <StudentJourneyOverviewPage drivingSchoolId={drivingSchoolId} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:studentId/journey"
          element={
            <ProtectedRoute allowedRoles={['administrator', 'instructor']}>
              <StudentJourneyDetailPage />
            </ProtectedRoute>
          }
        />

        {/* AI Trial Readiness & Candidate Hub */}
        <Route
          path="/readiness"
          element={
            <ProtectedRoute allowedRoles={['administrator', 'instructor']}>
              <SchoolReadinessDashboardPage
                drivingSchoolId={drivingSchoolId}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:studentId/readiness"
          element={
            <ProtectedRoute allowedRoles={['administrator', 'instructor']}>
              <StudentReadinessPage />
            </ProtectedRoute>
          }
        />

        {/* Financials, Payments & Course Packages */}
        <Route
          path="/financials"
          element={
            <ProtectedRoute allowedRoles={['administrator']}>
              <FinancialManagementPage drivingSchoolId={drivingSchoolId} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:studentId/payments"
          element={
            <ProtectedRoute allowedRoles={['administrator']}>
              <StudentPaymentDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Practical Driving Sessions Module */}
        <Route
          path="/sessions"
          element={
            <ProtectedRoute allowedRoles={['administrator', 'instructor']}>
              <PracticalSessionManagementPage
                drivingSchoolId={drivingSchoolId}
              />
            </ProtectedRoute>
          }
        />

        {/* Vehicle Management Module */}
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute allowedRoles={['administrator', 'instructor']}>
              <VehicleManagementPage drivingSchoolId={drivingSchoolId} />
            </ProtectedRoute>
          }
        />

        {/* Student Management Module */}
        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={['administrator', 'instructor']}>
              <StudentManagementPage drivingSchoolId={drivingSchoolId} />
            </ProtectedRoute>
          }
        />

        {/* Instructor Management Module */}
        <Route
          path="/instructors"
          element={
            <ProtectedRoute allowedRoles={['administrator']}>
              <InstructorManagementPage drivingSchoolId={drivingSchoolId} />
            </ProtectedRoute>
          }
        />

        {/* Branch Management Module */}
        <Route
          path="/branches"
          element={
            <ProtectedRoute allowedRoles={['administrator']}>
              <BranchManagementPage drivingSchoolId={drivingSchoolId} />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
