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
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink-primary mb-1">有效参数 → 设计参数 映射</h1>
          <p className="text-sm text-ink-secondary">
            将从图像中提取的有效参数，按语义关系映射至建筑设计参数体系。
            点击任意映射行查看完整依据链。
          </p>
          <p className="text-xs text-ink-tertiary mt-2">
            这些设计参数将进一步用于标准层组织、轴网候选与结构表达生成。
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

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: '映射总数', value: String(facadeCase.parameterMappings.length) },
          { label: '设计参数类别', value: String(Object.keys(categoryGroups).length) },
          { label: '核心约束参数', value: String(criticalCount) },
          {
            label: '平均映射置信度',
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

      <div className="mt-6">
        <EngineeringTranslationFlow bridgeNote="当前映射结果不会停留在参数层，下一步将继续转译为标准层组织、轴网候选与结构表达草图。" />
      </div>

      {/* Mapping legend callout */}
      <div className="card p-4 mt-6 flex gap-3">
        <div className="w-8 h-8 rounded-md bg-infer-subtle border border-infer-muted flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7H12M8 3L12 7L8 11" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-xs text-ink-secondary leading-relaxed">
          <span className="text-ink-primary font-medium">映射说明</span>
          ：左侧为从图像直接提取的「有效参数」（Observable），右侧为建筑设计参数体系中的
          「设计参数」（Design Parameter）。置信度反映该映射在当前视觉证据下的可靠程度。
          点击任意行可在右侧抽屉中查看支撑该映射的原始证据链。
        </div>
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
