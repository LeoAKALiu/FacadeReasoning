import Link from 'next/link'
import { allCases } from '@/data/index'
import { reliabilityToColor, formatReliability } from '@/lib/utils'

/** Home page — product intro + 3 demo case cards + capability highlights. */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-24 overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-40 pointer-events-none"
          aria-hidden
        />
        {/* Gradient fade */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none"
          aria-hidden
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent-subtle border border-accent-muted text-accent text-xs px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            设计认知推理演示平台
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-ink-primary leading-tight mb-5">
            从立面图像到
            <br />
            <span className="text-accent">设计认知结果</span>
          </h1>

          <p className="text-ink-secondary text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Facade Reasoning Demo 将建筑外立面图像转化为有认识论依据的设计参数体系——
            区分直接观测、规则推断、AI 补全与待复核项，提供带可靠度标识的结构化输出。
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/project/new" className="btn-primary px-6 py-2.5 text-base">
              开始新项目
            </Link>
            <Link href={`/case-01/evidence`} className="btn-secondary px-6 py-2.5 text-base">
              查看演示案例
            </Link>
          </div>
        </div>
      </section>

      {/* Capability summary */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: '有效参数提取', icon: '⬛', desc: '从图像中提取可信视觉证据，标注区域依据' },
            { label: '参数映射', icon: '⬛', desc: '有效参数 → 设计参数的可解释映射链' },
            { label: '约束推理补全', icon: '⬛', desc: '规范约束 + AI 缺省值 三套候选方案' },
            { label: '结构化输出', icon: '⬛', desc: '带可靠度的树形结构表达与待复核清单' },
          ].map((cap) => (
            <div key={cap.label} className="card p-4">
              <div className="w-8 h-8 rounded-md bg-accent-subtle border border-accent-muted flex items-center justify-center mb-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="4" height="12" rx="1" fill="#6366F1" fillOpacity="0.8" />
                  <rect x="8" y="4" width="6" height="4" rx="1" fill="#6366F1" fillOpacity="0.5" />
                  <rect x="8" y="10" width="6" height="2" rx="1" fill="#6366F1" fillOpacity="0.3" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-ink-primary mb-1">{cap.label}</h3>
              <p className="text-xs text-ink-tertiary leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Status legend */}
      <section className="px-6 pb-12 max-w-5xl mx-auto">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-ink-primary mb-4">参数来源状态说明</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(
              [
                { color: '#22C55E', bg: 'bg-observe-subtle', border: 'border-observe-muted', label: '直接观测', desc: '从图像直接测量或识别，高置信度视觉证据' },
                { color: '#3B82F6', bg: 'bg-infer-subtle', border: 'border-infer-muted', label: '规则推断', desc: '基于建筑规范、类型学规律或几何关系推导' },
                { color: '#A855F7', bg: 'bg-ai-subtle', border: 'border-ai-muted', label: 'AI 补全', desc: '图像证据不足时，AI 基于训练知识的缺省填充' },
                { color: '#F59E0B', bg: 'bg-review-subtle', border: 'border-review-muted', label: '待复核', desc: '置信度低或存在多解歧义，必须人工验证' },
              ] as const
            ).map((item) => (
              <div key={item.label} className={`${item.bg} border ${item.border} rounded-lg p-3`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-semibold" style={{ color: item.color }}>{item.label}</span>
                </div>
                <p className="text-xs text-ink-tertiary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo cases */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <h2 className="section-heading mb-2">演示案例</h2>
        <p className="text-sm text-ink-tertiary mb-6">
          选择以下任意案例进入完整推理流程，或{' '}
          <Link href="/project/new" className="text-accent hover:underline">上传自己的图像</Link>
          {' '}创建新项目。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {allCases.map((c) => {
            const overallColor = reliabilityToColor(c.overview.overallReliability)
            const pendingCount = c.reviewItems.length
            const highCount = c.reviewItems.filter((r) => r.priority === 'high').length

            return (
              <Link
                key={c.id}
                href={`/${c.id}/evidence`}
                className="card group hover:border-accent transition-all hover:shadow-lg hover:shadow-accent/10 overflow-hidden"
              >
                {/* Fake image area */}
                <div className="h-44 bg-gradient-to-br from-surface-raised via-surface to-surface-overlay flex items-center justify-center relative overflow-hidden">
                  <FacadeThumbnail type={c.id} />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-accent text-white text-xs font-medium px-3 py-1.5 rounded-md">
                      进入推理流程 →
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-ink-tertiary mb-0.5">{c.buildingType}</p>
                    <h3 className="text-sm font-semibold text-ink-primary">{c.name}</h3>
                    <p className="text-xs text-ink-tertiary mt-0.5">{c.location}</p>
                  </div>

                  <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">
                    {c.summary}
                  </p>

                  <div className="divider" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-ink-tertiary">{c.evidence.length} 条证据</span>
                      <span className="text-ink-tertiary">{c.parameterMappings.length} 个映射</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xs text-ink-tertiary">综合可靠度</span>
                      <span
                        className="mono text-xs font-bold"
                        style={{ color: overallColor }}
                      >
                        {formatReliability(c.overview.overallReliability)}
                      </span>
                    </div>
                  </div>

                  {pendingCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-review bg-review-subtle border border-review-muted rounded px-2 py-1.5">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M5 1L9 9H1L5 1Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                        <path d="M5 4V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="5" cy="7.5" r="0.5" fill="currentColor" />
                      </svg>
                      <span>
                        {pendingCount} 项待复核
                        {highCount > 0 && `，其中 ${highCount} 项高优先`}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

/** Unique SVG placeholder per case */
function FacadeThumbnail({ type }: { type: string }) {
  if (type === 'case-01') {
    // Modern glass curtain wall
    return (
      <svg width="160" height="130" viewBox="0 0 160 130" fill="none" className="opacity-70">
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
              opacity={0.6 + Math.random() * 0.4}
            />
          )),
        )}
        <rect x="10" y="5" width="140" height="14" rx="2" fill="#1F2937" />
        <text x="80" y="13.5" fill="#6B7280" fontSize="5" textAnchor="middle" fontFamily="monospace">GLASS CURTAIN WALL</text>
      </svg>
    )
  }

  if (type === 'case-02') {
    // Historic masonry
    return (
      <svg width="160" height="130" viewBox="0 0 160 130" fill="none" className="opacity-70">
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
        {/* Arched entrance */}
        <path d="M60 90 Q80 70 100 90 L100 125 L60 125 Z" fill="#111" stroke="#4a4a3a" strokeWidth="1" />
        <path d="M62 90 Q80 72 98 90" stroke="#6B7280" strokeWidth="1" fill="none" />
      </svg>
    )
  }

  // case-03: parametric diamond
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none" className="opacity-70">
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
              opacity={0.5 + (col + row) * 0.05}
            />
          )
        }),
      )}
    </svg>
  )
}
