import type { ReactNode } from 'react';
import iconTabChat811 from '@/assets/d2c/frame811/icon-tab-chat.svg';
import iconTabMembers811 from '@/assets/d2c/frame811/icon-tab-members.svg';
import iconTabYuanbao811 from '@/assets/d2c/frame811/icon-tab-yuanbao.svg';

/** 侧栏里能开的三个应用 */
export type SideAppId = 'yuanbao' | 'chat' | 'members';

/** 页签固定顺序（Figma 811:25081）：元宝 → 聊天 → 成员 */
export const SIDE_APP_ORDER: SideAppId[] = ['yuanbao', 'chat', 'members'];

export interface SideAppMeta {
  /** 完整名称（单开标题栏、独立窗口、读屏） */
  title: string;
  /** 顶栏页签短名称（Figma 811:25081：元宝 / 聊天 / 成员） */
  tabLabel: string;
  /** 单开标题栏里的 20 图标 */
  icon: ReactNode;
  /** 811:25081 顶栏激活态与独立浮窗图标 */
  icon585On: ReactNode;
  /** 811:25081 顶栏未选中态图标 */
  icon585Off: ReactNode;
}

export const SIDE_APPS: Record<SideAppId, SideAppMeta> = {
  yuanbao: {
    title: '元宝',
    tabLabel: '元宝',
    icon: <img src={iconTabYuanbao811} alt="" width={16} height={16} draggable={false} />,
    icon585On: <img src={iconTabYuanbao811} alt="" width={16} height={16} draggable={false} />,
    icon585Off: <img src={iconTabYuanbao811} alt="" width={16} height={16} draggable={false} />,
  },
  chat: {
    title: '聊天',
    tabLabel: '聊天',
    icon: <img src={iconTabChat811} alt="" width={20} height={20} draggable={false} />,
    icon585On: <img src={iconTabChat811} alt="" width={20} height={20} draggable={false} />,
    icon585Off: <img src={iconTabChat811} alt="" width={20} height={20} draggable={false} />,
  },
  members: {
    title: '管理成员',
    tabLabel: '成员',
    icon: <img src={iconTabMembers811} alt="" width={20} height={20} draggable={false} />,
    icon585On: <img src={iconTabMembers811} alt="" width={20} height={20} draggable={false} />,
    icon585Off: <img src={iconTabMembers811} alt="" width={20} height={20} draggable={false} />,
  },
};
