'use client'

import { cn, getSourceColors, getSourceLabel, reliabilityToColor, formatReliability } from '@/lib/utils'
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
        fontFamily: "'Inter', sans-serif",
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
        {/* Summary */}
        <section>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">立面概述</p>
          <p className="text-sm text-gray-700 leading-relaxed">{facadeCase.summary}</p>
        </section>

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
            const colors = getSourceColors(source)
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

        {/* Footer */}
        <footer className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
          <span>Generated by Facade Reasoning Demo</span>
          <span>{new Date().toLocaleDateString('zh-CN')}</span>
        </footer>
      </div>
    </div>
  )
}
