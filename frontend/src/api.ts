const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export interface HealthResponse {
  status: string
}

export async function getHealthStatus(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`)

  if (!response.ok) {
    throw new Error('Unable to connect to the backend')
  }

  return response.json()
}