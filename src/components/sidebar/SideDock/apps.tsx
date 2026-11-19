import type { ReactNode } from 'react';
import IconTabChatOff from '@/assets/d2c/icons/sidetabs/icon-tab-chat-off';
import IconTabChatOn from '@/assets/d2c/icons/sidetabs/icon-tab-chat-on';
import IconTabMembersOff from '@/assets/d2c/icons/sidetabs/icon-tab-members-off';
import IconTabMembersOn from '@/assets/d2c/icons/sidetabs/icon-tab-members-on';
import IconTabYuanbaoLogo from '@/assets/d2c/icons/sidetabs/icon-tab-yuanbao-logo';
import IconTabYuanbaoOff from '@/assets/d2c/icons/sidetabs/icon-tab-yuanbao-off';

/** 侧栏里能开的三个应用 */
export type SideAppId = 'yuanbao' | 'chat' | 'members';

/** 页签固定顺序（Figma 505:12264 三张稿一致）：元宝 → 管理成员 → 聊天 */
export const SIDE_APP_ORDER: SideAppId[] = ['yuanbao', 'members', 'chat'];

export interface SideAppMeta {
  title: string;
  /** 当前页签 / 单开标题栏里的 24 图标（深色 #373C48 或元宝彩色标） */
  icon: ReactNode;
  /** 未选中页签里的灰色图标（#7B818F），元宝是 20、成员 / 聊天是 24，都在 40 的格子里居中 */
  iconOff: ReactNode;
  /** 标题后带一个灰色小箭头（只有元宝，Figma 541:13598） */
  chevron?: boolean;
}

export const SIDE_APPS: Record<SideAppId, SideAppMeta> = {
  yuanbao: { title: '元宝', icon: <IconTabYuanbaoLogo />, iconOff: <IconTabYuanbaoOff />, chevron: true },
  members: { title: '管理成员', icon: <IconTabMembersOn />, iconOff: <IconTabMembersOff /> },
  chat: { title: '聊天', icon: <IconTabChatOn />, iconOff: <IconTabChatOff /> },
};
