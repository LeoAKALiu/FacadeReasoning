'use client'

import { cn, getImportanceMeta, getRecommendedUsageMeta, getSourceLabel, reliabilityToColor, formatReliability } from '@/lib/utils'
import type { FacadeCase } from '@/data/types'

interface ReportCanvasProps {
  facadeCase: FacadeCase
  printRef?: React.RefObject<HTMLDivElement>
}

/**
 * One-page A4-ratio report canvas for printing or PNG export.
 * Contains facade overview, parameter table, reliability summary, and review items.
 */
export function ReportCanvas({ facadeCase, printRef }: ReportCanvasProps) {
  const scenario = facadeCase.scenarios.find(
    (s) => s.id === facadeCase.overview.selectedScenarioId,
  ) ?? facadeCase.scenarios[0]

  return (
    <div
      ref={printRef}
      id="report-canvas"
      className="bg-white text-gray-900 rounded-lg overflow-hidden"
      style={{
        width: '794px',
        minHeight: '1123px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Header band */}
      <div className="bg-gray-900 text-white px-8 py-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-indigo-500 rounded flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="1" y="1" width="3" height="8" rx="0.5" fill="white" />
                <rect x="6" y="1" width="3" height="4.5" rx="0.5" fill="white" fillOpacity="0.6" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Facade Reasoning Demo — 设计认知推理报告
            </span>
          </div>
          <h1 className="text-xl font-bold">{facadeCase.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{facadeCase.location}</p>
        </div>
        <div className="text-right text-sm text-gray-400 space-y-1">
          <p>{facadeCase.buildingType}</p>
          {facadeCase.buildingYear && <p>建造年份：{facadeCase.buildingYear}</p>}
          <p>采用方案：{facadeCase.overview.selectedScenarioId}</p>
          <p>综合可靠度：
            <span className="font-bold" style={{ color: reliabilityToColor(facadeCase.overview.overallReliability) }}>
              {' '}{formatReliability(facadeCase.overview.overallReliability)}
            </span>
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 space-y-6">
        {/* Project main image */}
        <section>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">项目主图</p>
          <div className="relative w-full aspect-video max-h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={facadeCase.images.original}
              alt={facadeCase.name}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Summary */}
        <section>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">立面概述</p>
          <p className="text-sm text-gray-700 leading-relaxed">{facadeCase.summary}</p>
        </section>

        {facadeCase.overview.recommendedUsage && (
          <section className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-900">
                  {getRecommendedUsageMeta(facadeCase.overview.recommendedUsage).label}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 leading-snug">
                  {(() => {
                    const r = facadeCase.overview.usageReason || getRecommendedUsageMeta(facadeCase.overview.recommendedUsage).description
                    const i = r.search(/[。.!?]/)
                    return i >= 0 ? r.slice(0, i + 1) : r
                  })()}
                </p>
              </div>
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium',
                  getRecommendedUsageMeta(facadeCase.overview.recommendedUsage).classes
                    .replaceAll('bg-observe-subtle', 'bg-green-50')
                    .replaceAll('text-observe', 'text-green-700')
                    .replaceAll('border-observe-muted', 'border-green-200')
                    .replaceAll('bg-infer-subtle', 'bg-blue-50')
                    .replaceAll('text-infer', 'text-blue-700')
                    .replaceAll('border-infer-muted', 'border-blue-200')
                    .replaceAll('bg-ai-subtle', 'bg-purple-50')
                    .replaceAll('text-ai', 'text-purple-700')
                    .replaceAll('border-ai-muted', 'border-purple-200')
                    .replaceAll('bg-review-subtle', 'bg-amber-50')
                    .replaceAll('text-review', 'text-amber-700')
                    .replaceAll('border-review-muted', 'border-amber-200'),
                )}
              >
                {getRecommendedUsageMeta(facadeCase.overview.recommendedUsage).label}
              </span>
            </div>
          </section>
        )}

        {/* Legend */}
        <section className="flex items-center gap-6 flex-wrap">
          {(
            [
              ['direct_observation', '直接观测'],
              ['rule_inference', '规则推断'],
              ['ai_completion', 'AI 补全'],
              ['pending_review', '待复核'],
            ] as const
          ).map(([source, label]) => {
            return (
              <div key={source} className="flex items-center gap-1.5 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      source === 'direct_observation' ? '#22C55E'
                      : source === 'rule_inference' ? '#3B82F6'
                      : source === 'ai_completion' ? '#A855F7'
                      : '#F59E0B',
                  }}
                />
                <span className="text-gray-600">{label}</span>
              </div>
            )
          })}
          <div className="flex items-center gap-3 ml-auto text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-1.5 rounded-full" style={{ background: 'linear-gradient(to right, #EF4444, #EAB308, #22C55E)' }} />
              <span>可靠度颜色示意</span>
            </div>
          </div>
        </section>

        {/* Parameter table */}
        <section>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">
            设计参数汇总（{scenario.label}）
          </p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-3 py-2 font-medium border border-gray-200">分类</th>
                <th className="text-left px-3 py-2 font-medium border border-gray-200">参数名称</th>
                <th className="text-left px-3 py-2 font-medium border border-gray-200">值</th>
                <th className="text-center px-3 py-2 font-medium border border-gray-200">重要性</th>
                <th className="text-center px-3 py-2 font-medium border border-gray-200">来源</th>
                <th className="text-center px-3 py-2 font-medium border border-gray-200">可靠度</th>
              </tr>
            </thead>
            <tbody>
              {scenario.parameters.map((p, i) => {
                const color =
                  p.source === 'direct_observation' ? '#22C55E'
                  : p.source === 'rule_inference' ? '#3B82F6'
                  : p.source === 'ai_completion' ? '#A855F7'
                  : '#F59E0B'
                const relColor = reliabilityToColor(p.reliability)
                return (
                  <tr key={p.id} className={cn('border-b border-gray-100', i % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                    <td className="px-3 py-2 text-gray-500 text-xs border border-gray-200">{p.category}</td>
                    <td className="px-3 py-2 text-gray-800 border border-gray-200">{p.label}</td>
                    <td className="px-3 py-2 font-mono text-gray-900 font-medium border border-gray-200">
                      {p.value}{p.unit ? ` ${p.unit}` : ''}
                    </td>
                    <td className="px-3 py-2 text-center border border-gray-200">
                      {p.importanceLevel && (
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium',
                            getImportanceMeta(p.importanceLevel).classes
                              .replaceAll('bg-red-950/50', 'bg-red-50')
                              .replaceAll('text-red-300', 'text-red-700')
                              .replaceAll('border-red-900/70', 'border-red-200')
                              .replaceAll('bg-blue-950/50', 'bg-blue-50')
                              .replaceAll('text-blue-300', 'text-blue-700')
                              .replaceAll('border-blue-900/70', 'border-blue-200')
                              .replaceAll('bg-slate-800/80', 'bg-slate-100')
                              .replaceAll('text-slate-300', 'text-slate-700')
                              .replaceAll('border-slate-700', 'border-slate-200'),
                          )}
                        >
                          {getImportanceMeta(p.importanceLevel).label}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center border border-gray-200">
                      <span
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ color, backgroundColor: `${color}18`, border: `1px solid ${color}40` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        {getSourceLabel(p.source)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center border border-gray-200">
                      <span className="font-mono text-xs font-bold" style={{ color: relColor }}>
                        {formatReliability(p.reliability)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        {facadeCase.overview.futureOutputs && (
          <section className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                未来成果物预览
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    {facadeCase.overview.futureOutputs.structuralSketchPreview.title}
                  </p>
                  <svg viewBox="0 0 260 150" className="w-full h-auto mb-3">
                    <rect x="18" y="16" width="224" height="112" rx="6" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
                    <rect x="44" y="36" width="172" height="70" rx="4" fill="none" stroke="#6366F1" strokeDasharray="4 3" />
                    <line x1="76" y1="36" x2="76" y2="106" stroke="#94A3B8" />
                    <line x1="116" y1="36" x2="116" y2="106" stroke="#94A3B8" />
                    <line x1="156" y1="36" x2="156" y2="106" stroke="#94A3B8" />
                    <line x1="196" y1="36" x2="196" y2="106" stroke="#94A3B8" />
                    <line x1="44" y1="60" x2="216" y2="60" stroke="#CBD5E1" />
                    <line x1="44" y1="84" x2="216" y2="84" stroke="#CBD5E1" />
                    {[76, 116, 156, 196].map((x) => (
                      <circle key={x} cx={x} cy={60} r="3.5" fill="#22C55E" />
                    ))}
                    {[76, 116, 156, 196].map((x) => (
                      <circle key={`${x}-2`} cx={x} cy={84} r="3.5" fill="#22C55E" />
                    ))}
                  </svg>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {facadeCase.overview.futureOutputs.structuralSketchPreview.summary}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">结构参数表与构件候选</p>
                  <div className="space-y-2 mb-3">
                    {facadeCase.overview.futureOutputs.structuralParameterTable.slice(0, 4).map((row) => (
                      <div key={row.label} className="flex items-center justify-between text-xs border-b border-gray-100 pb-1">
                        <span className="text-gray-600">{row.label}</span>
                        <span className="font-mono text-gray-900">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {facadeCase.overview.futureOutputs.componentCandidates.slice(0, 2).map((item) => (
                      <div key={item.label}>
                        <p className="text-xs font-medium text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{item.candidates.join(' / ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Review items */}
        {facadeCase.reviewItems.length > 0 && (
          <section>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">
              待人工复核项（{facadeCase.reviewItems.length} 项）
            </p>
            <div className="space-y-2">
              {facadeCase.reviewItems.map((item, i) => (
                <div key={item.id} className="flex gap-3 p-3 border border-amber-200 bg-amber-50 rounded-lg text-sm">
                  <span className="w-5 h-5 rounded bg-amber-200 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.parameterLabel}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{item.issue}</p>
                  </div>
                  <div className="shrink-0">
                    <span
                      className={cn(
                        'text-2xs px-2 py-0.5 rounded-full font-medium',
                        item.priority === 'high' ? 'bg-red-100 text-red-600' : item.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500',
                      )}
                    >
                      {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}优先
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {facadeCase.overview.evolution && (
          <section>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">
              系统演进路径
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {[
                facadeCase.overview.evolution.currentStage,
                facadeCase.overview.evolution.nextStage,
                facadeCase.overview.evolution.targetStage,
              ].map((stage, index) => (
                <div key={stage.title} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <p className="font-medium text-gray-900">{stage.title}</p>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{stage.description}</p>
                  <div className="space-y-1">
                    {stage.bullets.map((bullet) => (
                      <p key={bullet} className="text-xs text-gray-500">• {bullet}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
          <span>Generated by Facade Reasoning Demo</span>
          <span>{new Date().toLocaleDateString('zh-CN')}</span>
        </footer>
      </div>
    </div>
  )
}
