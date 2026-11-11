/**
 * Agent 状态页 · 设置数据
 * 文案取自 Figma 243:1185（方案一）与 243:1511（方案二）。
 * 方案一每行带设置图标；方案二按设计稿只保留文字与右侧值。
 */

export type AgentSettingIcon = 'apps' | 'personal' | 'auto' | 'language';

export interface AgentSettingItem {
  id: string;
  label: string;
  value: string;
  /** 方案一使用的设置图标；方案二不使用 */
  icon?: AgentSettingIcon;
}

/** 方案一「Agent 设置」（Figma 243:1185） */
export const AGENT_STATUS_SETTINGS: AgentSettingItem[] = [
  { id: 'setting-apps', label: '连接的应用', value: '3 个已连接', icon: 'apps' },
  { id: 'setting-personal', label: '个性化', value: '标准', icon: 'personal' },
  { id: 'setting-auto', label: '自动任务', value: '2', icon: 'auto' },
  { id: 'setting-language', label: '语言', value: '简体中文', icon: 'language' },
];

/** 方案二「Agent 设置」（Figma 243:1511） */
export const AGENT_FLOW_SETTINGS: AgentSettingItem[] = [
  { id: 'flow-setting-apps', label: '连接的应用', value: '3 个已连接' },
  { id: 'flow-setting-reminder', label: '主动提醒', value: '适中' },
  { id: 'flow-setting-font', label: '字号和字体', value: '标准' },
  { id: 'flow-setting-language', label: '语言', value: '简体中文' },
];
