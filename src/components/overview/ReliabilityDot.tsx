import { cn, reliabilityToColor, formatReliability } from '@/lib/utils'

interface ReliabilityDotProps {
  value: number
  /** 'dot' = circle only, 'bar' = horizontal bar, 'pill' = dot + text */
  variant?: 'dot' | 'bar' | 'pill'
  className?: string
}

/**
 * Displays a reliability score (0–1) as a color-coded visual indicator.
 * Color scale: red (low) → amber → yellow → lime → green (high).
 */
export function ReliabilityDot({ value, variant = 'dot', className }: ReliabilityDotProps) {
  const color = reliabilityToColor(value)
  const pct = formatReliability(value)

  if (variant === 'bar') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="h-1.5 w-20 rounded-full bg-surface-overlay overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${value * 100}%`, backgroundColor: color }}
          />
        </div>
        <span className="mono text-xs tabular-nums" style={{ color }}>
          {pct}
        </span>
      </div>
    )
  }

  if (variant === 'pill') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs mono font-medium',
          className,
        )}
        style={{
          color,
          borderColor: `${color}40`,
          backgroundColor: `${color}12`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        {pct}
      </span>
    )
  }

  // default: dot
  return (
    <span
      title={`可靠度 ${pct}`}
      className={cn('inline-block w-2.5 h-2.5 rounded-full shrink-0', className)}
      style={{ backgroundColor: color }}
    />
  )
}
