'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { CaseImages, Evidence } from '@/data/types'

type ImageMode = 'original' | 'evidence' | 'corrected'

interface ImageViewerProps {
  images: CaseImages
  evidenceItems?: Evidence[]
  className?: string
}

const MODE_LABELS: Record<ImageMode, string> = {
  original: '原始图像',
  evidence: '证据标注',
  corrected: '校正图像',
}

const MODE_DESC: Record<ImageMode, string> = {
  original: '未经处理的原始上传图像',
  evidence: '叠加有效参数区域标注框',
  corrected: '几何校正 + 色彩标准化后的图像',
}

/**
 * Three-mode image viewer: original / evidence overlay / corrected.
 * Shows evidence region boxes when in evidence mode.
 */
export function ImageViewer({ images, evidenceItems = [], className }: ImageViewerProps) {
  const [mode, setMode] = useState<ImageMode>('original')

  const currentSrc = images[mode]
  const showOverlay = mode === 'evidence'

  const evidenceWithRegions = evidenceItems.filter((e) => e.region)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Mode switcher */}
      <div className="flex items-center gap-1 bg-surface-raised rounded-lg p-1 self-start">
        {(Object.keys(MODE_LABELS) as ImageMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              mode === m
                ? 'bg-surface-overlay text-ink-primary shadow-sm'
                : 'text-ink-tertiary hover:text-ink-secondary',
            )}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Mode description */}
      <p className="text-xs text-ink-tertiary">{MODE_DESC[mode]}</p>

      {/* Image area */}
      <div className="relative aspect-[4/3] bg-surface rounded-lg overflow-hidden border border-border">
        {/* Placeholder gradient when no actual image */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'bg-gradient-to-br from-surface-raised via-surface to-surface-overlay',
          )}
        >
          <FacadePlaceholder mode={mode} />
        </div>

        {/* Evidence region overlays */}
        {showOverlay && evidenceWithRegions.map((ev) => {
          const r = ev.region!
          return (
            <div
              key={ev.id}
              className="absolute border-2 border-accent/70 rounded-sm"
              style={{
                left: `${r.x * 100}%`,
                top: `${r.y * 100}%`,
                width: `${r.w * 100}%`,
                height: `${r.h * 100}%`,
              }}
              title={`${ev.label}: ${ev.value}`}
            >
              <span className="absolute -top-5 left-0 text-2xs text-accent bg-canvas/80 px-1 py-0.5 rounded whitespace-nowrap max-w-[120px] truncate">
                {ev.label}
              </span>
            </div>
          )
        })}

        {/* Mode badge */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-canvas/80 backdrop-blur-sm text-ink-secondary text-2xs px-2 py-1 rounded-md border border-border">
            {MODE_LABELS[mode]}
          </span>
        </div>
      </div>

      {/* Evidence region legend */}
      {showOverlay && evidenceWithRegions.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-ink-tertiary">
          <span className="inline-block w-3 h-3 border-2 border-accent/70 rounded-sm" />
          <span>高亮区域为有效参数提取依据区域（共 {evidenceWithRegions.length} 处）</span>
        </div>
      )}
    </div>
  )
}

/** SVG placeholder that varies by mode. */
function FacadePlaceholder({ mode }: { mode: ImageMode }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-60">
      {/* Stylized facade SVG */}
      <svg width="180" height="140" viewBox="0 0 180 140" fill="none" className="opacity-80">
        {/* Building outline */}
        <rect x="20" y="20" width="140" height="110" rx="2" stroke="#374151" strokeWidth="1.5" />

        {/* Window grid */}
        {[0, 1, 2, 3].map((col) =>
          [0, 1, 2, 3, 4].map((row) => (
            <rect
              key={`${col}-${row}`}
              x={28 + col * 31}
              y={28 + row * 20}
              width={22}
              height={14}
              rx="1"
              fill={
                mode === 'evidence'
                  ? col === 2 && row === 2
                    ? '#6366F1'
                    : '#1F2937'
                  : mode === 'corrected'
                  ? '#1A2840'
                  : '#1F2937'
              }
              stroke={
                mode === 'evidence' && col === 2 && row === 2
                  ? '#6366F1'
                  : '#374151'
              }
              strokeWidth="1"
            />
          )),
        )}

        {/* Mode-specific overlay */}
        {mode === 'evidence' && (
          <rect x="58" y="48" width="53" height="34" rx="2" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
        )}
        {mode === 'corrected' && (
          <>
            <line x1="20" y1="20" x2="160" y2="20" stroke="#22C55E" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="20" y1="130" x2="160" y2="130" stroke="#22C55E" strokeWidth="0.5" strokeDasharray="3 3" />
          </>
        )}
      </svg>

      <span className="text-xs text-ink-tertiary">
        {mode === 'original' && '原始立面图像'}
        {mode === 'evidence' && '证据提取标注图'}
        {mode === 'corrected' && '几何校正图像'}
      </span>
    </div>
  )
}
