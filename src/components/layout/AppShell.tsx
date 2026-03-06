'use client'

import { TopNav } from './TopNav'

interface AppShellProps {
  children: React.ReactNode
}

/**
 * Top-level layout shell — fixed top nav + scrollable content area.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <TopNav />
      <main className="pt-14">{children}</main>
    </div>
  )
}
