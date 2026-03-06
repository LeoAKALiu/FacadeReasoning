/**
 * Core type definitions for the Facade Reasoning Demo.
 * All data flows from evidence extraction through parameter mapping,
 * constraint reasoning, and final structured output.
 */

// ---------------------------------------------------------------------------
// Evidence Source — the epistemic status of any derived value
// ---------------------------------------------------------------------------

export type EvidenceSource =
  | 'direct_observation' // Visually confirmed from image — green
  | 'rule_inference' // Derived via architectural/building-code rules — blue
  | 'ai_completion' // Inferred by AI default-fill — purple
  | 'pending_review' // Conflicting or low-confidence, needs human review — amber

// ---------------------------------------------------------------------------
// Evidence — raw extracted signals from the facade image
// ---------------------------------------------------------------------------

export type EvidenceCategory =
  | 'material'
  | 'proportion'
  | 'pattern'
  | 'color'
  | 'texture'
  | 'geometry'
  | 'opening'
  | 'joint'
  | 'module'

export interface EvidenceRegion {
  /** Normalized coordinates (0–1) within the image */
  x: number
  y: number
  w: number
  h: number
}

export interface Evidence {
  id: string
  category: EvidenceCategory
  label: string
  value: string
  confidence: number // 0–1
  source: EvidenceSource
  basisText: string
  region?: EvidenceRegion
}

// ---------------------------------------------------------------------------
// Parameter Mapping — evidence → design parameters
// ---------------------------------------------------------------------------

export interface EffectiveParam {
  id: string
  label: string
  value: string
  unit?: string
}

export interface DesignParamRef {
  id: string
  label: string
  category: string
}

export interface ParameterMapping {
  id: string
  effectiveParam: EffectiveParam
  designParam: DesignParamRef
  evidenceIds: string[]
  confidence: number // 0–1
  mappingReason: string
}

// ---------------------------------------------------------------------------
// Design Parameters — the typed, categorised parameter set
// ---------------------------------------------------------------------------

export interface DesignParameter {
  id: string
  category: string
  label: string
  value: string
  unit?: string
  source: EvidenceSource
  reliability: number // 0–1
  basisText: string
  constraintApplied?: string
}

// ---------------------------------------------------------------------------
// Scenario — one candidate interpretation (A / B / C)
// ---------------------------------------------------------------------------

export interface Scenario {
  id: 'A' | 'B' | 'C'
  label: string
  description: string
  divergenceNote: string // key difference from other scenarios
  parameters: DesignParameter[]
}

// ---------------------------------------------------------------------------
// Overview — final structured expression with reliability
// ---------------------------------------------------------------------------

export interface StructuralNode {
  id: string
  type: string
  label: string
  value: string
  unit?: string
  reliability: number // 0–1
  source: EvidenceSource
  children?: StructuralNode[]
}

export interface OverviewResult {
  selectedScenarioId: 'A' | 'B' | 'C'
  overallReliability: number
  structuralNodes: StructuralNode[]
}

// ---------------------------------------------------------------------------
// Review Items — parameters requiring human verification
// ---------------------------------------------------------------------------

export interface ReviewItem {
  id: string
  parameterLabel: string
  currentValue: string
  issue: string
  suggestion: string
  priority: 'high' | 'medium' | 'low'
  relatedEvidenceIds: string[]
}

// ---------------------------------------------------------------------------
// Top-level case data
// ---------------------------------------------------------------------------

export interface CaseImages {
  original: string
  evidence: string
  corrected: string
}

export interface FacadeCase {
  id: string
  name: string
  location: string
  buildingType: string
  buildingYear?: string
  floors?: number
  createdAt: string
  thumbnailUrl: string
  images: CaseImages
  summary: string
  evidence: Evidence[]
  parameterMappings: ParameterMapping[]
  scenarios: Scenario[]
  overview: OverviewResult
  reviewItems: ReviewItem[]
}

// ---------------------------------------------------------------------------
// Step navigation
// ---------------------------------------------------------------------------

export interface ProjectStep {
  id: string
  label: string
  path: string
  index: number
}

export const PROJECT_STEPS: ProjectStep[] = [
  { id: 'evidence', label: '证据提取', path: 'evidence', index: 1 },
  { id: 'mapping', label: '参数映射', path: 'mapping', index: 2 },
  { id: 'reasoning', label: '推理补全', path: 'reasoning', index: 3 },
  { id: 'overview', label: '结果总览', path: 'overview', index: 4 },
  { id: 'export', label: '导出汇报', path: 'export', index: 5 },
]
