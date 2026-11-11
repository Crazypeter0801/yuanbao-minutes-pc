import { useEffect, useState, type FC } from 'react';
import IconStatusAvatar from '@/assets/d2c/icons/agent-status/icon-status-avatar';
import IconStatusBack from '@/assets/d2c/icons/agent-status/icon-status-back';
import IconStatusClose from '@/assets/d2c/icons/agent-status/icon-status-close';
import IconStatusPip from '@/assets/d2c/icons/agent-status/icon-status-pip';
import { Pressable } from '@/components/common/Pressable';
import {
  AGENT_FLOW_LIBRARY,
  AGENT_FLOW_LIBRARY_FILTERS,
  AGENT_LIBRARY_FILTERS,
  AGENT_STATUS_LIBRARY,
  type AgentLibraryFilter,
  type AgentLibraryItem,
} from '@/data/agentStatusLibrary';
import {
  AGENT_FLOW_SETTINGS,
  AGENT_STATUS_SETTINGS,
  type AgentSettingItem,
} from '@/data/agentStatusSettings';
import { AGENT_FLOW_TASKS, AGENT_STATUS_TASKS, type AgentStatusTask } from '@/data/agentStatusTasks';
import type { AgentDockControl } from '@/hooks/useAgentDock';
import { LibrarySection } from './LibrarySection';
import { SettingsSection } from './SettingsSection';
import { TaskSection } from './TaskSection';
import styles from './index.module.scss';

/** 方案一：Tab 切换 · 动态；方案二：自上而下 */
export type AgentStatusScheme = 'tabs' | 'flow';

type StatusTab = 'feed' | 'library';

interface AgentStatusPageProps {
  scheme: AgentStatusScheme;
  /** 沿用现有吸附 / 分离能力：状态页顶部栏也可以拖动 */
  dock: AgentDockControl;
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
 * 元宝 Agent 状态页（Figma 243:1054 / 243:1222 / 243:1376）
 * 在同一个元宝窗口内覆盖对话区：
 * - 顶部栏：返回 / 独立窗口 / 关闭；
 * - 头部：元宝形象 + 名称 + 状态；
 * - 方案一：胶囊 Tab 切换「动态 / 资料库」，动态含任务与 Agent 设置，资料库含五个筛选标签；
 * - 方案二：任务 → 资料库 → Agent 设置依次向下排，内容超过窗口高度时滚动。
 */
export const AgentStatusPage: FC<AgentStatusPageProps> = ({
  scheme,
  dock,
  onBack,
  onClose,
  onOpenSetting,
  onOpenLibraryItem,
}) => {
  const [tab, setTab] = useState<StatusTab>('feed');
  const [libraryFilter, setLibraryFilter] = useState<AgentLibraryFilter>('all');
  const [flowLibraryFilter, setFlowLibraryFilter] = useState<AgentLibraryFilter>('all');
  const [tabTasks, setTabTasks] = useState<AgentStatusTask[]>(AGENT_STATUS_TASKS);
  const [flowTasks, setFlowTasks] = useState<AgentStatusTask[]>(AGENT_FLOW_TASKS);
  const floating = dock.mode === 'floating';

  // 从演示菜单切换方案时回到该方案的默认视图，避免把上一个方案的 Tab / 筛选状态带过去
  useEffect(() => {
    setTab('feed');
    setLibraryFilter('all');
    setFlowLibraryFilter('all');
  }, [scheme]);

  /** 方案一：停止后从进行中移到已完成（已完成只显示标题） */
  const stopTabTask = (id: string) =>
    setTabTasks((previous) =>
      previous.map((task) => (task.id === id ? { ...task, state: 'done' } : task)),
    );

  /** 方案二：停止后折叠为一行标题 */
  const stopFlowTask = (id: string) =>
    setFlowTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, state: 'done', stopped: true } : task,
      ),
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
          <IconStatusAvatar
            width={scheme === 'tabs' ? 48 : 33}
            height={scheme === 'tabs' ? 52 : 36}
          />
        </span>
        <div className={styles.heroText}>
          <h1 className={styles.name}>元宝</h1>
          {scheme === 'tabs' ? (
            <p className={styles.subtitle}>元宝已陪伴您365天 ~</p>
          ) : (
            <div className={styles.liveRow}>
              <span className={styles.liveDot} aria-hidden="true" />
              <span className={styles.liveText}>会议进行中 · 1 个任务进行中</span>
            </div>
          )}
        </div>
      </div>

      {scheme === 'tabs' && (
        <div className={styles.tabs} role="tablist" aria-label="Agent 状态页视图">
          <Pressable
            className={`${styles.tab} ${tab === 'feed' ? styles.tabActive : ''}`}
            onClick={() => setTab('feed')}
            ariaLabel="动态"
            ariaExpanded={tab === 'feed'}
          >
            动态
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
      )}

      <div className={`${styles.scroll} wm-scroll-hidden`}>
        <div className={styles.content}>
          {scheme === 'tabs' ? (
            tab === 'feed' ? (
              <>
                <TaskSection variant="tabs" tasks={tabTasks} onStop={stopTabTask} />
                <SettingsSection
                  variant="tabs"
                  settings={AGENT_STATUS_SETTINGS}
                  onOpenSetting={onOpenSetting}
                />
              </>
            ) : (
              <LibrarySection
                variant="tabs"
                items={AGENT_STATUS_LIBRARY}
                filters={AGENT_LIBRARY_FILTERS}
                activeFilter={libraryFilter}
                onFilterChange={setLibraryFilter}
                onOpenItem={onOpenLibraryItem}
              />
            )
          ) : (
            <>
              <TaskSection variant="flow" tasks={flowTasks} onStop={stopFlowTask} />
              <LibrarySection
                variant="flow"
                items={AGENT_FLOW_LIBRARY}
                filters={AGENT_FLOW_LIBRARY_FILTERS}
                activeFilter={flowLibraryFilter}
                onFilterChange={setFlowLibraryFilter}
                onOpenItem={onOpenLibraryItem}
              />
              <SettingsSection
                variant="flow"
                settings={AGENT_FLOW_SETTINGS}
                onOpenSetting={onOpenSetting}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
