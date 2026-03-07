'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const SLIDES = [
  {
    title: '证据提取',
    caption: '从立面图像中提取视觉证据并标注区域依据',
    icon: 'evidence',
  },
  {
    title: '参数映射',
    caption: '证据 → 设计参数的可解释映射链',
    icon: 'mapping',
  },
  {
    title: '推理补全',
    caption: '约束推理与 AI 缺省补全，生成候选方案',
    icon: 'reasoning',
  },
  {
    title: '结果总览',
    caption: '带可靠度标识的结构表达与待复核清单',
    icon: 'overview',
  },
]

/**
 * Lightweight "system preview" carousel for home: evidence → mapping → result flow.
 * Auto-rotates; dark panel, title, caption. No heavy animation.
 */
export function CaseHeroPreview() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="px-6 pb-12 max-w-5xl mx-auto">
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-ink-primary">系统预览</h2>
          <p className="text-2xs text-ink-tertiary mt-0.5">
            从证据提取到参数映射、推理补全与结果输出的完整流程
          </p>
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
      </div>
    </section>
  )
}
