'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { allCases } from '@/data/index'

/**
 * Upload & project creation page.
 * Supports drag-and-drop UI (mock) + selecting a demo case to proceed with.
 */
export default function NewProjectPage() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [selectedCase, setSelectedCase] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [location, setLocation] = useState('')

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Mock: auto-select first demo case
    setSelectedCase('case-01')
  }

  const handleStart = () => {
    const target = selectedCase ?? 'case-01'
    router.push(`/${target}/evidence`)
  }

  const canStart = selectedCase !== null || (projectName.trim().length > 0)

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-ink-tertiary hover:text-ink-primary text-sm mb-8 transition-colors">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        返回首页
      </Link>

      <h1 className="text-2xl font-bold text-ink-primary mb-1">创建新项目</h1>
      <p className="text-ink-secondary text-sm mb-8">
        上传建筑外立面图像，或选择一个演示案例开始推理流程。
      </p>

      {/* Upload area */}
      <section className="mb-8">
        <h2 className="label-xs mb-3">图像上传</h2>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all
            ${isDragging
              ? 'border-accent bg-accent-subtle'
              : 'border-border hover:border-border-strong bg-surface hover:bg-surface-raised'
            }
          `}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
              ${isDragging ? 'bg-accent' : 'bg-surface-raised'}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 16V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V16" stroke={isDragging ? 'white' : '#6B7280'} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 4V15M12 4L8 8M12 4L16 8" stroke={isDragging ? 'white' : '#6B7280'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-ink-primary">拖拽图像到此处</p>
              <p className="text-xs text-ink-tertiary mt-1">
                支持 JPG、PNG、TIFF，建议分辨率 ≥ 2000×2000px
              </p>
            </div>
            <button className="btn-secondary text-xs mt-1">
              或点击选择文件
            </button>
          </div>

          <div className="absolute top-3 right-3">
            <span className="text-2xs text-ink-tertiary bg-surface-raised border border-border px-2 py-1 rounded">
              演示模式：上传后将使用 mock 数据
            </span>
          </div>
        </div>
      </section>

      {/* Project metadata */}
      <section className="mb-8">
        <h2 className="label-xs mb-3">项目信息（可选）</h2>
        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-xs text-ink-secondary mb-1.5">项目名称</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="例：北京国贸 D 座外立面调研"
              className="w-full bg-surface-raised border border-border rounded-md px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-ink-secondary mb-1.5">建筑位置</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例：北京市朝阳区建国门外大街"
              className="w-full bg-surface-raised border border-border rounded-md px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Or: select demo case */}
      <section className="mb-10">
        <h2 className="label-xs mb-3">或选择演示案例直接进入推理流程</h2>
        <div className="space-y-3">
          {allCases.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCase(c.id)}
              className={`
                w-full text-left p-4 rounded-lg border transition-all
                ${selectedCase === c.id
                  ? 'border-accent bg-accent-subtle'
                  : 'border-border bg-surface hover:border-border-strong hover:bg-surface-raised'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5
                  ${selectedCase === c.id ? 'border-accent' : 'border-border'}`}>
                  {selectedCase === c.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-ink-primary">{c.name}</span>
                    <span className="text-2xs text-ink-tertiary bg-surface-raised border border-border px-1.5 py-0.5 rounded">
                      {c.buildingType}
                    </span>
                  </div>
                  <p className="text-xs text-ink-tertiary mt-0.5">{c.location}</p>
                  <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed line-clamp-1">
                    {c.summary}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-2xs text-ink-tertiary">
                    <span>{c.evidence.length} 条证据</span>
                    <span>{c.parameterMappings.length} 个参数映射</span>
                    <span>{c.reviewItems.length} 项待复核</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleStart}
          disabled={!canStart && !selectedCase}
          className="btn-primary px-8 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          开始推理分析 →
        </button>
        {!selectedCase && !projectName && (
          <p className="text-xs text-ink-tertiary">请上传图像或选择演示案例</p>
        )}
      </div>
    </div>
  )
}
