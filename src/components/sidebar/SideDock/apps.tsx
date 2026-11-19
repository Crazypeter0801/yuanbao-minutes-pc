import type { ReactNode } from 'react';
import IconTab505Yuanbao from '@/assets/d2c/icons/sidetabs505/icon-tab505-yuanbao';
import IconTab574Chat from '@/assets/d2c/icons/sidetabs574/icon-tab574-chat';
import IconTab574Members from '@/assets/d2c/icons/sidetabs574/icon-tab574-members';
import IconTab574Yuanbao from '@/assets/d2c/icons/sidetabs574/icon-tab574-yuanbao';

/** 侧栏里能开的三个应用 */
export type SideAppId = 'yuanbao' | 'chat' | 'members';

/** 侧栏多页签视觉方案：Figma 585:68637 Chrome页签（默认） / Figma 505:12421 Safari胶囊 */
export type SideTabStyle = 'classic' | 'pill505';

/** 页签固定顺序：元宝 → 管理成员 → 聊天 */
export const SIDE_APP_ORDER: SideAppId[] = ['yuanbao', 'members', 'chat'];

export interface SideAppMeta {
  /** 完整名称（单开标题栏、激活页签、独立窗口、读屏） */
  title: string;
  /** 简洁标签名 */
  tabLabel: string;
  /** 单开标题栏里的 24 图标 */
  icon: ReactNode;
  /** 未选中 24 灰图标 */
  iconOff: ReactNode;
  /** Figma 505:12421 Safari胶囊 激活态 24 图标 */
  icon505On: ReactNode;
  /** Figma 505:12421 Safari胶囊 未选中态图标（对齐 574:20877 三图标形态） */
  icon505Off: ReactNode;
  /** Figma 585:68637 / 582:62255 / 574:20877 Chrome页签与单侧栏激活态 20 图标 */
  icon585On: ReactNode;
  /** Figma 585:68637 / 574:20877 Chrome页签未选中态图标（统一 #4E5461） */
  icon585Off: ReactNode;
  /** 标题后带一个灰色小箭头（元宝，Figma 541:13600） */
  chevron?: boolean;
}

export const SIDE_APPS: Record<SideAppId, SideAppMeta> = {
  yuanbao: {
    title: '元宝',
    tabLabel: '元宝',
    icon: <IconTab505Yuanbao width={24} height={24} />,
    iconOff: <IconTab574Yuanbao width={16} height={16} color="#7B818F" />,
    icon505On: <IconTab505Yuanbao width={24} height={24} />,
    icon505Off: <IconTab574Yuanbao width={18} height={18} color="#7B818F" />,
    icon585On: <IconTab505Yuanbao width={20} height={20} />,
    icon585Off: <IconTab574Yuanbao width={16} height={16} />,
    chevron: true,
  },
  members: {
    title: '管理成员',
    tabLabel: '管理成员',
    icon: <IconTab574Members width={22} height={22} />,
    iconOff: <IconTab574Members width={22} height={22} color="#7B818F" />,
    icon505On: <IconTab574Members width={22} height={22} />,
    icon505Off: <IconTab574Members width={22} height={22} color="#7B818F" />,
    icon585On: <IconTab574Members width={20} height={20} />,
    icon585Off: <IconTab574Members width={20} height={20} />,
  },
  chat: {
    title: '聊天',
    tabLabel: '聊天',
    icon: <IconTab574Chat width={22} height={22} />,
    iconOff: <IconTab574Chat width={22} height={22} color="#7B818F" />,
    icon505On: <IconTab574Chat width={22} height={22} />,
    icon505Off: <IconTab574Chat width={22} height={22} color="#7B818F" />,
    icon585On: <IconTab574Chat width={20} height={20} />,
    icon585Off: <IconTab574Chat width={20} height={20} />,
  },
};
