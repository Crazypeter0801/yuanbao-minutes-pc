import { useState } from 'react';
import IconSideLogo from '@/assets/d2c/icons/v1/icon-side-logo';
import { Pressable } from '@/components/common/Pressable';
import { MeetingWindow } from '@/components/meeting/MeetingWindow';
import { YuanbaoSidebar } from '@/components/YuanbaoSidebar';
import styles from './App.module.scss';

/**
 * V1 · 腾讯会议 PC + 元宝 Agent 对话区（Figma 257:1540）
 * 窗口 1440×720：左侧会议区为静态还原，右侧元宝对话区可交互。
 * 壁纸固定铺满视口，窗口居中。
 */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <main className={styles.stage}>
        <div className={styles.window}>
          <MeetingWindow />
          {sidebarOpen ? (
            <YuanbaoSidebar onClose={() => setSidebarOpen(false)} />
          ) : (
            <Pressable
              className={styles.reopen}
              onClick={() => setSidebarOpen(true)}
              ariaLabel="打开元宝"
              title="打开元宝"
            >
              <IconSideLogo />
              <span className={styles.reopenText}>元宝</span>
            </Pressable>
          )}
        </div>
      </main>
    </div>
  );
}
