import type { EvidenceSource } from '@/data/types'

/**
 * Combines class names, filtering out falsy values.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Returns Tailwind color classes for each evidence source type.
 */
export function getSourceColors(source: EvidenceSource): {
  bg: string
  text: string
  border: string
  dot: string
} {
  switch (source) {
    case 'direct_observation':
      return {
        bg: 'bg-observe-subtle',
        text: 'text-observe',
        border: 'border-observe-muted',
        dot: 'bg-observe',
      }
    case 'rule_inference':
      return {
        bg: 'bg-infer-subtle',
        text: 'text-infer',
        border: 'border-infer-muted',
        dot: 'bg-infer',
      }
    case 'ai_completion':
      return {
        bg: 'bg-ai-subtle',
        text: 'text-ai',
        border: 'border-ai-muted',
        dot: 'bg-ai',
      }
    case 'pending_review':
      return {
        bg: 'bg-review-subtle',
        text: 'text-review',
        border: 'border-review-muted',
        dot: 'bg-review',
      }
  }
}

/**
 * Returns a human-readable Chinese label for each evidence source type.
 */
export function getSourceLabel(source: EvidenceSource): string {
  switch (source) {
    case 'direct_observation':
      return '直接观测'
    case 'rule_inference':
      return '规则推断'
    case 'ai_completion':
      return 'AI 补全'
    case 'pending_review':
      return '待复核'
  }
}

/**
 * Maps a reliability score (0–1) to a hex color from red through yellow to green.
 */
export function reliabilityToColor(value: number): string {
  const clamped = Math.max(0, Math.min(1, value))
  if (clamped >= 0.85) return '#22C55E'
  if (clamped >= 0.7) return '#84CC16'
  if (clamped >= 0.5) return '#EAB308'
  if (clamped >= 0.35) return '#F97316'
  return '#EF4444'
}

/**
 * Formats a decimal reliability score as a percentage string.
 */
export function formatReliability(value: number): string {
  return `${Math.round(value * 100)}%`
}

/**
 * Returns a priority badge style for review items.
 */
export function getPriorityStyle(priority: 'high' | 'medium' | 'low'): {
  label: string
  classes: string
} {
  switch (priority) {
    case 'high':
      return { label: '高优先', classes: 'bg-red-900/50 text-red-400 border border-red-800' }
    case 'medium':
      return { label: '中优先', classes: 'bg-amber-900/50 text-amber-400 border border-amber-800' }
    case 'low':
      return { label: '低优先', classes: 'bg-slate-800 text-slate-400 border border-slate-700' }
  }
}

/**
 * Returns the step number (1-indexed) for a given page segment.
 */
export function getStepIndex(segment: string): number {
  const steps = ['evidence', 'mapping', 'reasoning', 'overview', 'export']
  const idx = steps.indexOf(segment)
  return idx === -1 ? 0 : idx + 1
}
