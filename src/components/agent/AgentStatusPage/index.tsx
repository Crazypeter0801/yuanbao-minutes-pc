import { useState, type FC } from 'react';
import IconStatusAvatar from '@/assets/d2c/icons/agent-status/icon-status-avatar';
import IconStatusBack from '@/assets/d2c/icons/agent-status/icon-status-back';
import IconStatusClose from '@/assets/d2c/icons/agent-status/icon-status-close';
import IconStatusPip from '@/assets/d2c/icons/agent-status/icon-status-pip';
import { Pressable } from '@/components/common/Pressable';
import {
  AGENT_LIBRARY_FILTERS,
  AGENT_STATUS_LIBRARY,
  type AgentLibraryFilter,
  type AgentLibraryItem,
} from '@/data/agentStatusLibrary';
import { AGENT_STATUS_SETTINGS, type AgentSettingItem } from '@/data/agentStatusSettings';
import { AGENT_STATUS_TASKS, type AgentStatusTask } from '@/data/agentStatusTasks';
import type { AgentDockControl } from '@/hooks/useAgentDock';
import { LibrarySection } from './LibrarySection';
import { SettingsSection } from './SettingsSection';
import { TaskSection } from './TaskSection';
import styles from './index.module.scss';

export type AgentStatusTab = 'overview' | 'library';

interface AgentStatusPageProps {
  /** 沿用现有吸附 / 分离能力：状态页顶部栏也可以拖动 */
  dock: AgentDockControl;
  /** 打开时默认停留在哪个 Tab：任务胶囊进概览，文件夹进资料库 */
  initialTab?: AgentStatusTab;
  /** 返回聊天 */
  onBack: () => void;
  /** 关闭元宝侧栏 */
  onClose: () => void;
  /** 打开设置项（演示） */
  onOpenSetting: (setting: AgentSettingItem) => void;
  /** 打开资料（演示） */
  onOpenLibraryItem: (item: AgentLibraryItem) => void;
}

/**
 * 元宝 Agent 状态页（Figma 243:1054 / 243:1222，Tab 节点 258:24665）
 * 在同一个元宝窗口内覆盖对话区：
 * - 顶部栏：返回 / 独立窗口 / 关闭；
 * - 头部：元宝形象 + 名称 + 陪伴文案；
 * - 胶囊 Tab 切换「概览 / 资料库」。概览含任务与 Agent 设置，资料库含五个筛选标签。
 */
export const AgentStatusPage: FC<AgentStatusPageProps> = ({
  dock,
  initialTab = 'overview',
  onBack,
  onClose,
  onOpenSetting,
  onOpenLibraryItem,
}) => {
  const [tab, setTab] = useState<AgentStatusTab>(initialTab);
  const [libraryFilter, setLibraryFilter] = useState<AgentLibraryFilter>('all');
  const [tasks, setTasks] = useState<AgentStatusTask[]>(AGENT_STATUS_TASKS);
  const floating = dock.mode === 'floating';

  /** 停止后从进行中移到已完成（已完成只显示标题） */
  const stopTask = (id: string) =>
    setTasks((previous) =>
      previous.map((task) => (task.id === id ? { ...task, state: 'done' } : task)),
    );

  return (
    <div className={styles.page}>
      <header
        className={styles.topBar}
        onPointerDown={dock.onTitlePointerDown}
        title="按住拖动，可把元宝从会议窗口分离出来"
      >
        <div className={styles.topLeft} data-nodrag>
          <Pressable
            className={styles.iconButton}
            onClick={onBack}
            title="返回聊天"
            ariaLabel="返回聊天"
          >
            <IconStatusBack />
          </Pressable>
        </div>

        <div className={styles.topActions} data-nodrag>
          <Pressable
            className={styles.iconButton}
            onClick={dock.toggleDock}
            title={floating ? '吸附回会议' : '独立窗口打开'}
            ariaLabel={floating ? '吸附回会议' : '独立窗口打开'}
          >
            {floating ? (
              /* 与对话页标题栏一致：分离状态下显示「吸附」图标 */
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <path d="M10 3v10" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            ) : (
              <IconStatusPip />
            )}
          </Pressable>
          <Pressable
            className={styles.iconButton}
            onClick={onClose}
            title="关闭元宝"
            ariaLabel="关闭元宝"
          >
            <IconStatusClose />
          </Pressable>
        </div>
      </header>

      <div className={styles.hero}>
        <span className={styles.heroAvatar} aria-hidden="true">
          <IconStatusAvatar width={48} height={52} />
        </span>
        <div className={styles.heroText}>
          <h1 className={styles.name}>元宝</h1>
          <p className={styles.subtitle}>元宝已陪伴您365天 ~</p>
        </div>
      </div>

      <div className={styles.tabBar}>
        <div className={styles.tabs} role="tablist" aria-label="Agent 状态页视图">
          <Pressable
            className={`${styles.tab} ${tab === 'overview' ? styles.tabActive : ''}`}
            onClick={() => setTab('overview')}
            ariaLabel="概览"
            ariaExpanded={tab === 'overview'}
          >
            概览
          </Pressable>
          <Pressable
            className={`${styles.tab} ${tab === 'library' ? styles.tabActive : ''}`}
            onClick={() => setTab('library')}
            ariaLabel="资料库"
            ariaExpanded={tab === 'library'}
          >
            资料库
          </Pressable>
        </div>
      </div>

      <div className={`${styles.scroll} wm-scroll-hidden`}>
        <div className={styles.content}>
          {tab === 'overview' ? (
            <>
              <TaskSection tasks={tasks} onStop={stopTask} />
              <SettingsSection settings={AGENT_STATUS_SETTINGS} onOpenSetting={onOpenSetting} />
            </>
          ) : (
            <LibrarySection
              items={AGENT_STATUS_LIBRARY}
              filters={AGENT_LIBRARY_FILTERS}
              activeFilter={libraryFilter}
              onFilterChange={setLibraryFilter}
              onOpenItem={onOpenLibraryItem}
            />
          )}
        </div>
      </div>
    </div>
  );
};
