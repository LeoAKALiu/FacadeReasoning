import type { FacadeCase } from '../types'

/**
 * Case 01 — 现代玻璃幕墙办公楼
 * 特征：高置信度直接观测为主，幕墙模数清晰，材质信息完整
 */
export const case01: FacadeCase = {
  id: 'case-01',
  name: '滨江科技园 A座',
  location: '上海市浦东新区张江高科技园区',
  buildingType: '现代超高层办公楼',
  buildingYear: '2019',
  floors: 42,
  createdAt: '2026-03-04T09:30:00Z',
  thumbnailUrl: '/images/case01-thumb.jpg',
  summary:
    '全玻璃幕墙体系，单元式竖向分格，铝合金型材骨架可见，立面模数清晰，整体识别置信度高。',
  images: {
    original: '/images/case01-original.jpg',
    evidence: '/images/case01-evidence.jpg',
    corrected: '/images/case01-corrected.jpg',
  },

  evidence: [
    {
      id: 'e01-01',
      category: 'material',
      label: '外幕墙玻璃类型',
      value: '低辐射镀膜中空玻璃',
      confidence: 0.94,
      source: 'direct_observation',
      basisText: '反射率与透射率比例符合 Low-E 双层中空玻璃特征，边缘可见明显镀膜色差。',
      region: { x: 0.1, y: 0.1, w: 0.8, h: 0.5 },
    },
    {
      id: 'e01-02',
      category: 'module',
      label: '幕墙单元标准模数宽',
      value: '1500',
      confidence: 0.92,
      source: 'direct_observation',
      basisText: '通过像素密度标定与楼层高度参照，横向单元格宽度测算为 1500mm ± 30mm。',
      region: { x: 0.15, y: 0.2, w: 0.35, h: 0.6 },
    },
    {
      id: 'e01-03',
      category: 'proportion',
      label: '开窗面积比（WWR）',
      value: '0.78',
      confidence: 0.89,
      source: 'direct_observation',
      basisText: '可见立面玻璃面积占外皮总面积比约 78%，竖向铝框遮挡约 22%。',
      region: { x: 0.05, y: 0.05, w: 0.9, h: 0.9 },
    },
    {
      id: 'e01-04',
      category: 'geometry',
      label: '楼层净高',
      value: '4200',
      confidence: 0.87,
      source: 'rule_inference',
      basisText:
        '基于幕墙单元竖向分格（4200mm）与标准超高层办公层高规律推断，结合顶部设备层高度校正。',
      region: { x: 0.6, y: 0.1, w: 0.3, h: 0.8 },
    },
    {
      id: 'e01-05',
      category: 'material',
      label: '竖向铝合金型材颜色',
      value: '香槟金阳极氧化',
      confidence: 0.85,
      source: 'direct_observation',
      basisText: '铝框颜色与标准 RAL 1015 香槟金色系吻合，表面处理为阳极氧化工艺可见光泽特征。',
      region: { x: 0.2, y: 0.15, w: 0.1, h: 0.7 },
    },
    {
      id: 'e01-06',
      category: 'joint',
      label: '竖向分缝宽度',
      value: '20',
      confidence: 0.78,
      source: 'direct_observation',
      basisText: '竖向铝框可见缝宽约 20mm，符合单元幕墙标准公差范围。',
      region: { x: 0.3, y: 0.3, w: 0.05, h: 0.4 },
    },
    {
      id: 'e01-07',
      category: 'pattern',
      label: '外遮阳形式',
      value: '无外遮阳（内置百叶）',
      confidence: 0.81,
      source: 'direct_observation',
      basisText: '外立面无突出遮阳构件，室内可见横向百叶投影特征，判断为内置遮阳百叶。',
    },
    {
      id: 'e01-08',
      category: 'color',
      label: '幕墙整体色调',
      value: '蓝绿反射系（#8DB5C8）',
      confidence: 0.93,
      source: 'direct_observation',
      basisText: '天空反射与玻璃本体色合成后主色调为蓝绿系，采样点 RGB 均值(141, 181, 200)。',
    },
    {
      id: 'e01-09',
      category: 'opening',
      label: '可开启扇比例',
      value: '约 8%',
      confidence: 0.55,
      source: 'ai_completion',
      basisText:
        'AI 依据同类超高层办公楼规范补全：《公共建筑节能设计标准》要求可开启面积不低于外窗面积 10%，结合视觉无明显开启扇，推断约 8%。',
    },
    {
      id: 'e01-10',
      category: 'geometry',
      label: '裙楼与标准层分界高度',
      value: '约 5层（21m）',
      confidence: 0.62,
      source: 'pending_review',
      basisText:
        '底部 5 层立面材质与颜色略有差异，疑似裙楼与标准塔楼分界，但差异细微需人工确认。',
      region: { x: 0.0, y: 0.75, w: 1.0, h: 0.25 },
    },
  ],

  parameterMappings: [
    {
      id: 'pm-01-01',
      effectiveParam: { id: 'ep-mat', label: '玻璃镀膜类型', value: 'Low-E 中空' },
      designParam: { id: 'dp-thermal', label: '外窗热工性能等级', category: '节能性能' },
      evidenceIds: ['e01-01'],
      confidence: 0.91,
      mappingReason:
        'Low-E 中空玻璃对应 GB 节能标准 K 值约 1.8–2.0 W/(m²·K)，归入外窗节能等级 II 级。',
    },
    {
      id: 'pm-01-02',
      effectiveParam: { id: 'ep-mod', label: '幕墙模数宽', value: '1500mm' },
      designParam: { id: 'dp-grid', label: '立面竖向分格基准模数', category: '立面构成' },
      evidenceIds: ['e01-02'],
      confidence: 0.92,
      mappingReason: '幕墙单元宽即立面最小分格单元，直接映射为竖向分格基准模数。',
    },
    {
      id: 'pm-01-03',
      effectiveParam: { id: 'ep-wwr', label: 'WWR', value: '0.78' },
      designParam: { id: 'dp-wwr', label: '外窗墙比', category: '形态参数' },
      evidenceIds: ['e01-03'],
      confidence: 0.89,
      mappingReason: '直接观测值即为设计参数外窗墙比（Window-to-Wall Ratio）。',
    },
    {
      id: 'pm-01-04',
      effectiveParam: { id: 'ep-fh', label: '层高', value: '4200mm' },
      designParam: { id: 'dp-fh', label: '标准层层高', category: '空间参数' },
      evidenceIds: ['e01-04'],
      confidence: 0.87,
      mappingReason: '通过幕墙竖向分格推断的层高值直接对应建筑标准层层高设计参数。',
    },
    {
      id: 'pm-01-05',
      effectiveParam: { id: 'ep-frame', label: '铝框颜色', value: '香槟金阳极氧化' },
      designParam: { id: 'dp-finish', label: '幕墙骨架表面处理', category: '材料参数' },
      evidenceIds: ['e01-05'],
      confidence: 0.85,
      mappingReason: '铝合金型材颜色与表面处理工艺直接对应幕墙骨架表面处理设计参数。',
    },
    {
      id: 'pm-01-06',
      effectiveParam: { id: 'ep-shade', label: '外遮阳形式', value: '内置百叶' },
      designParam: { id: 'dp-shade', label: '遮阳策略', category: '节能性能' },
      evidenceIds: ['e01-07'],
      confidence: 0.81,
      mappingReason: '遮阳策略设计参数反映主动/被动遮阳选择，内置百叶为被动内遮阳。',
    },
  ],

  scenarios: [
    {
      id: 'A',
      label: '方案 A — 基准解释',
      description: '以直接观测为主，模数与热工参数取观测均值，层高取推断中位数。',
      divergenceNote: '此方案优先信任视觉证据，对 AI 补全值不做调整。',
      parameters: [
        {
          id: 'p-A-01', category: '立面构成', label: '竖向分格基准模数', value: '1500', unit: 'mm',
          source: 'direct_observation', reliability: 0.92, basisText: '幕墙单元像素测量 + 层高参照',
        },
        {
          id: 'p-A-02', category: '立面构成', label: '横向分格高度', value: '4200', unit: 'mm',
          source: 'rule_inference', reliability: 0.87, basisText: '竖向幕墙分格推算',
          constraintApplied: '超高层层高规范约束 [3900–4500mm]',
        },
        {
          id: 'p-A-03', category: '形态参数', label: '外窗墙比（WWR）', value: '0.78',
          source: 'direct_observation', reliability: 0.89, basisText: '立面像素面积比',
        },
        {
          id: 'p-A-04', category: '节能性能', label: '外窗 K 值', value: '1.9', unit: 'W/(m²·K)',
          source: 'rule_inference', reliability: 0.88,
          basisText: 'Low-E 中空玻璃标准热工性能范围 1.8–2.0',
          constraintApplied: '《公共建筑节能设计标准》寒冷地区 K≤2.0',
        },
        {
          id: 'p-A-05', category: '材料参数', label: '幕墙骨架表面处理', value: '香槟金阳极氧化',
          source: 'direct_observation', reliability: 0.85, basisText: 'RGB 色值比对 RAL1015',
        },
        {
          id: 'p-A-06', category: '节能性能', label: '遮阳系数 SC', value: '0.35',
          source: 'ai_completion', reliability: 0.68,
          basisText: 'AI 依 Low-E 玻璃 + 内置百叶组合推算遮阳系数',
          constraintApplied: '寒冷地区南向 SC≤0.40',
        },
        {
          id: 'p-A-07', category: '空间参数', label: '可开启扇比例', value: '8%',
          source: 'ai_completion', reliability: 0.55,
          basisText: 'AI 补全：规范最低要求参照',
        },
        {
          id: 'p-A-08', category: '空间参数', label: '裙楼高度', value: '21', unit: 'm',
          source: 'pending_review', reliability: 0.62,
          basisText: '底部材质差异疑似裙楼边界，需人工确认',
        },
      ],
    },
    {
      id: 'B',
      label: '方案 B — 保守估算',
      description: '对 AI 补全值取规范下限，层高取 4000mm（保守），WWR 适度下调。',
      divergenceNote: '此方案对视觉量化结果施加规范约束下限修正。',
      parameters: [
        {
          id: 'p-B-01', category: '立面构成', label: '竖向分格基准模数', value: '1500', unit: 'mm',
          source: 'direct_observation', reliability: 0.92, basisText: '幕墙单元像素测量 + 层高参照',
        },
        {
          id: 'p-B-02', category: '立面构成', label: '横向分格高度', value: '4000', unit: 'mm',
          source: 'rule_inference', reliability: 0.78, basisText: '保守取规范下限',
          constraintApplied: '规范约束下限 3900mm + 安全余量',
        },
        {
          id: 'p-B-03', category: '形态参数', label: '外窗墙比（WWR）', value: '0.72',
          source: 'rule_inference', reliability: 0.82, basisText: '寒冷地区规范上限约束后取较低值',
          constraintApplied: '《节能标准》北方超高层 WWR≤0.70（东/北向）',
        },
        {
          id: 'p-B-04', category: '节能性能', label: '外窗 K 值', value: '2.0', unit: 'W/(m²·K)',
          source: 'rule_inference', reliability: 0.85, basisText: '取规范允许上限值',
          constraintApplied: 'K≤2.0 规范上限',
        },
        {
          id: 'p-B-05', category: '材料参数', label: '幕墙骨架表面处理', value: '香槟金阳极氧化',
          source: 'direct_observation', reliability: 0.85, basisText: 'RGB 色值比对',
        },
        {
          id: 'p-B-06', category: '节能性能', label: '遮阳系数 SC', value: '0.40',
          source: 'rule_inference', reliability: 0.72, basisText: '取规范约束边界值',
          constraintApplied: '寒冷地区南向 SC≤0.40 取上限',
        },
        {
          id: 'p-B-07', category: '空间参数', label: '可开启扇比例', value: '10%',
          source: 'rule_inference', reliability: 0.70, basisText: '取规范最低要求 10%',
          constraintApplied: '规范强制要求可开启面积≥外窗面积 10%',
        },
        {
          id: 'p-B-08', category: '空间参数', label: '裙楼高度', value: '21', unit: 'm',
          source: 'pending_review', reliability: 0.62, basisText: '同方案 A，待复核',
        },
      ],
    },
    {
      id: 'C',
      label: '方案 C — 高性能假设',
      description: '假设该项目为绿色三星建筑，节能参数取高性能区间，WWR 受主动调控。',
      divergenceNote: '此方案引入绿色建筑约束，K 值与 SC 均取优化值。',
      parameters: [
        {
          id: 'p-C-01', category: '立面构成', label: '竖向分格基准模数', value: '1500', unit: 'mm',
          source: 'direct_observation', reliability: 0.92, basisText: '幕墙单元像素测量',
        },
        {
          id: 'p-C-02', category: '立面构成', label: '横向分格高度', value: '4200', unit: 'mm',
          source: 'rule_inference', reliability: 0.87, basisText: '竖向幕墙分格推算',
          constraintApplied: '绿色建筑净高不低于 2800mm → 层高合理取 4200mm',
        },
        {
          id: 'p-C-03', category: '形态参数', label: '外窗墙比（WWR）', value: '0.75',
          source: 'rule_inference', reliability: 0.84, basisText: '绿三星 BIPV 优化值',
          constraintApplied: '绿色三星南向 WWR 推荐≤0.80，取 0.75',
        },
        {
          id: 'p-C-04', category: '节能性能', label: '外窗 K 值', value: '1.6', unit: 'W/(m²·K)',
          source: 'ai_completion', reliability: 0.76, basisText: 'AI 推断：三层中空 Low-E 玻璃',
          constraintApplied: '绿色三星外窗 K≤1.8，取优化值 1.6',
        },
        {
          id: 'p-C-05', category: '材料参数', label: '幕墙骨架表面处理', value: '香槟金阳极氧化',
          source: 'direct_observation', reliability: 0.85, basisText: 'RGB 色值比对',
        },
        {
          id: 'p-C-06', category: '节能性能', label: '遮阳系数 SC', value: '0.28',
          source: 'ai_completion', reliability: 0.71, basisText: 'AI 推断高性能遮阳组合',
          constraintApplied: '绿色三星南向推荐 SC≤0.30',
        },
        {
          id: 'p-C-07', category: '空间参数', label: '可开启扇比例', value: '15%',
          source: 'ai_completion', reliability: 0.65, basisText: 'AI 推断：绿建自然通风要求',
          constraintApplied: '绿色建筑自然通风不低于 10%，高性能取 15%',
        },
        {
          id: 'p-C-08', category: '空间参数', label: '裙楼高度', value: '21', unit: 'm',
          source: 'pending_review', reliability: 0.62, basisText: '同上，待复核',
        },
      ],
    },
  ],

  overview: {
    selectedScenarioId: 'A',
    overallReliability: 0.84,
    structuralNodes: [
      {
        id: 'sn-facade', type: 'system', label: '外立面体系', value: '单元式玻璃幕墙',
        reliability: 0.92, source: 'direct_observation',
        children: [
          {
            id: 'sn-grid', type: 'dimension', label: '立面模数体系', value: '1500mm × 4200mm',
            reliability: 0.90, source: 'direct_observation',
            children: [
              { id: 'sn-w', type: 'value', label: '横向模数', value: '1500mm', unit: 'mm', reliability: 0.92, source: 'direct_observation' },
              { id: 'sn-h', type: 'value', label: '竖向模数（层高）', value: '4200mm', unit: 'mm', reliability: 0.87, source: 'rule_inference' },
            ],
          },
          {
            id: 'sn-material', type: 'material', label: '材料体系', value: 'Low-E 中空玻璃 + 铝框',
            reliability: 0.91, source: 'direct_observation',
            children: [
              { id: 'sn-glass', type: 'value', label: '玻璃类型', value: 'Low-E 双层中空', reliability: 0.94, source: 'direct_observation' },
              { id: 'sn-frame', type: 'value', label: '骨架处理', value: '香槟金阳极氧化', reliability: 0.85, source: 'direct_observation' },
              { id: 'sn-joint', type: 'value', label: '竖向缝宽', value: '20mm', unit: 'mm', reliability: 0.78, source: 'direct_observation' },
            ],
          },
          {
            id: 'sn-perf', type: 'performance', label: '热工性能', value: 'K≈1.9 / SC≈0.35',
            reliability: 0.78, source: 'rule_inference',
            children: [
              { id: 'sn-k', type: 'value', label: '传热系数 K', value: '1.9', unit: 'W/(m²·K)', reliability: 0.88, source: 'rule_inference' },
              { id: 'sn-sc', type: 'value', label: '遮阳系数 SC', value: '0.35', reliability: 0.68, source: 'ai_completion' },
              { id: 'sn-wwr', type: 'value', label: '外窗墙比', value: '0.78', reliability: 0.89, source: 'direct_observation' },
            ],
          },
        ],
      },
    ],
  },

  reviewItems: [
    {
      id: 'rv-01-01',
      parameterLabel: '裙楼高度',
      currentValue: '约 21m（5层）',
      issue: '立面底部 5 层材质存在细微差异，可能为裙楼与标准层分界，但视觉证据不充分。',
      suggestion: '建议对照规划总图或施工图确认裙楼分界层数及高度。',
      priority: 'medium',
      relatedEvidenceIds: ['e01-10'],
    },
    {
      id: 'rv-01-02',
      parameterLabel: '可开启扇比例',
      currentValue: '约 8%',
      issue: 'AI 补全值低于规范强制要求 10%，存在合规风险。',
      suggestion: '核查实际幕墙开启扇设置，确认是否满足《公共建筑节能设计标准》通风要求。',
      priority: 'high',
      relatedEvidenceIds: ['e01-09'],
    },
    {
      id: 'rv-01-03',
      parameterLabel: '遮阳系数 SC',
      currentValue: '0.35（AI补全）',
      issue: 'SC 为 AI 推算值，不同内置百叶开合状态下实测值可能差异显著。',
      suggestion: '建议取得幕墙厂家性能测试报告中 SC 的实测值作为最终参数。',
      priority: 'medium',
      relatedEvidenceIds: ['e01-07', 'e01-01'],
    },
  ],
}
