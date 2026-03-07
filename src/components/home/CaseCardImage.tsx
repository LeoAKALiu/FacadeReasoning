'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CaseCardImageProps {
  src: string
  alt: string
  caseId: string
  className?: string
}

/** Case card thumbnail: real image with fallback to inline SVG placeholder. */
function FacadeThumbnail({ type, className }: { type: string; className?: string }) {
  if (type === 'case-01') {
    return (
      <svg width="160" height="130" viewBox="0 0 160 130" fill="none" className={cn('opacity-70', className)}>
        <rect x="10" y="5" width="140" height="120" rx="2" stroke="#374151" strokeWidth="1" />
        {[0, 1, 2, 3, 4].map((col) =>
          [0, 1, 2, 3, 4, 5].map((row) => (
            <rect
              key={`${col}-${row}`}
              x={12 + col * 27}
              y={7 + row * 19}
              width={22}
              height={16}
              rx="1"
              fill="#1E3A8A"
              stroke="#3B82F6"
              strokeWidth="0.5"
              opacity={0.7}
            />
          )),
        )}
      </svg>
    )
  }
  if (type === 'case-02') {
    return (
      <svg width="160" height="130" viewBox="0 0 160 130" fill="none" className={cn('opacity-70', className)}>
        <rect x="10" y="5" width="140" height="120" rx="1" stroke="#374151" strokeWidth="1" fill="#1a1a16" />
        {[0, 1, 2, 3, 4, 5].map((row) =>
          [0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
            <rect
              key={`${col}-${row}`}
              x={12 + col * 17 + (row % 2 === 0 ? 0 : 8.5)}
              y={8 + row * 18}
              width={14}
              height={12}
              rx="0.5"
              fill="#2d2d26"
              stroke="#4a4a3a"
              strokeWidth="0.5"
            />
          )),
        )}
        <path d="M60 90 Q80 70 100 90 L100 125 L60 125 Z" fill="#111" stroke="#4a4a3a" strokeWidth="1" />
      </svg>
    )
  }
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none" className={cn('opacity-70', className)}>
      <rect x="5" y="5" width="150" height="120" rx="2" stroke="#374151" strokeWidth="1" fill="#0d1117" />
      {[0, 1, 2, 3, 4, 5, 6].map((col) =>
        [0, 1, 2, 3, 4, 5, 6].map((row) => {
          const x = 12 + col * 21 + (row % 2 === 0 ? 0 : 10.5)
          const y = 10 + row * 18
          return (
            <polygon
              key={`${col}-${row}`}
              points={`${x + 9},${y} ${x + 18},${y + 9} ${x + 9},${y + 18} ${x},${y + 9}`}
              fill="#1a1f2e"
              stroke="#4B5563"
              strokeWidth="0.5"
              opacity={0.6}
            />
          )
        }),
      )}
    </svg>
  )
}

export function CaseCardImage({ src, alt, caseId, className }: CaseCardImageProps) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div className={cn('absolute inset-0 flex items-center justify-center', className)}>
        <FacadeThumbnail type={caseId} />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn('object-cover', className)}
      sizes="(max-width: 640px) 100vw, 33vw"
      onError={() => setError(true)}
      unoptimized
    />
  )
}
