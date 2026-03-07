'use client'

import { useEffect, useState } from 'react'
import { ImageViewer } from './ImageViewer'
import type { CaseImages, Evidence } from '@/data/types'

interface EvidenceImagePanelProps {
  images: CaseImages
  evidenceItems: Evidence[]
  highlightedEvidenceId: string | null
  /** When true, run one-time "analysis" scan animation on the image area */
  runScanAnimation?: boolean
  className?: string
}

/**
 * Wraps ImageViewer and optionally shows a one-time scan/sweep overlay
 * to convey "system is analyzing image" on first load.
 */
export function EvidenceImagePanel({
  images,
  evidenceItems,
  highlightedEvidenceId,
  runScanAnimation = true,
  className,
}: EvidenceImagePanelProps) {
  const [scanDone, setScanDone] = useState(false)

  useEffect(() => {
    if (!runScanAnimation || scanDone) return
    const t = setTimeout(() => setScanDone(true), 1400)
    return () => clearTimeout(t)
  }, [runScanAnimation, scanDone])

  return (
    <div className={className}>
      <div className="relative">
        <ImageViewer
          images={images}
          evidenceItems={evidenceItems}
          highlightedEvidenceId={highlightedEvidenceId}
        />
        {/* One-time scan overlay: low opacity, ~1–1.5s */}
        {runScanAnimation && !scanDone && (
          <div
            className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
            aria-hidden
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/10 to-transparent animate-scan-sweep" />
          </div>
        )}
      </div>
    </div>
  )
}
