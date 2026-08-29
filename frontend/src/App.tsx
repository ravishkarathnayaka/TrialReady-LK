import { useEffect, useState } from 'react'
import { getHealthStatus } from './api'
import BranchManagementPage from './features/branches/pages/BranchManagementPage'
import InstructorManagementPage from './features/instructors/pages/InstructorManagementPage'
import StudentManagementPage from './features/students/pages/StudentManagementPage'
import VehicleManagementPage from './features/vehicles/pages/VehicleManagementPage'

type ActiveModule =
  | 'vehicles'
  | 'students'
  | 'instructors'
  | 'branches'
  | 'health'

type ConnectionStatus = 'loading' | 'connected' | 'error'

function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('vehicles')
  const [drivingSchoolId, setDrivingSchoolId] = useState(
    '00000000-0000-0000-0000-000000000001',
  )
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('loading')

  useEffect(() => {
    async function checkBackendConnection() {
      try {
        const data = await getHealthStatus()
        if (data.status === 'healthy') {
          setConnectionStatus('connected')
        } else {
          setConnectionStatus('error')
        }
      } catch {
        setConnectionStatus('error')
      }
    }

    void checkBackendConnection()
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Demo Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-xs backdrop-blur-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tight text-blue-600">
              TrialReady LK
            </span>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              MVP Preview
            </span>
          </div>

          {/* Module Switcher Buttons */}
          <nav className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveModule('vehicles')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeModule === 'vehicles'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🚗 Vehicles
            </button>

            <button
              type="button"
              onClick={() => setActiveModule('students')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeModule === 'students'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👨‍🎓 Students
            </button>

            <button
              type="button"
              onClick={() => setActiveModule('instructors')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeModule === 'instructors'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👨‍🏫 Instructors
            </button>

            <button
              type="button"
              onClick={() => setActiveModule('branches')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeModule === 'branches'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏢 Branches
            </button>

            <button
              type="button"
              onClick={() => setActiveModule('health')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeModule === 'health'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔌 Backend API
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeModule === 'vehicles' && (
          <VehicleManagementPage drivingSchoolId={drivingSchoolId} />
        )}

        {activeModule === 'students' && (
          <StudentManagementPage drivingSchoolId={drivingSchoolId} />
        )}

        {activeModule === 'instructors' && (
          <InstructorManagementPage drivingSchoolId={drivingSchoolId} />
        )}

        {activeModule === 'branches' && (
          <BranchManagementPage drivingSchoolId={drivingSchoolId} />
        )}

        {activeModule === 'health' && (
          <main className="flex min-h-[80vh] items-center justify-center px-4">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-200">
              <h1 className="text-3xl font-bold text-blue-600">
                TrialReady LK
              </h1>
              <p className="mt-2 text-slate-600 text-sm">
                Driving School Management Platform for Sri Lanka
              </p>

              <div className="mt-6 rounded-xl border border-slate-200 p-4 text-left">
                <p className="font-semibold text-slate-900 text-sm">
                  Backend API Status
                </p>

                {connectionStatus === 'loading' && (
                  <p className="mt-1 text-xs text-amber-600">
                    Checking connection...
                  </p>
                )}

                {connectionStatus === 'connected' && (
                  <p className="mt-1 text-xs text-green-600 font-medium">
                    ● Connected successfully (FastAPI is running)
                  </p>
                )}

                {connectionStatus === 'error' && (
                  <p className="mt-1 text-xs text-red-600">
                    ● Unable to connect to backend (http://127.0.0.1:8000)
                  </p>
                )}
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 p-4 text-left">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Driving School Tenant ID:
                </label>
                <input
                  type="text"
                  value={drivingSchoolId}
                  onChange={(e) => setDrivingSchoolId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  )
}

export default App