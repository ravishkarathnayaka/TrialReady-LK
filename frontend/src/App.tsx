import { useEffect, useState } from 'react'
import { getHealthStatus } from './api'

type ConnectionStatus = 'loading' | 'connected' | 'error'

function App() {
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
      } catch (error) {
        console.error(error)
        setConnectionStatus('error')
      }
    }

    void checkBackendConnection()
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600">
          TrialReady LK
        </h1>

        <p className="mt-2 text-slate-600">
          Driving School Management Platform for Sri Lanka
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 p-4">
          <p className="font-semibold text-slate-900">Backend API</p>

          {connectionStatus === 'loading' && (
            <p className="mt-1 text-amber-600">
              Checking connection...
            </p>
          )}

          {connectionStatus === 'connected' && (
            <p className="mt-1 text-green-600">
              ● Connected successfully
            </p>
          )}

          {connectionStatus === 'error' && (
            <p className="mt-1 text-red-600">
              ● Unable to connect to the backend
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export default App