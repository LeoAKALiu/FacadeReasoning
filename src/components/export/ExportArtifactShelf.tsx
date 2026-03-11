'use client'

import Image from 'next/image'
import { getCaseAssetUrl } from '@/lib/utils'

const ARTIFACTS = [
  { id: 'pdf', label: 'PDF 摘要', thumb: 'report-preview' },
  { id: 'png', label: 'PNG 结果图', thumb: 'parameter-preview' },
  { id: 'csv', label: '参数表 CSV', thumb: 'parameter-preview' },
  { id: 'sketch', label: '结构草图', thumb: 'structure-sketch' },
] as const

interface ExportArtifactShelfProps {
  projectId: string
  onExportPdf?: () => void
  onExportPng?: () => void
  className?: string
}

function getArtifactThumb(projectId: string, thumb: (typeof ARTIFACTS)[number]['thumb']): string {
  if (thumb === 'structure-sketch') return 'structure-sketch.svg'
  if (thumb === 'parameter-preview') {
    return projectId === 'case-01' ? 'parameter-preview.png' : 'parameter-preview.svg'
  }
  if (thumb === 'report-preview') {
    return projectId === 'case-01' ? 'report-preview.png' : 'parameter-preview.svg'
  }
  return 'parameter-preview.svg'
}

/**
 * Shelf of export artifact cards: PDF, PNG, CSV, structure sketch.
 * Each card has a thumbnail and title; actions can be wired to buttons.
 */
export function ExportArtifactShelf({
  projectId,
  onExportPdf,
  onExportPng,
  className,
}: ExportArtifactShelfProps) {
  return (
    <div className={className}>
      <h2 className="label-xs mb-3">导出产物展示</h2>
      <div className="grid grid-cols-2 gap-3">
        {ARTIFACTS.map((a) => (
          <div
            key={a.id}
            className="card p-3 flex flex-col gap-2 hover:border-border-strong transition-colors"
          >
            <div className="relative aspect-[4/3] rounded border border-border bg-surface-raised overflow-hidden">
              <Image
                src={getCaseAssetUrl(projectId, getArtifactThumb(projectId, a.thumb))}
                alt={a.label}
                fill
                className={a.thumb === 'report-preview' ? 'object-cover' : 'object-contain p-2'}
                sizes="120px"
                unoptimized
              />
            </div>
            <p className="text-xs font-medium text-ink-primary">{a.label}</p>
            {a.id === 'pdf' && onExportPdf && (
              <button type="button" onClick={onExportPdf} className="btn-secondary text-2xs py-1.5 w-full">
                导出 PDF
              </button>
            )}
            {a.id === 'png' && onExportPng && (
              <button type="button" onClick={onExportPng} className="btn-secondary text-2xs py-1.5 w-full">
                导出 PNG
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
