/**
 * Agent 状态页 · 资料库数据
 * 文案取自 Figma 243:1222（方案一 · 资料库）与 243:1376（方案二 · 资料库）。
 * filter 是筛选标签真正使用的分类，fileKind 决定列表左侧的文件图标。
 */

/** 资料筛选：全部 / 笔记 / 文件 / 媒体 / 链接 */
export type AgentLibraryFilter = 'all' | 'note' | 'file' | 'media' | 'link';

/** 文件图标类型，对应 Figma 252:1315 文件图标组件集 */
export type AgentFileKind =
  | 'note'
  | 'pptx'
  | 'pdf'
  | 'xlsx'
  | 'docx'
  | 'txt'
  | 'ocr'
  | 'translate'
  | 'link'
  | 'media';

export interface AgentLibraryItem {
  id: string;
  title: string;
  /** 方案一显示在右侧，方案二显示在标题下方 */
  meta?: string;
  filter: Exclude<AgentLibraryFilter, 'all'>;
  fileKind: AgentFileKind;
  /** 方案一按「本场会议 / 更早」分组；方案二不使用 */
  group: 'current' | 'earlier';
  /** 方案二右侧的页数 / 字数等信息 */
  trailing?: string;
}

/** 方案一筛选标签顺序（Figma 243:1295） */
export const AGENT_LIBRARY_FILTERS: { key: AgentLibraryFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'note', label: '笔记' },
  { key: 'file', label: '文件' },
  { key: 'media', label: '媒体' },
  { key: 'link', label: '链接' },
];

/** 方案二筛选标签顺序（Figma 243:1472） */
export const AGENT_FLOW_LIBRARY_FILTERS: { key: AgentLibraryFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'media', label: '媒体' },
  { key: 'file', label: '文件' },
];

/** 方案一「资料库」Tab（Figma 243:1222） */
export const AGENT_STATUS_LIBRARY: AgentLibraryItem[] = [
  {
    id: 'lib-note',
    title: '元宝笔记',
    meta: '记录中 · 6 条',
    filter: 'note',
    fileKind: 'note',
    group: 'current',
  },
  {
    id: 'lib-whitelist-conclusion',
    title: '白名单评审结论',
    filter: 'file',
    fileKind: 'docx',
    group: 'current',
  },
  {
    id: 'lib-design-review',
    title: '设计评审.pptx',
    filter: 'file',
    fileKind: 'pptx',
    group: 'current',
  },
  {
    id: 'lib-scale-doc',
    title: '灰度放量说明',
    filter: 'file',
    fileKind: 'docx',
    group: 'current',
  },
  {
    id: 'lib-screenshot',
    title: '共享画面截图',
    meta: '来自截图',
    filter: 'media',
    fileKind: 'media',
    group: 'current',
  },
  {
    id: 'lib-whitelist-rule',
    title: '白名单规则文档',
    meta: '来自聊天',
    filter: 'link',
    fileKind: 'link',
    group: 'current',
  },
  {
    id: 'lib-whitelist-minutes',
    title: '白名单评审纪要',
    filter: 'file',
    fileKind: 'docx',
    group: 'earlier',
  },
  {
    id: 'lib-product-plan',
    title: '产品方案.pdf',
    filter: 'file',
    fileKind: 'pdf',
    group: 'earlier',
  },
  {
    id: 'lib-schedule',
    title: '需求排期.xlsx',
    filter: 'file',
    fileKind: 'xlsx',
    group: 'earlier',
  },
];

/** 方案二「资料库」（Figma 243:1376） */
export const AGENT_FLOW_LIBRARY: AgentLibraryItem[] = [
  {
    id: 'flow-lib-ppt',
    title: '设计评审.pptx',
    meta: '本场 · 共享文件',
    filter: 'file',
    fileKind: 'pptx',
    group: 'current',
    trailing: '18 页',
  },
  {
    id: 'flow-lib-ocr',
    title: 'PPT 第 12 页识别结果',
    meta: '本场 · 刚刚',
    filter: 'media',
    fileKind: 'ocr',
    group: 'current',
    trailing: '86 字',
  },
  {
    id: 'flow-lib-translate',
    title: '翻译记录（中→英）',
    meta: '本场 · 进行中',
    filter: 'media',
    fileKind: 'translate',
    group: 'current',
    trailing: '128 句',
  },
];
