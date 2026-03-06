import type { EvolutionPath } from '@/data/types'

interface SystemEvolutionRoadmapProps {
  evolution?: EvolutionPath
}

/**
 * Shows the product evolution path from current demo to future delivery system.
 */
export function SystemEvolutionRoadmap({
  evolution,
}: SystemEvolutionRoadmapProps) {
  if (!evolution) return null

  const stages = [
    evolution.currentStage,
    evolution.nextStage,
    evolution.targetStage,
  ]

  return (
    <div className="card p-4">
      <div className="mb-4">
        <p className="label-xs mb-1">系统演进路径</p>
        <h3 className="text-sm font-semibold text-ink-primary">从当前 demo 到未来系统</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {stages.map((stage, index) => (
          <div key={stage.title} className="rounded-lg border border-border bg-surface-raised p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-accent-subtle border border-accent-muted text-accent text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <p className="text-sm font-semibold text-ink-primary">{stage.title}</p>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed mb-3">{stage.description}</p>
            <div className="space-y-1.5">
              {stage.bullets.map((bullet) => (
                <div key={bullet} className="text-xs text-ink-tertiary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
