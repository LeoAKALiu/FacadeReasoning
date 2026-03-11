'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const SLIDES = [
  { title: '证据提取', caption: '从图像提取证据', icon: 'evidence' as const },
  { title: '参数映射', caption: '证据 → 设计参数', icon: 'mapping' as const },
  { title: '推理补全', caption: '约束 + AI 补全，多方案', icon: 'reasoning' as const },
  { title: '结果总览', caption: '带可靠度的结果与待复核', icon: 'overview' as const },
]

interface CaseHeroPreviewProps {
  /** When true, only a single-line toggle is shown by default. */
  defaultCollapsed?: boolean
}

/**
 * Lightweight "system preview" carousel for home. Can be collapsed to one line.
 */
export function CaseHeroPreview({ defaultCollapsed = true }: CaseHeroPreviewProps) {
  const [index, setIndex] = useState(0)
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  useEffect(() => {
    if (collapsed) return
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4000)
    return () => clearInterval(t)
  }, [collapsed])

  return (
    <section className="px-6 pb-12 max-w-5xl mx-auto">
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="w-full px-4 py-3 border-b border-border flex items-center justify-between text-left hover:bg-surface-raised/50 transition-colors"
        >
          <h2 className="text-sm font-semibold text-ink-primary">系统预览</h2>
          <span className="text-2xs text-ink-tertiary">
            {collapsed ? '展开' : '收起'}
          </span>
        </button>
        {!collapsed && (
        <>
        <div className="px-4 py-2 border-b border-border">
          <p className="text-2xs text-ink-tertiary">证据提取 → 参数映射 → 推理补全 → 结果总览</p>
        </div>
        <div className="relative aspect-[2.2/1] bg-surface-raised min-h-[180px]">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.title}
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 transition-opacity duration-500',
                i === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none',
              )}
            >
              <div className="w-14 h-14 rounded-xl bg-accent-subtle border border-accent-muted flex items-center justify-center">
                {slide.icon === 'evidence' && (
                  <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                )}
                {slide.icon === 'mapping' && (
                  <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 12h6l2-4 2 8 2-4h4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {slide.icon === 'reasoning' && (
                  <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 8v4l2 2" strokeLinecap="round" />
                  </svg>
                )}
                {slide.icon === 'overview' && (
                  <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="4" width="6" height="6" rx="1" />
                    <rect x="14" y="4" width="6" height="6" rx="1" />
                    <rect x="4" y="14" width="6" height="6" rx="1" />
                    <rect x="14" y="14" width="6" height="6" rx="1" />
                  </svg>
                )}
              </div>
              <h3 className="text-base font-semibold text-ink-primary">{slide.title}</h3>
              <p className="text-sm text-ink-tertiary text-center max-w-md">{slide.caption}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-1.5 py-3 border-t border-border">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`切换到第 ${i + 1} 屏`}
              onClick={() => setIndex(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                i === index ? 'bg-accent scale-125' : 'bg-border hover:bg-ink-tertiary',
              )}
            />
          ))}
        </div>
        </>
        )}
      </div>
    </section>
  )
}
