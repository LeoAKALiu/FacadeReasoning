import { StepBreadcrumb } from '@/components/layout/StepBreadcrumb'
import { getCaseById } from '@/data/index'

interface ProjectLayoutProps {
  children: React.ReactNode
  params: { projectId: string }
}

/**
 * Shared layout for all project sub-pages.
 * Injects a step breadcrumb below the top nav.
 */
export default function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { projectId } = params
  const facadeCase = getCaseById(projectId)

  return (
    <div className="min-h-screen">
      {/* Project header strip */}
      <div className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-14 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          {/* Project name */}
          <div className="min-w-0 shrink-0">
            <p className="text-2xs text-ink-tertiary">当前项目</p>
            <p className="text-sm font-medium text-ink-primary truncate max-w-[240px]">
              {facadeCase?.name ?? projectId}
            </p>
          </div>

          {/* Step breadcrumb */}
          <StepBreadcrumb projectId={projectId} />
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  )
}
