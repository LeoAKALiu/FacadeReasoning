import type {
  EvidenceSource,
  ParameterImportanceLevel,
  RecommendedUsage,
} from '@/data/types'

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
 * Returns hex color for each evidence source (for inline styles, e.g. image highlight).
 */
export function getSourceHex(source: EvidenceSource): string {
  switch (source) {
    case 'direct_observation':
      return '#22C55E'
    case 'rule_inference':
      return '#3B82F6'
    case 'ai_completion':
      return '#A855F7'
    case 'pending_review':
      return '#F59E0B'
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
 * Returns reliability level label for display (high / medium / low).
 */
export function getReliabilityLevel(value: number): '高可靠度' | '中可靠度' | '低可靠度' {
  const clamped = Math.max(0, Math.min(1, value))
  if (clamped >= 0.85) return '高可靠度'
  if (clamped >= 0.65) return '中可靠度'
  return '低可靠度'
}

/**
 * Returns label and classes for parameter importance.
 */
export function getImportanceMeta(level: ParameterImportanceLevel): {
  label: string
  classes: string
} {
  switch (level) {
    case 'critical':
      return {
        label: '核心约束参数',
        classes: 'bg-red-950/50 text-red-300 border border-red-900/70',
      }
    case 'important':
      return {
        label: '关键增强参数',
        classes: 'bg-blue-950/50 text-blue-300 border border-blue-900/70',
      }
    case 'detail':
      return {
        label: '细节补充参数',
        classes: 'bg-slate-800/80 text-slate-300 border border-slate-700',
      }
  }
}

/**
 * Returns display meta for overview/export usage recommendation.
 */
export function getRecommendedUsageMeta(usage: RecommendedUsage): {
  label: string
  description: string
  classes: string
} {
  switch (usage) {
    case 'direct_use':
      return {
        label: '可直接使用',
        description: '结果已具备较强稳定性，可直接进入下一步结构表达。',
        classes: 'bg-observe-subtle text-observe border border-observe-muted',
      }
    case 'use_after_review':
      return {
        label: '建议复核后使用',
        description: '主干结果已成型，但关键约束参数需复核后再进入工程表达。',
        classes: 'bg-infer-subtle text-infer border border-infer-muted',
      }
    case 'candidate_only':
      return {
        label: '仅供候选参考',
        description: '适合作为方案比选和未来系统投影，不建议直接进入正式表达。',
        classes: 'bg-ai-subtle text-ai border border-ai-muted',
      }
    case 'manual_confirmation_required':
      return {
        label: '必须人工确认',
        description: '关键前提尚未锁定，当前结果只能作为研究性草案。',
        classes: 'bg-review-subtle text-review border border-review-muted',
      }
  }
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
