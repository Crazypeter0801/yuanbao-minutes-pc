import { useState } from 'react';
import IconSideLogo from '@/assets/icons/icon-side-logo';
import { Pressable } from '@/components/common/Pressable';
import { MeetingWindow } from '@/components/meeting/MeetingWindow';
import { YuanbaoSidebar } from '@/components/YuanbaoSidebar';
import styles from './App.module.css';

/**
 * 腾讯会议 PC · 方案 A v1
 * 会议窗口（998，静态）+ 元宝侧栏（400，可交互）= 1398×674，对应 Figma 245:5577。
 * 在 Figma 中建议把 code layer 的尺寸设为 1398×674，画面正好铺满。
 */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.stage}>
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
    </div>
  );
}
