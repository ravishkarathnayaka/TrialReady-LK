import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { ErrorBoundary } from './ErrorBoundary'

const ProblemChild: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test Crash in Driving Academy Component')
  }
  return <div>Smooth Driving Session Running</div>
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Smooth Driving Session Running')).toBeInTheDocument()
  })

  it('catches render error and displays the fallback roadblock UI', () => {
    // Suppress console.error in test output for intentional error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Unexpected Roadblock')).toBeInTheDocument()
    expect(screen.getByText('Test Crash in Driving Academy Component')).toBeInTheDocument()
    expect(screen.getByText('🔄 Try Again')).toBeInTheDocument()
    expect(screen.getByText('🏠 Go to Dashboard')).toBeInTheDocument()

    spy.mockRestore()
  })
})
