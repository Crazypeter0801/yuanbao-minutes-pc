import type { ReactNode } from 'react';
import IconTabChatOff from '@/assets/d2c/icons/sidetabs/icon-tab-chat-off';
import IconTabChatOn from '@/assets/d2c/icons/sidetabs/icon-tab-chat-on';
import IconTabMembersOff from '@/assets/d2c/icons/sidetabs/icon-tab-members-off';
import IconTabMembersOn from '@/assets/d2c/icons/sidetabs/icon-tab-members-on';
import IconTabYuanbaoLogo from '@/assets/d2c/icons/sidetabs/icon-tab-yuanbao-logo';
import IconTabYuanbaoOff from '@/assets/d2c/icons/sidetabs/icon-tab-yuanbao-off';

/** 侧栏里能开的三个应用 */
export type SideAppId = 'yuanbao' | 'chat' | 'members';

/** 页签固定顺序：元宝 → 成员 → 聊天 */
export const SIDE_APP_ORDER: SideAppId[] = ['yuanbao', 'members', 'chat'];

export interface SideAppMeta {
  /** 完整名称（单开标题栏、独立窗口、读屏） */
  title: string;
  /** macOS Safari 风格标签页里的精简标题 */
  tabLabel: string;
  /** 单开标题栏里的 24 图标 */
  icon: ReactNode;
  /** Safari 标签页激活态的 15 图标 */
  tabIcon: ReactNode;
  /** Safari 标签页未选中态的 15 灰图标 */
  tabIconOff: ReactNode;
  /** 标题后带一个灰色小箭头（元宝） */
  chevron?: boolean;
}

export const SIDE_APPS: Record<SideAppId, SideAppMeta> = {
  yuanbao: {
    title: '元宝',
    tabLabel: '元宝',
    icon: <IconTabYuanbaoLogo />,
    tabIcon: <IconTabYuanbaoLogo width={15} height={15} />,
    tabIconOff: <IconTabYuanbaoOff width={14} height={14} />,
    chevron: true,
  },
  members: {
    title: '管理成员',
    tabLabel: '成员',
    icon: <IconTabMembersOn />,
    tabIcon: <IconTabMembersOn width={15} height={15} />,
    tabIconOff: <IconTabMembersOff width={15} height={15} />,
  },
  chat: {
    title: '聊天',
    tabLabel: '聊天',
    icon: <IconTabChatOn />,
    tabIcon: <IconTabChatOn width={15} height={15} />,
    tabIconOff: <IconTabChatOff width={15} height={15} />,
  },
};
