/**
 * Agent 状态页 · 设置数据
 * 文案取自 Figma 243:1185。每行带设置图标。
 */

export type AgentSettingIcon = 'apps' | 'personal' | 'auto' | 'language';

export interface AgentSettingItem {
  id: string;
  label: string;
  value: string;
  icon: AgentSettingIcon;
}

/** 「Agent 设置」（Figma 243:1185） */
export const AGENT_STATUS_SETTINGS: AgentSettingItem[] = [
  { id: 'setting-apps', label: '连接的应用', value: '3 个已连接', icon: 'apps' },
  { id: 'setting-personal', label: '个性化', value: '标准', icon: 'personal' },
  { id: 'setting-auto', label: '自动任务', value: '2', icon: 'auto' },
  { id: 'setting-language', label: '语言', value: '简体中文', icon: 'language' },
];
