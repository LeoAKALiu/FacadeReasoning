import Link from 'next/link'
import { allCases } from '@/data/index'
import { reliabilityToColor, formatReliability } from '@/lib/utils'
import type { FacadeCase } from '@/data/types'
import { CaseCardImage } from '@/components/home/CaseCardImage'
import { FlowBandReveal } from '@/components/home/FlowBandReveal'
import { CaseHeroPreview } from '@/components/home/CaseHeroPreview'

const DEMO_VALUE: Record<string, string> = {
  'case-01': '立面模数清晰，适合展示高可靠度推断。',
  'case-02': '构件缺损明显，适合展示 AI 补全与人工复核。',
  'case-03': '分格规则存在多解，适合展示候选方案差异。',
}

function getReliabilitySemantic(c: FacadeCase): string {
  const total = c.evidence.length
  if (total === 0) return '证据不足'
  const obs = c.evidence.filter((e) => e.source === 'direct_observation').length
  const ai = c.evidence.filter((e) => e.source === 'ai_completion').length
  const review = c.evidence.filter((e) => e.source === 'pending_review').length
  const rel = c.overview.overallReliability
  if (rel >= 0.8 && obs / total >= 0.6) return '高可靠度：以直接观测为主'
  if (c.reviewItems.length >= 2 && c.scenarios.length >= 2) return '中等可靠度：多方案分歧明显'
  if (ai / total >= 0.2 || review / total >= 0.15) return '中等可靠度：AI 补全或待复核占比较高'
  if (rel >= 0.75) return '较高可靠度：证据结构较均衡'
  return '中等可靠度：建议结合人工复核'
}

/** Home page — product intro + flow band + legend + 3 demo case cards. */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-40 pointer-events-none"
          aria-hidden
        />
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
            自动提取立面证据，推断设计参数，补全缺失信息，并输出带可靠度标识的结构结果。
          </p>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-4">
              <Link href="/project/new" className="btn-primary px-6 py-2.5 text-base">
                开始新项目
              </Link>
              <Link href="/case-01/evidence" className="btn-secondary px-6 py-2.5 text-base">
                查看演示案例
              </Link>
            </div>
            <p className="text-xs text-ink-tertiary">
              建议先查看演示案例，3 分钟看完整流程
            </p>
          </div>
        </div>
      </section>

      {/* Flow band: 输入 → 推理 → 输出 (scroll reveal) */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <FlowBandReveal>
          {/* Step 1: 有效参数提取 */}
          <div className="card p-4 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-md bg-accent-subtle border border-accent-muted flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="4" height="12" rx="1" fill="currentColor" fillOpacity="0.8" />
                <rect x="8" y="4" width="6" height="4" rx="1" fill="currentColor" fillOpacity="0.5" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-ink-primary mb-1">有效参数提取</h3>
            <p className="text-xs text-ink-tertiary leading-relaxed">从图像提取证据</p>
          </div>
          <div className="hidden sm:flex items-center shrink-0 text-ink-tertiary py-4">
            <span className="text-lg">→</span>
          </div>
          {/* Step 2: 参数映射 */}
          <div className="card p-4 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-md bg-accent-subtle border border-accent-muted flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h4l2-4 2 8 2-4h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-ink-primary mb-1">参数映射</h3>
            <p className="text-xs text-ink-tertiary leading-relaxed">证据 → 设计参数</p>
          </div>
          <div className="hidden sm:flex items-center shrink-0 text-ink-tertiary py-4">
            <span className="text-lg">→</span>
          </div>
          {/* Step 3: 约束推理补全 — 加重 */}
          <div className="card p-5 flex-1 min-w-0 border-accent/30 bg-surface-raised">
            <div className="w-9 h-9 rounded-md bg-accent-subtle border border-accent-muted flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 5v4l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-ink-primary mb-1">约束推理补全</h3>
            <p className="text-xs text-ink-tertiary leading-relaxed">约束 + AI 补全，多方案</p>
          </div>
          <div className="hidden sm:flex items-center shrink-0 text-ink-tertiary py-4">
            <span className="text-lg">→</span>
          </div>
          {/* Step 4: 结构化输出 — 加重 */}
          <div className="card p-5 flex-1 min-w-0 border-accent/30 bg-surface-raised">
            <div className="w-9 h-9 rounded-md bg-accent-subtle border border-accent-muted flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <rect x="10" y="2" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <rect x="2" y="10" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <rect x="10" y="10" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-ink-primary mb-1">结构化输出</h3>
            <p className="text-xs text-ink-tertiary leading-relaxed">带可靠度的结果与待复核</p>
          </div>
        </FlowBandReveal>
      </section>

      {/* System preview carousel */}
      <CaseHeroPreview />

      {/* Status legend — minimal */}
      <section className="px-6 pb-12 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-2xs text-ink-tertiary border border-border rounded-lg px-3 py-2 bg-surface/50">
          <span className="text-ink-secondary font-medium shrink-0">参数来源</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-observe" />直接观测</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-infer" />规则推断</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-ai" />AI 补全</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-review" />待复核</span>
        </div>
      </section>

      {/* Demo cases */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <h2 className="section-heading mb-2">演示案例</h2>
        <p className="text-xs text-ink-tertiary mb-4">
          选案例进入推理流程，或 <Link href="/project/new" className="text-accent hover:underline">上传图像</Link> 创建新项目。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {allCases.map((c) => {
            const overallColor = reliabilityToColor(c.overview.overallReliability)
            const pendingCount = c.reviewItems.length
            const highCount = c.reviewItems.filter((r) => r.priority === 'high').length
            const demoValue = DEMO_VALUE[c.id] ?? c.summary
            const reliabilitySemantic = getReliabilitySemantic(c)

            return (
              <Link
                key={c.id}
                href={`/${c.id}/evidence`}
                className="card group hover:border-accent transition-all hover:shadow-lg hover:shadow-accent/10 overflow-hidden hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="aspect-video max-h-44 bg-surface-raised flex items-center justify-center relative overflow-hidden">
                  <CaseCardImage src={c.thumbnailUrl} alt={c.name} caseId={c.id} className="absolute inset-0" />
                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-accent text-white text-xs font-medium px-3 py-1.5 rounded-md">
                      进入推理流程 →
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-base font-semibold text-ink-primary leading-tight">{c.name}</h3>
                  <p className="text-xs text-ink-secondary leading-snug">{demoValue}</p>
                  <p className="text-2xs text-ink-tertiary">{c.buildingType}{c.location ? ` · ${c.location}` : ''}</p>

                  <div className="divider" />

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3 text-xs text-ink-tertiary">
                      <span>{c.evidence.length} 条证据</span>
                      <span>{c.parameterMappings.length} 个映射</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="mono text-xs font-bold" style={{ color: overallColor }}>
                        {formatReliability(c.overview.overallReliability)}
                      </span>
                      <span className="text-2xs text-ink-tertiary">综合可靠度</span>
                    </div>
                  </div>
                  <p className="text-2xs text-ink-tertiary leading-snug">{reliabilitySemantic}</p>

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
