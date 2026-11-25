import type { ReactNode } from 'react';
import IconTab574Chat from '@/assets/d2c/icons/sidetabs574/icon-tab574-chat';
import IconTab574Members from '@/assets/d2c/icons/sidetabs574/icon-tab574-members';
import IconTab574Yuanbao from '@/assets/d2c/icons/sidetabs574/icon-tab574-yuanbao';
import IconYuanbao811 from '@/assets/d2c/icons/yuanbao811/icon-yuanbao-811';

/** 侧栏里能开的三个应用 */
export type SideAppId = 'yuanbao' | 'chat' | 'members';

/** 页签固定顺序：元宝 → 管理成员 → 聊天 */
export const SIDE_APP_ORDER: SideAppId[] = ['yuanbao', 'members', 'chat'];

export interface SideAppMeta {
  /** 完整名称（单开标题栏、激活页签、独立窗口、读屏） */
  title: string;
  /** 简洁标签名 */
  tabLabel: string;
  /** 单开标题栏里的 20 图标 */
  icon: ReactNode;
  /** 未选中 20 灰图标 */
  iconOff: ReactNode;
  /** Chrome 页签与独立浮窗激活态 20 图标（元宝采用 Figma 811:38167 标准形象） */
  icon585On: ReactNode;
  /** Chrome 页签未选中态图标（统一 #4E5461） */
  icon585Off: ReactNode;
  /** 标题后带一个灰色小箭头（元宝，Figma 574:16890） */
  chevron?: boolean;
}

export const SIDE_APPS: Record<SideAppId, SideAppMeta> = {
  yuanbao: {
    title: '元宝',
    tabLabel: '元宝',
    icon: <IconYuanbao811 width={20} height={20} />,
    iconOff: <IconTab574Yuanbao width={16} height={16} color="#7B818F" />,
    icon585On: <IconYuanbao811 width={20} height={20} />,
    icon585Off: <IconTab574Yuanbao width={16} height={16} />,
    chevron: true,
  },
  members: {
    title: '管理成员',
    tabLabel: '管理成员',
    icon: <IconTab574Members width={20} height={20} />,
    iconOff: <IconTab574Members width={20} height={20} color="#7B818F" />,
    icon585On: <IconTab574Members width={20} height={20} />,
    icon585Off: <IconTab574Members width={20} height={20} />,
  },
  chat: {
    title: '聊天',
    tabLabel: '聊天',
    icon: <IconTab574Chat width={20} height={20} />,
    iconOff: <IconTab574Chat width={20} height={20} color="#7B818F" />,
    icon585On: <IconTab574Chat width={20} height={20} />,
    icon585Off: <IconTab574Chat width={20} height={20} />,
  },
};
