import type {
  DesignParameter,
  FacadeCase,
  ParameterImportanceLevel,
  ParameterMapping,
  StructuralNode,
} from '../types'

interface ParameterMeta {
  parameterKey: string
  importanceLevel: ParameterImportanceLevel
  importanceNote: string
  futureUseNote?: string
}

interface CaseMetaConfig {
  parameterMetaByLabel: Record<string, ParameterMeta>
}

function enrichParameter(parameter: DesignParameter, meta?: ParameterMeta): DesignParameter {
  if (!meta) return parameter
  return {
    ...parameter,
    parameterKey: meta.parameterKey,
    importanceLevel: meta.importanceLevel,
    importanceNote: meta.importanceNote,
  }
}

function enrichMapping(mapping: ParameterMapping, meta?: ParameterMeta): ParameterMapping {
  if (!meta) return mapping
  return {
    ...mapping,
    parameterKey: meta.parameterKey,
    importanceLevel: meta.importanceLevel,
    importanceNote: meta.importanceNote,
    futureUseNote: meta.futureUseNote,
  }
}

function enrichNode(node: StructuralNode, metaByLabel: Record<string, ParameterMeta>): StructuralNode {
  const meta = metaByLabel[node.label]
  return {
    ...node,
    parameterKey: meta?.parameterKey,
    children: node.children?.map((child) => enrichNode(child, metaByLabel)),
  }
}

export function enrichFacadeCase(
  facadeCase: FacadeCase,
  config: CaseMetaConfig,
): FacadeCase {
  return {
    ...facadeCase,
    parameterMappings: facadeCase.parameterMappings.map((mapping) =>
      enrichMapping(mapping, config.parameterMetaByLabel[mapping.designParam.label]),
    ),
    scenarios: facadeCase.scenarios.map((scenario) => ({
      ...scenario,
      parameters: scenario.parameters.map((parameter) =>
        enrichParameter(parameter, config.parameterMetaByLabel[parameter.label]),
      ),
    })),
    overview: {
      ...facadeCase.overview,
      structuralNodes: facadeCase.overview.structuralNodes.map((node) =>
        enrichNode(node, config.parameterMetaByLabel),
      ),
    },
    reviewItems: facadeCase.reviewItems.map((item) => {
      const meta = config.parameterMetaByLabel[item.parameterLabel]
      return meta
        ? {
            ...item,
            relatedParameterKeys: item.relatedParameterKeys ?? [meta.parameterKey],
          }
        : item
    }),
  }
}
