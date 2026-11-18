import type { ReactNode } from 'react';
import IconSide3Logo from '@/assets/d2c/icons/v2/icon-side3-logo';
import chatIcon from '@/assets/ref/dawen/sidebar-chat.svg';
import membersIcon from '@/assets/ref/dawen/sidebar-members.svg';
import styles from './index.module.scss';

/** 侧栏里能开的三个应用 */
export type SideAppId = 'yuanbao' | 'chat' | 'members';

export interface SideAppMeta {
  title: string;
  /** 24×24 的应用图标：单独打开时放在标题栏，并开时放在页签上 */
  icon: ReactNode;
}

export const SIDE_APPS: Record<SideAppId, SideAppMeta> = {
  yuanbao: { title: '元宝', icon: <IconSide3Logo /> },
  chat: {
    title: '聊天',
    icon: <img className={styles.appIcon} src={chatIcon} alt="" draggable={false} />,
  },
  members: {
    title: '管理成员',
    // 参考 Demo 里成员图标做了水平镜像，人物朝向内容
    icon: <img className={`${styles.appIcon} ${styles.appIconMirror}`} src={membersIcon} alt="" draggable={false} />,
  },
};
