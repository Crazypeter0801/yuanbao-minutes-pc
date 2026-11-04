import { useState } from 'react';
import { ScenarioTriggers } from '@/components/demo/ScenarioTriggers';
import { MeetingWindow } from '@/components/meeting/MeetingWindow';
import { YuanbaoSidebar } from '@/components/YuanbaoSidebar';
import { initialArtifacts } from '@/data/artifacts';
import { proactiveScenarios } from '@/data/proactiveScenarios';
import { useYuanbaoSession } from '@/hooks/useYuanbaoSession';
import styles from './App.module.scss';

/**
 * V1 · 腾讯会议 PC + 元宝 Agent 对话区（Figma 257:1540）
 * 窗口 1440×760：左侧会议区为静态还原，右侧元宝对话区可交互。
 * 侧栏右上角 × 关闭后，通过底部工具栏胶囊里的「元宝」按钮重新打开（不再另设悬浮入口）。
 * 壁纸固定铺满视口，窗口居中。
 *
 * 元宝的对话状态提到这一层：演示用的场景切换条浮在窗口之外，
 * 要和侧栏共用同一份消息数据，按钮点了才真的能推动对话。
 */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chat = useYuanbaoSession();

  return (
    <div className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <main className={styles.stage}>
        <div className={styles.frame}>
          {/* 演示用场景切换：浮在窗口上方的壁纸上，不属于窗口内部 */}
          <div className={styles.scenarioBar}>
            <ScenarioTriggers
              scenarios={proactiveScenarios}
              onTrigger={(scenario) => {
                if (scenario.kind === 'ask') {
                  chat.ask(scenario.userText);
                } else {
                  chat.push(scenario.build());
                }
              }}
            />
          </div>

          <div className={styles.window}>
            <MeetingWindow yuanbaoOpen={sidebarOpen} onToggleYuanbao={() => setSidebarOpen((open) => !open)} />
            {sidebarOpen && (
              <YuanbaoSidebar chat={chat} artifacts={initialArtifacts} onClose={() => setSidebarOpen(false)} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
