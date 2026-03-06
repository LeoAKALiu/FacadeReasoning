'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

/** Top navigation bar — logo + project name + breadcrumb context. */
export function TopNav() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-canvas/90 backdrop-blur-sm flex items-center px-6">
      <div className="flex items-center gap-3 min-w-0">
        {/* Logo mark */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="12" rx="1" fill="white" fillOpacity="0.9" />
              <rect x="9" y="2" width="5" height="7" rx="1" fill="white" fillOpacity="0.6" />
              <rect x="9" y="11" width="5" height="3" rx="1" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-ink-primary group-hover:text-accent transition-colors">
            Facade Reasoning
          </span>
        </Link>

        {!isHome && (
          <span className="text-ink-tertiary text-sm select-none">/</span>
        )}

        {!isHome && (
          <span className="text-xs text-ink-secondary truncate max-w-[200px]">
            Demo
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-4">
        <span className={cn(
          'text-2xs font-medium px-2 py-0.5 rounded-full border',
          'bg-accent-subtle border-accent-muted text-accent',
        )}>
          DEMO
        </span>
        <Link
          href="/project/new"
          className={cn(
            'btn-primary text-xs px-3 py-1.5',
            pathname === '/project/new' && 'opacity-50 pointer-events-none',
          )}
        >
          新建项目
        </Link>
      </div>
    </header>
  )
}
