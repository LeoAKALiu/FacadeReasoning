interface EngineeringTranslationFlowProps {
  bridgeNote?: string
}

const STEPS = [
  {
    title: '当前已完成',
    items: ['有效参数', '设计参数', '候选方案', '可靠度标识'],
    description: '系统已经完成从图像到参数结果的推理表达。',
  },
  {
    title: '结构转译',
    items: ['标准层组织方式', '轴网候选', '柱梁板参数候选', '结构草图'],
    description: '下一步会把参数结果进一步转译为工程表达层的中间成果。',
  },
  {
    title: '未来工程表达成果',
    items: ['带可靠度标识的结构图', '结构参数表', '待复核参数清单', '设计建议输出'],
    description: '终局不是停留在分析，而是形成可用于汇报和协同的工程表达结果。',
  },
]

/**
 * Shows the bridge from current parameter reasoning to future engineering expression.
 */
export function EngineeringTranslationFlow({
  bridgeNote,
}: EngineeringTranslationFlowProps) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="label-xs mb-1">参数到结构表达</p>
          <h3 className="text-sm font-semibold text-ink-primary">从推理结果到工程表达生成路径</h3>
        </div>
        {bridgeNote && <p className="text-xs text-ink-tertiary max-w-xs text-right">{bridgeNote}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {STEPS.map((step, index) => (
          <div key={step.title} className="rounded-lg border border-border bg-surface-raised p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-accent-subtle border border-accent-muted text-accent text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <h4 className="text-sm font-semibold text-ink-primary">{step.title}</h4>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed mb-3">{step.description}</p>
            <div className="space-y-1.5">
              {step.items.map((item) => (
                <div key={item} className="text-xs text-ink-tertiary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
