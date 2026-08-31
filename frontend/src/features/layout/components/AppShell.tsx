import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AiCopilotWidget } from '../../ai/components/AiCopilotWidget'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export const AppShell: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans antialiased">
      {/* Navigation Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global AI Driving Copilot Widget */}
      <AiCopilotWidget />
    </div>
  )
}

export default AppShell
