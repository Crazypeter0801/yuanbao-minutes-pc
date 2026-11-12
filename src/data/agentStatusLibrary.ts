/**
 * Agent 状态页 · 资料库数据
 * 文案取自 Figma 241:1413（概览 Tab 旁的资料库）。
 * filter 是筛选标签真正使用的分类，fileKind 决定列表左侧的文件图标。
 */

/** 资料筛选：全部 / 笔记 / 文件 / 媒体 / 链接 */
export type AgentLibraryFilter = 'all' | 'note' | 'file' | 'media' | 'link';

/** 文件图标类型，对应 Figma 252:1315 文件图标组件集 */
export type AgentFileKind = 'note' | 'pptx' | 'pdf' | 'xlsx' | 'docx' | 'txt' | 'link' | 'media';

export interface AgentLibraryItem {
  id: string;
  title: string;
  /** 显示在行右侧的整合副标题 */
  meta?: string;
  filter: Exclude<AgentLibraryFilter, 'all'>;
  fileKind: AgentFileKind;
  /** 按「本场会议 / 更早」分组 */
  group: 'current' | 'earlier';
}

/** 筛选标签顺序（Figma 243:1295） */
export const AGENT_LIBRARY_FILTERS: { key: AgentLibraryFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'note', label: '笔记' },
  { key: 'file', label: '文件' },
  { key: 'media', label: '媒体' },
  { key: 'link', label: '链接' },
];

/** 「资料库」Tab（Figma 241:1413，文件行组件 252:1315） */
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
    meta: '10-28 · 已引用',
    filter: 'file',
    fileKind: 'docx',
    group: 'current',
  },
  {
    id: 'lib-design-review',
    title: '设计评审.pptx',
    meta: '共享中 · 18 页',
    filter: 'file',
    fileKind: 'pptx',
    group: 'current',
  },
  {
    id: 'lib-scale-doc',
    title: '灰度放量说明',
    meta: '刚刚 · 术语解释',
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
    meta: '10-28 · 评审会',
    filter: 'file',
    fileKind: 'docx',
    group: 'earlier',
  },
  {
    id: 'lib-product-plan',
    title: '产品方案.pdf',
    meta: '周一 · 评审会',
    filter: 'file',
    fileKind: 'pdf',
    group: 'earlier',
  },
  {
    id: 'lib-schedule',
    title: '需求排期.xlsx',
    meta: '上周 · 周会',
    filter: 'file',
    fileKind: 'xlsx',
    group: 'earlier',
  },
];
