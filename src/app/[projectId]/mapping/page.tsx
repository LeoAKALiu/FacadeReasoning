'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getCaseById } from '@/data/index'
import { ParameterMappingRow } from '@/components/mapping/ParameterMappingRow'
import { EvidenceBasisDrawer } from '@/components/mapping/EvidenceBasisDrawer'
import { ReliabilityDot } from '@/components/overview/ReliabilityDot'
import { EngineeringTranslationFlow } from '@/components/shared/EngineeringTranslationFlow'
import type { ParameterMapping } from '@/data/types'

/**
 * Design parameter mapping page — effective params → design params table
 * with click-to-open evidence basis drawer.
 */
export default function MappingPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const facadeCase = getCaseById(projectId)

  const [selectedMapping, setSelectedMapping] = useState<ParameterMapping | null>(null)
  const [showMappingNote, setShowMappingNote] = useState(false)
  const [showTranslationNote, setShowTranslationNote] = useState(false)

  if (!facadeCase) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-tertiary">未找到项目 {projectId}</p>
      </div>
    )
  }

  const avgConfidence =
    facadeCase.parameterMappings.reduce((sum, m) => sum + m.confidence, 0) /
    facadeCase.parameterMappings.length

  const categoryGroups = facadeCase.parameterMappings.reduce(
    (acc, m) => {
      const cat = m.designParam.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(m)
      return acc
    },
    {} as Record<string, ParameterMapping[]>,
  )

  const importanceOrder = {
    critical: 0,
    important: 1,
    detail: 2,
  } as const

  const sortedCategoryGroups = Object.fromEntries(
    Object.entries(categoryGroups).map(([cat, mappings]) => [
      cat,
      [...mappings].sort((a, b) => {
        const aRank = a.importanceLevel ? importanceOrder[a.importanceLevel] : 99
        const bRank = b.importanceLevel ? importanceOrder[b.importanceLevel] : 99
        return aRank - bRank
      }),
    ]),
  )

  const criticalCount = facadeCase.parameterMappings.filter(
    (mapping) => mapping.importanceLevel === 'critical',
  ).length

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold text-ink-primary">有效参数 → 设计参数 映射</h1>
          <p className="text-sm text-ink-secondary mt-1 pl-0.5 border-l-2 border-accent/50 py-0.5 px-3">
            已形成若干可进入后续结构表达的关键设计参数。
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href={`/${projectId}/evidence`} className="btn-secondary text-sm">
            ← 证据提取
          </Link>
          <Link href={`/${projectId}/reasoning`} className="btn-primary text-sm">
            下一步：推理补全 →
          </Link>
        </div>
      </div>

      {/* Stats — 3 only */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: '映射数', value: String(facadeCase.parameterMappings.length) },
          { label: '核心约束参数', value: String(criticalCount) },
          {
            label: '平均映射可靠度',
            value: <ReliabilityDot value={avgConfidence} variant="pill" />,
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="label-xs mb-2">{stat.label}</p>
            <div className="mono text-lg font-bold text-ink-primary">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Mapping list — grouped by design param category */}
      <div className="space-y-6">
        {Object.entries(sortedCategoryGroups).map(([cat, mappings]) => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="label-xs">{cat}</h2>
              <span className="text-2xs text-ink-tertiary">({mappings.length} 个映射)</span>
            </div>
            <div className="space-y-2">
              {mappings.map((m) => (
                <ParameterMappingRow
                  key={m.id}
                  mapping={m}
                  isSelected={selectedMapping?.id === m.id}
                  onSelect={(id) => {
                    const found = facadeCase.parameterMappings.find((x) => x.id === id) ?? null
                    setSelectedMapping(selectedMapping?.id === id ? null : found)
                  }}
                  projectId={projectId}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Translation note — collapsible */}
      <div className="mt-6 border border-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTranslationNote((v) => !v)}
          className="w-full px-4 py-2 flex items-center justify-between text-left bg-surface-raised/50 hover:bg-surface-raised text-xs text-ink-secondary"
        >
          <span>参数将转译为标准层、轴网与结构表达</span>
          <span className="text-2xs text-ink-tertiary">{showTranslationNote ? '收起' : '展开'}</span>
        </button>
        {showTranslationNote && (
          <div className="p-4 border-t border-border">
            <EngineeringTranslationFlow bridgeNote="当前映射结果将转译为标准层组织、轴网候选与结构表达草图。" />
          </div>
        )}
      </div>

      {/* Mapping legend — collapsible */}
      <div className="mt-4 border border-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowMappingNote((v) => !v)}
          className="w-full px-4 py-2 flex items-center justify-between text-left bg-surface-raised/50 hover:bg-surface-raised text-xs text-ink-tertiary"
        >
          <span>映射说明</span>
          <span>{showMappingNote ? '收起' : '展开'}</span>
        </button>
        {showMappingNote && (
          <div className="p-4 border-t border-border text-xs text-ink-secondary leading-relaxed">
            有效参数 → 设计参数；置信度表可靠程度。点击行可查看依据链。
          </div>
        )}
      </div>

      {/* Evidence basis drawer */}
      <EvidenceBasisDrawer
        mapping={selectedMapping}
        allEvidence={facadeCase.evidence}
        onClose={() => setSelectedMapping(null)}
      />
    </div>
  )
}
