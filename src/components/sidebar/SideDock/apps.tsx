import type { ReactNode } from 'react';
import IconTabChatOff from '@/assets/d2c/icons/sidetabs/icon-tab-chat-off';
import IconTabChatOn from '@/assets/d2c/icons/sidetabs/icon-tab-chat-on';
import IconTabMembersOff from '@/assets/d2c/icons/sidetabs/icon-tab-members-off';
import IconTabMembersOn from '@/assets/d2c/icons/sidetabs/icon-tab-members-on';
import IconTabYuanbaoLogo from '@/assets/d2c/icons/sidetabs/icon-tab-yuanbao-logo';
import IconTabYuanbaoOff from '@/assets/d2c/icons/sidetabs/icon-tab-yuanbao-off';
import IconTab505ChatOff from '@/assets/d2c/icons/sidetabs505/icon-tab505-chat-off';
import IconTab505MembersOff from '@/assets/d2c/icons/sidetabs505/icon-tab505-members-off';
import IconTab505Yuanbao from '@/assets/d2c/icons/sidetabs505/icon-tab505-yuanbao';
import IconTab585YuanbaoOff from '@/assets/d2c/icons/sidetabs585/icon-tab585-yuanbao-off';

/** 侧栏里能开的三个应用 */
export type SideAppId = 'yuanbao' | 'chat' | 'members';

/** 侧栏多页签视觉方案：Figma 505:12421 新版顶部胶囊（默认） / Figma 585:68637 分段文件夹标签页 */
export type SideTabStyle = 'pill505' | 'classic';

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
  /** Figma 505:12421 激活态 24 图标 */
  icon505On: ReactNode;
  /** Figma 505:12421 未选中态 24 灰图标 */
  icon505Off: ReactNode;
  /** Figma 585:68637 激活态 20 图标 */
  icon585On: ReactNode;
  /** Figma 585:68637 未选中态 20 深灰图标 */
  icon585Off: ReactNode;
  /** 标题后带一个灰色小箭头（元宝，Figma 541:13600） */
  chevron?: boolean;
}

export const SIDE_APPS: Record<SideAppId, SideAppMeta> = {
  yuanbao: {
    title: '元宝',
    tabLabel: '元宝',
    icon: <IconTabYuanbaoLogo />,
    iconOff: <IconTabYuanbaoOff />,
    icon505On: <IconTab505Yuanbao width={24} height={24} />,
    icon505Off: <IconTabYuanbaoOff width={20} height={20} />,
    icon585On: <IconTab505Yuanbao width={20} height={20} />,
    icon585Off: <IconTab585YuanbaoOff width={18} height={18} />,
    chevron: true,
  },
  members: {
    title: '管理成员',
    tabLabel: '管理成员',
    icon: <IconTabMembersOn />,
    iconOff: <IconTabMembersOff />,
    icon505On: <IconTabMembersOn width={24} height={24} />,
    icon505Off: <IconTab505MembersOff width={24} height={24} />,
    icon585On: <IconTabMembersOn width={20} height={20} />,
    icon585Off: <IconTabMembersOn width={20} height={20} />,
  },
  chat: {
    title: '聊天',
    tabLabel: '聊天',
    icon: <IconTabChatOn />,
    iconOff: <IconTabChatOff />,
    icon505On: <IconTabChatOn width={24} height={24} />,
    icon505Off: <IconTab505ChatOff width={24} height={24} />,
    icon585On: <IconTabChatOn width={20} height={20} />,
    icon585Off: <IconTabChatOn width={20} height={20} />,
  },
};
