'use client'

import { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface FlowBandRevealProps {
  children: React.ReactNode
  className?: string
}

/**
 * Wraps flow band steps and triggers fade-up when scrolling into view.
 * Each step gets a staggered reveal (opacity + translateY).
 */
export function FlowBandReveal({ children, className }: FlowBandRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col sm:flex-row items-stretch gap-0 sm:gap-2 transition-all duration-700',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
