import { useState } from 'react';
import { MeetingWindow } from '@/components/meeting/MeetingWindow';
import { YuanbaoSidebar } from '@/components/YuanbaoSidebar';
import styles from './App.module.scss';

/**
 * V1 · 腾讯会议 PC + 元宝 Agent 对话区（Figma 257:1540）
 * 窗口 1440×760：左侧会议区为静态还原，右侧元宝对话区可交互。
 * 侧栏右上角 × 关闭后，通过底部工具栏胶囊里的「元宝」按钮重新打开（不再另设悬浮入口）。
 * 壁纸固定铺满视口，窗口居中。
 */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <main className={styles.stage}>
        <div className={styles.window}>
          <MeetingWindow yuanbaoOpen={sidebarOpen} onToggleYuanbao={() => setSidebarOpen((open) => !open)} />
          {sidebarOpen && <YuanbaoSidebar onClose={() => setSidebarOpen(false)} />}
        </div>
      </main>
    </div>
  );
}
