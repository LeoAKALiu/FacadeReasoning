'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getCaseById } from '@/data/index'
import { ScenarioSelector } from '@/components/reasoning/ScenarioSelector'
import { ParameterTable } from '@/components/reasoning/ParameterTable'
import { SourceBadge } from '@/components/evidence/SourceBadge'
import { ReliabilityDot } from '@/components/overview/ReliabilityDot'

/**
 * Reasoning & default completion page.
 * Shows A/B/C scenario tabs + parameter table with constraint annotations.
 */
export default function ReasoningPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const facadeCase = getCaseById(projectId)

  const [activeScenario, setActiveScenario] = useState<'A' | 'B' | 'C'>('A')

  if (!facadeCase) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-tertiary">未找到项目 {projectId}</p>
      </div>
    )
  }

  const scenario = facadeCase.scenarios.find((s) => s.id === activeScenario) ?? facadeCase.scenarios[0]

  const sourceBreakdown = scenario.parameters.reduce(
    (acc, p) => {
      acc[p.source] = (acc[p.source] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const avgReliability =
    scenario.parameters.reduce((sum, p) => sum + p.reliability, 0) / scenario.parameters.length

  const constraintCount = scenario.parameters.filter((p) => p.constraintApplied).length

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink-primary mb-1">约束推理与 AI 缺省补全</h1>
          <p className="text-sm text-ink-secondary">
            基于证据映射结果，通过规范约束推理和 AI 知识补全，生成三套候选设计参数方案。
            每个参数均标注来源状态与可靠度。
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href={`/${projectId}/mapping`} className="btn-secondary text-sm">
            ← 参数映射
          </Link>
          <Link href={`/${projectId}/overview`} className="btn-primary text-sm">
            下一步：结果总览 →
          </Link>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="mb-6">
        <h2 className="label-xs mb-3">候选方案选择</h2>
        <ScenarioSelector
          scenarios={facadeCase.scenarios}
          selectedId={activeScenario}
          onSelect={setActiveScenario}
        />
      </div>

      {/* Stats for current scenario */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="label-xs mb-2">参数总数</p>
          <p className="mono text-lg font-bold text-ink-primary">{scenario.parameters.length}</p>
        </div>
        <div className="card p-4">
          <p className="label-xs mb-2">方案平均可靠度</p>
          <ReliabilityDot value={avgReliability} variant="pill" />
        </div>
        <div className="card p-4">
          <p className="label-xs mb-2">施加约束数</p>
          <p className="mono text-lg font-bold text-ink-primary">{constraintCount}</p>
        </div>
        <div className="card p-4">
          <p className="label-xs mb-2">待复核项</p>
          <p className="mono text-lg font-bold text-review">
            {scenario.parameters.filter((p) => p.source === 'pending_review').length}
          </p>
        </div>
      </div>

      {/* Source breakdown */}
      <div className="card p-4 mb-6">
        <h2 className="label-xs mb-3">方案 {activeScenario} 来源分布</h2>
        <div className="flex items-center gap-6 flex-wrap">
          {Object.entries(sourceBreakdown).map(([source, count]) => (
            <div key={source} className="flex items-center gap-2">
              <SourceBadge source={source as any} variant="badge" />
              <span className="mono text-sm font-medium text-ink-primary">{count}</span>
              <span className="text-xs text-ink-tertiary">
                ({Math.round((count / scenario.parameters.length) * 100)}%)
              </span>
            </div>
          ))}
        </div>

        {/* Visual proportion bar */}
        <div className="mt-3 h-2 rounded-full overflow-hidden flex gap-0.5">
          {scenario.parameters.map((p) => {
            const color =
              p.source === 'direct_observation' ? '#22C55E'
              : p.source === 'rule_inference' ? '#3B82F6'
              : p.source === 'ai_completion' ? '#A855F7'
              : '#F59E0B'
            return (
              <div
                key={p.id}
                className="flex-1"
                style={{ backgroundColor: color }}
                title={`${p.label}: ${p.source}`}
              />
            )
          })}
        </div>
      </div>

      {/* Parameter table */}
      <div>
        <h2 className="label-xs mb-3">
          方案 {activeScenario} — 设计参数详表
        </h2>
        <ParameterTable parameters={scenario.parameters} grouped />
      </div>

      {/* Reasoning method callout */}
      <div className="card p-4 mt-6">
        <h3 className="text-sm font-semibold text-ink-primary mb-3">推理方法说明</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            {
              source: 'direct_observation' as const,
              title: '直接观测值',
              desc: '来自图像量测的参数，直接采用，不做修正',
            },
            {
              source: 'rule_inference' as const,
              title: '规范约束推断',
              desc: '通过国家建筑规范、类型学规律或几何关系约束推导，施加上下界修正',
            },
            {
              source: 'ai_completion' as const,
              title: 'AI 知识补全',
              desc: '视觉证据不足时，AI 基于同类建筑知识库填充缺省值，可靠度标注偏低',
            },
            {
              source: 'pending_review' as const,
              title: '待人工复核',
              desc: '存在多解歧义或置信度极低，当前为占位值，须人工调研后替换',
            },
          ].map((item) => (
            <div key={item.source} className="flex gap-3 p-3 bg-surface-raised rounded-lg border border-border">
              <SourceBadge source={item.source} variant="dot" className="mt-1 shrink-0" />
              <div>
                <p className="font-medium text-ink-primary mb-0.5">{item.title}</p>
                <p className="text-ink-tertiary leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
