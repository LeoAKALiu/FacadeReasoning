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
  const [showSourceBreakdown, setShowSourceBreakdown] = useState(false)
  const [showParamTable, setShowParamTable] = useState(false)
  const [showMethodNote, setShowMethodNote] = useState(false)

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

  const reviewCount = scenario.parameters.filter((p) => p.source === 'pending_review').length
  const recommendedScenarioId = facadeCase.overview?.selectedScenarioId ?? 'A'

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold text-ink-primary">约束推理与 AI 缺省补全</h1>
          <p className="text-sm text-ink-secondary mt-1 pl-0.5 border-l-2 border-accent/50 py-0.5 px-3">
            推荐方案 {recommendedScenarioId}。{scenario.engineeringImpact?.downstreamDifferenceSummary ?? '可选 A/B/C 查看差异。'}
            {reviewCount > 0 && ` 需注意：${reviewCount} 项待复核。`}
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
          projectId={projectId}
        />
        {scenario.engineeringImpact && (
          <div className="card p-3 mt-3 transition-opacity duration-200" key={activeScenario}>
            <p className="label-xs mb-2">对后续结果的影响</p>
            <div className="flex flex-wrap gap-3 text-2xs text-ink-secondary">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
                草图：{scenario.engineeringImpact.structureSketchImpact.split('。')[0]}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /></svg>
                参数表：{scenario.engineeringImpact.parameterTableImpact.split('。')[0]}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4" /></svg>
                复核：{scenario.engineeringImpact.reviewBurden.split('。')[0]}
              </span>
            </div>
          </div>
        )}
        {/* Comparison — 4 metrics */}
        <div className="card p-4 mt-3">
          <p className="label-xs mb-2">方案对比</p>
          <div className="space-y-2 text-xs">
            {[
              { label: '保守程度', value: activeScenario === 'A' ? 90 : activeScenario === 'B' ? 55 : 25 },
              { label: 'AI 补全依赖', value: activeScenario === 'A' ? 15 : activeScenario === 'B' ? 40 : 60 },
              { label: '复核压力', value: activeScenario === 'A' ? 10 : activeScenario === 'B' ? 35 : 50 },
              { label: '当前适用性', value: activeScenario === recommendedScenarioId ? 95 : activeScenario === 'B' ? 60 : 40 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-ink-tertiary w-24 shrink-0">{item.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-surface-overlay overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent/80 transition-all duration-300"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="mono text-2xs text-ink-tertiary w-8">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats — 3 only */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="label-xs mb-2">参数总数</p>
          <p className="mono text-lg font-bold text-ink-primary">{scenario.parameters.length}</p>
        </div>
        <div className="card p-4">
          <p className="label-xs mb-2">平均可靠度</p>
          <ReliabilityDot value={avgReliability} variant="pill" />
        </div>
        <div className="card p-4">
          <p className="label-xs mb-2">高优先复核</p>
          <p className="mono text-lg font-bold text-review">
            {facadeCase.reviewItems.filter((r) => r.priority === 'high').length}
          </p>
        </div>
      </div>

      {/* Source breakdown — collapsible */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSourceBreakdown((v) => !v)}
          className="w-full px-4 py-2 flex items-center justify-between text-left bg-surface-raised/50 hover:bg-surface-raised text-xs text-ink-tertiary"
        >
          <span>方案 {activeScenario} 来源分布</span>
          <span>{showSourceBreakdown ? '收起' : '展开'}</span>
        </button>
        {showSourceBreakdown && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-4 flex-wrap text-xs">
              {Object.entries(sourceBreakdown).map(([source, count]) => (
                <div key={source} className="flex items-center gap-2">
                  <SourceBadge source={source as any} variant="badge" />
                  <span className="mono text-ink-primary">{count}</span>
                  <span className="text-ink-tertiary">({Math.round((count / scenario.parameters.length) * 100)}%)</span>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1.5 rounded-full overflow-hidden flex gap-0.5">
              {scenario.parameters.map((p) => {
                const color = p.source === 'direct_observation' ? '#22C55E' : p.source === 'rule_inference' ? '#3B82F6' : p.source === 'ai_completion' ? '#A855F7' : '#F59E0B'
                return <div key={p.id} className="flex-1" style={{ backgroundColor: color }} title={`${p.label}`} />
              })}
            </div>
          </div>
        )}
      </div>

      {/* Parameter table — collapsible */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowParamTable((v) => !v)}
          className="w-full px-4 py-2 flex items-center justify-between text-left bg-surface-raised/50 hover:bg-surface-raised text-xs text-ink-secondary"
        >
          <span>方案 {activeScenario} — 设计参数详表</span>
          <span>{showParamTable ? '收起' : '展开'}</span>
        </button>
        {showParamTable && (
          <div className="p-4 border-t border-border">
            <ParameterTable parameters={scenario.parameters} grouped />
          </div>
        )}
      </div>

      {/* Reasoning method — collapsible */}
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowMethodNote((v) => !v)}
          className="w-full px-4 py-2 flex items-center justify-between text-left bg-surface-raised/50 hover:bg-surface-raised text-xs text-ink-tertiary"
        >
          <span>推理方法说明</span>
          <span>{showMethodNote ? '收起' : '展开'}</span>
        </button>
        {showMethodNote && (
          <div className="p-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { source: 'direct_observation' as const, title: '直接观测', desc: '图像量测，直接采用' },
              { source: 'rule_inference' as const, title: '规则推断', desc: '规范/类型学推导' },
              { source: 'ai_completion' as const, title: 'AI 补全', desc: '证据不足时缺省填充' },
              { source: 'pending_review' as const, title: '待复核', desc: '须人工验证' },
            ].map((item) => (
              <div key={item.source} className="flex gap-2 p-2 bg-surface-raised rounded border border-border">
                <SourceBadge source={item.source} variant="dot" className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-ink-primary">{item.title}</p>
                  <p className="text-2xs text-ink-tertiary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
