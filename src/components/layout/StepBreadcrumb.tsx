'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { PROJECT_STEPS } from '@/data/types'

interface StepBreadcrumbProps {
  projectId: string
}

/**
 * Horizontal step progress bar shown inside a project's pages.
 * Clicking on completed steps navigates to them.
 */
export function StepBreadcrumb({ projectId }: StepBreadcrumbProps) {
  const pathname = usePathname()
  const currentSegment = pathname.split('/').pop() ?? ''
  const currentStep = PROJECT_STEPS.find((s) => s.id === currentSegment)
  const currentIndex = currentStep?.index ?? 1

  return (
    <nav className="flex items-center gap-0 overflow-x-auto no-scrollbar">
      {PROJECT_STEPS.map((step, i) => {
        const isActive = step.id === currentSegment
        const isCompleted = step.index < currentIndex
        const isReachable = step.index <= currentIndex

        return (
          <div key={step.id} className="flex items-center">
            {/* Step pill */}
            <Link
              href={isReachable ? `/${projectId}/${step.path}` : '#'}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors',
                isActive && 'bg-accent text-white',
                isCompleted && !isActive && 'text-ink-secondary hover:text-ink-primary hover:bg-surface-raised',
                !isReachable && 'text-ink-tertiary cursor-default',
              )}
            >
              {/* Step number dot */}
              <span
                className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center text-2xs font-bold shrink-0',
                  isActive && 'bg-white/20 text-white',
                  isCompleted && !isActive && 'bg-observe text-white',
                  !isActive && !isCompleted && 'bg-surface-overlay text-ink-tertiary',
                )}
              >
                {isCompleted ? (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3.5 6L6.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.index
                )}
              </span>
              {step.label}
            </Link>

            {/* Connector line */}
            {i < PROJECT_STEPS.length - 1 && (
              <span className="mx-1 text-ink-tertiary text-xs select-none">›</span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
