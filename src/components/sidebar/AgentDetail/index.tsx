import { useMemo, useState, type FC } from 'react';
import IconAgentAvatar from '@/assets/d2c/icons/agentDetail811/icon-agent-avatar';
import IconAgentBack from '@/assets/d2c/icons/agentDetail811/icon-agent-back';
import IconConnectorChevron from '@/assets/d2c/icons/agentDetail811/icon-connector-chevron';
import IconTaskAuto from '@/assets/d2c/icons/agentDetail811/icon-task-auto';
import IconTaskDone from '@/assets/d2c/icons/agentDetail811/icon-task-done';
import IconTaskRunning from '@/assets/d2c/icons/agentDetail811/icon-task-running';
import iconAgentAvatarEdit from '@/assets/d2c/images/agentDetail811/icon-agent-avatar-edit@2x.png';
import iconFileDocx from '@/assets/d2c/images/agentDetail811/icon-file-docx@2x.png';
import iconFilePdf from '@/assets/d2c/images/agentDetail811/icon-file-pdf@2x.png';
import iconFileXlsx from '@/assets/d2c/images/agentDetail811/icon-file-xlsx@2x.png';
import iconFileYuanbao from '@/assets/d2c/images/agentDetail811/icon-file-yuanbao@2x.png';
import imgConnectorFeishu from '@/assets/d2c/images/agentDetail811/img-connector-feishu@2x.png';
import imgConnectorFigma from '@/assets/d2c/images/agentDetail811/img-connector-figma@2x.png';
import imgConnectorGranola from '@/assets/d2c/images/agentDetail811/img-connector-granola@2x.png';
import imgConnectorNotionLg from '@/assets/d2c/images/agentDetail811/img-connector-notion-lg@2x.png';
import imgConnectorNotion from '@/assets/d2c/images/agentDetail811/img-connector-notion@2x.png';
import imgConnectorTencentDoc from '@/assets/d2c/images/agentDetail811/img-connector-tencent-doc@2x.png';
import imgConnectorZoom from '@/assets/d2c/images/agentDetail811/img-connector-zoom@2x.png';
import imgLibraryScreenshot from '@/assets/d2c/images/agentDetail811/img-library-screenshot@2x.png';
import { Pressable } from '@/components/common/Pressable';
import {
  INITIAL_AGENT_CONNECTORS,
  LIBRARY_CURRENT_MEETING_ITEMS,
  LIBRARY_EARLIER_ITEMS,
  RECENT_AGENT_TASKS,
  type AgentConnectorItem,
  type AgentLibraryDoc,
  type AgentScheduledTask,
  type ConnectorIconId,
  type LibraryFileIconKind,
} from '@/data/agentDetail';
import { AGENT_TASKS, type AgentTask } from '@/data/agentTasks';
import type { ArtifactItem } from '@/types/artifact';
import './agentDetailTokens.scss';
import { ConnectorDetailModal } from './ConnectorDetailModal';
import styles from './index.module.scss';

export type AgentDetailTab = 'tasks' | 'library' | 'connectors';

interface AgentDetailProps {
  /** 当前自动任务列表（由 YuanbaoSidebar 持有） */
  scheduledTasks: AgentScheduledTask[];
  /** 切换自动任务开关 */
  onToggleTask: (id: string) => void;
  /** 会中实时产物（支持在资料库中打开对应项） */
  artifacts: ArtifactItem[];
  /** 会中已识别的话题数 */
  topicCount: number;
  /** 返回元宝对话 */
  onBack: () => void;
  /** 打开具体长程任务步骤详情 */
  onOpenTaskDetail: (task: AgentTask) => void;
  /** 打开资料项 */
  onOpenArtifact: (item: ArtifactItem) => void;
  /** 轻提示 */
  onToast: (message: string) => void;
}

const DETAIL_TABS: Array<{ id: AgentDetailTab; label: string }> = [
  { id: 'tasks', label: '任务' },
  { id: 'library', label: '资料库' },
  { id: 'connectors', label: '连接器' },
];

const LIBRARY_ICON_MAP: Record<LibraryFileIconKind, string> = {
  yuanbao: iconFileYuanbao,
  pdf: iconFilePdf,
  xlsx: iconFileXlsx,
  screenshot: imgLibraryScreenshot,
  docx: iconFileDocx,
};

const CONNECTOR_ICON_MAP: Record<ConnectorIconId, string> = {
  figma: imgConnectorFigma,
  granola: imgConnectorGranola,
  'tencent-doc': imgConnectorTencentDoc,
  notion: imgConnectorNotion,
  zoom: imgConnectorZoom,
  feishu: imgConnectorFeishu,
};

const CONNECTOR_MODAL_ICON_MAP: Record<ConnectorIconId, string> = {
  figma: imgConnectorFigma,
  granola: imgConnectorGranola,
  'tencent-doc': imgConnectorTencentDoc,
  notion: imgConnectorNotionLg,
  zoom: imgConnectorZoom,
  feishu: imgConnectorFeishu,
};

/**
 * 新版元宝 Agent 详情页（Figma 811:40446 + 777:72286 + 777:73914 + 796:85424）
 * 覆盖在元宝面板内容区，保留顶部侧栏页签/窗口标题栏与对话挂载状态；支持「任务 / 资料库 / 连接器」及连接器详情弹窗。
 */
export const AgentDetail: FC<AgentDetailProps> = ({
  scheduledTasks,
  onToggleTask,
  artifacts,
  onBack,
  onOpenTaskDetail,
  onOpenArtifact,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<AgentDetailTab>('tasks');
  const [expandedAutoTaskId, setExpandedAutoTaskId] = useState<string | null>(null);
  const [expandedRecentTaskId, setExpandedRecentTaskId] = useState<string | null>(null);
  const [connectors, setConnectors] = useState<AgentConnectorItem[]>(INITIAL_AGENT_CONNECTORS);
  const [activeConnectorId, setActiveConnectorId] = useState<ConnectorIconId | null>(null);

  const activeConnector = useMemo(
    () => connectors.find((item) => item.id === activeConnectorId) ?? null,
    [connectors, activeConnectorId],
  );

  const handleToggleConnector = (id: ConnectorIconId) => {
    const target = connectors.find((item) => item.id === id);
    if (!target) {
      return;
    }
    const nextConnected = !target.connected;
    setConnectors((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              connected: nextConnected,
              connectedAt: nextConnected ? '2026年11月25日' : '未连接',
            }
          : item,
      ),
    );
    onToast(nextConnected ? `已连接「${target.name}」` : `已断开「${target.name}」连接`);
  };

  const handleOpenLibraryDoc = (doc: AgentLibraryDoc) => {
    const matched = artifacts.find((item) => item.name === doc.name);
    if (matched) {
      onOpenArtifact(matched);
      return;
    }
    onToast(`已打开「${doc.name}」（演示）`);
  };

  return (
    <section className={styles.overlay} aria-label="元宝 Agent 详情">
      <div className={`${styles.scroll} wm-scroll-hidden`}>
        {/* 顶部区域：左上返回圆钮 + 居中头像与标题 + 3 段导航（Figma 811:40934） */}
        <div className={styles.headerBlock}>
          <Pressable
            className={styles.backButton}
            onClick={onBack}
            ariaLabel="返回元宝对话"
            title="返回对话"
          >
            <IconAgentBack width={32} height={32} />
          </Pressable>

          <div className={styles.hero}>
            <div className={styles.avatarWrap}>
              <IconAgentAvatar width={50} height={50} />
              <Pressable
                className={styles.avatarEditButton}
                onClick={() => onToast('编辑元宝 Agent 信息（演示）')}
                ariaLabel="编辑元宝 Agent 头像与名称"
                title="编辑 Agent 信息"
              >
                <img
                  src={iconAgentAvatarEdit}
                  alt=""
                  width={16}
                  height={16}
                  className={styles.avatarEditImg}
                />
              </Pressable>
            </div>
            <h2 className={styles.heroName}>元宝</h2>
          </div>

          <div className={styles.tabList} role="tablist" aria-label="Agent 详情视图">
            {DETAIL_TABS.map((tab) => {
              const selected = tab.id === activeTab;
              return (
                <Pressable
                  key={tab.id}
                  className={`${styles.tabItem} ${selected ? styles.tabItemActive : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  ariaLabel={tab.label}
                  ariaExpanded={selected}
                >
                  {tab.label}
                </Pressable>
              );
            })}
          </div>
        </div>

        {/* Tab 1：任务（Figma 811:40959） */}
        {activeTab === 'tasks' && (
          <div className={styles.taskContent}>
            <section className={styles.section} aria-label="自动任务">
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>自动任务</span>
              </div>
              <div className={styles.taskList}>
                {scheduledTasks.map((task) => {
                  const expanded = expandedAutoTaskId === task.id;
                  const linkedDetail = task.linkedTaskId
                    ? AGENT_TASKS.find((item) => item.id === task.linkedTaskId)
                    : undefined;
                  return (
                    <div
                      key={task.id}
                      className={`${styles.taskCard} ${expanded ? styles.taskCardExpanded : ''}`}
                    >
                      <Pressable
                        className={styles.autoTaskRow}
                        onClick={() => setExpandedAutoTaskId(expanded ? null : task.id)}
                        ariaExpanded={expanded}
                      >
                        <span
                          className={`${styles.taskIconBox} ${styles.taskIconBoxAuto} ${
                            !task.enabled ? styles.taskIconMuted : ''
                          }`}
                        >
                          <IconTaskAuto width={36} height={36} />
                        </span>
                        <div className={styles.taskTextCol}>
                          <span
                            className={`${styles.autoTaskTitle} ${
                              !task.enabled ? styles.taskTitlePaused : ''
                            }`}
                          >
                            {task.title}
                          </span>
                          <span className={styles.taskSubtitle}>
                            {task.enabled ? task.schedule : '已暂停 · 点击展开重新开启'}
                          </span>
                        </div>
                      </Pressable>

                      {expanded && (
                        <div className={styles.taskExpand}>
                          <p className={styles.expandDesc}>{task.description}</p>
                          <div className={styles.expandControlRow}>
                            <span className={styles.expandMeta}>
                              {task.enabled ? task.nextRun : '当前已暂停'}
                            </span>
                            <Pressable
                              className={`${styles.switch} ${task.enabled ? styles.switchOn : ''}`}
                              onClick={() => onToggleTask(task.id)}
                              ariaLabel={`${task.enabled ? '暂停' : '开启'}${task.title}`}
                              ariaExpanded={task.enabled}
                              stopPropagation
                            >
                              <span className={styles.switchThumb} />
                            </Pressable>
                          </div>
                          <div className={styles.expandActions}>
                            {linkedDetail && (
                              <Pressable
                                className={styles.expandActionPrimary}
                                onClick={() => onOpenTaskDetail(linkedDetail)}
                              >
                                查看步骤进度
                              </Pressable>
                            )}
                            <Pressable
                              className={styles.expandActionSecondary}
                              onClick={() => onToast(`已立即执行「${task.title}」（演示）`)}
                            >
                              立即执行一次
                            </Pressable>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={styles.section} aria-label="最近任务">
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>最近任务</span>
              </div>
              <div className={styles.taskList}>
                {RECENT_AGENT_TASKS.map((item) => {
                  const expanded = expandedRecentTaskId === item.id;
                  const linkedDetail = item.linkedTaskId
                    ? AGENT_TASKS.find((task) => task.id === item.linkedTaskId)
                    : undefined;
                  return (
                    <div
                      key={item.id}
                      className={`${styles.taskCard} ${expanded ? styles.taskCardExpanded : ''}`}
                    >
                      <Pressable
                        className={styles.recentTaskRow}
                        onClick={() => setExpandedRecentTaskId(expanded ? null : item.id)}
                        ariaExpanded={expanded}
                      >
                        <span className={styles.taskIconBox}>
                          {item.status === 'running' ? (
                            <IconTaskRunning width={36} height={36} />
                          ) : (
                            <IconTaskDone width={36} height={36} />
                          )}
                        </span>
                        <div className={styles.taskTextCol}>
                          <span className={styles.recentTaskTitle}>{item.title}</span>
                          <span className={styles.taskSubtitle}>{item.summary}</span>
                        </div>
                      </Pressable>

                      {expanded && (
                        <div className={styles.taskExpand}>
                          <p className={styles.expandDesc}>{item.detail}</p>
                          <div className={styles.expandActions}>
                            <Pressable
                              className={styles.expandActionPrimary}
                              onClick={() => {
                                if (item.returnToChat) {
                                  onBack();
                                } else {
                                  setActiveTab('library');
                                }
                              }}
                            >
                              {item.actionLabel}
                            </Pressable>
                            {linkedDetail && (
                              <Pressable
                                className={styles.expandActionSecondary}
                                onClick={() => onOpenTaskDetail(linkedDetail)}
                              >
                                查看执行步骤
                              </Pressable>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* Tab 2：资料库（Figma 777:72286） */}
        {activeTab === 'library' && (
          <div className={styles.libraryContent}>
            <div className={styles.libraryGroupLabel}>本场会议</div>
            <div className={styles.libraryList}>
              {LIBRARY_CURRENT_MEETING_ITEMS.map((doc) => (
                <Pressable
                  key={doc.id}
                  className={styles.libraryRow}
                  onClick={() => handleOpenLibraryDoc(doc)}
                >
                  <span className={styles.libraryIconWrap}>
                    <img
                      src={LIBRARY_ICON_MAP[doc.icon]}
                      alt=""
                      width={32}
                      height={32}
                      className={
                        doc.icon === 'screenshot' ? styles.libraryThumbImg : styles.libraryIconImg
                      }
                    />
                  </span>
                  <div className={styles.libraryTextCol}>
                    <span className={styles.libraryTitle}>{doc.name}</span>
                    <div className={styles.libraryMetaRow}>
                      <span className={styles.libraryMetaText}>{doc.format}</span>
                      <span className={styles.libraryMetaDivider} aria-hidden="true" />
                      <span className={styles.libraryMetaText}>{doc.size}</span>
                    </div>
                  </div>
                </Pressable>
              ))}
            </div>

            <div className={styles.librarySectionDivider} aria-hidden="true" />

            <div className={styles.libraryGroupLabel}>更早</div>
            <div className={styles.libraryList}>
              {LIBRARY_EARLIER_ITEMS.map((doc) => (
                <Pressable
                  key={doc.id}
                  className={styles.libraryRow}
                  onClick={() => handleOpenLibraryDoc(doc)}
                >
                  <span className={styles.libraryIconWrap}>
                    <img
                      src={LIBRARY_ICON_MAP[doc.icon]}
                      alt=""
                      width={32}
                      height={32}
                      className={styles.libraryIconImg}
                    />
                  </span>
                  <div className={styles.libraryTextCol}>
                    <span className={styles.libraryTitle}>{doc.name}</span>
                    <div className={styles.libraryMetaRow}>
                      <span className={styles.libraryMetaText}>{doc.format}</span>
                      <span className={styles.libraryMetaDivider} aria-hidden="true" />
                      <span className={styles.libraryMetaText}>{doc.size}</span>
                    </div>
                  </div>
                </Pressable>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3：连接器（Figma 777:73914） */}
        {activeTab === 'connectors' && (
          <div className={styles.connectorContent}>
            {connectors.map((item) => (
              <Pressable
                key={item.id}
                className={styles.connectorRow}
                onClick={() => setActiveConnectorId(item.id)}
                ariaLabel={`查看 ${item.name} 连接器详情`}
              >
                <span className={styles.connectorIconWrap}>
                  <img
                    src={CONNECTOR_ICON_MAP[item.id]}
                    alt=""
                    width={32}
                    height={32}
                    className={styles.connectorIconImg}
                  />
                </span>
                <div className={styles.connectorTextCol}>
                  <span className={styles.connectorName}>{item.name}</span>
                  <span className={styles.connectorDesc}>{item.description}</span>
                </div>
                <div className={styles.connectorTrailing}>
                  {item.connected ? (
                    <Pressable
                      as="span"
                      className={styles.connectorConnectedPill}
                      onClick={() => setActiveConnectorId(item.id)}
                      ariaLabel={`查看 ${item.name} 连接详情`}
                      stopPropagation
                    >
                      <span>已连接</span>
                      <IconConnectorChevron width={7} height={10} />
                    </Pressable>
                  ) : (
                    <Pressable
                      as="span"
                      className={styles.connectorConnectButton}
                      onClick={() => handleToggleConnector(item.id)}
                      ariaLabel={`连接 ${item.name}`}
                      stopPropagation
                    >
                      连接
                    </Pressable>
                  )}
                </div>
              </Pressable>
            ))}
          </div>
        )}
      </div>

      {/* 连接器查看详情弹窗（Figma 796:85424） */}
      {activeConnector && (
        <ConnectorDetailModal
          connector={activeConnector}
          iconSrc={CONNECTOR_MODAL_ICON_MAP[activeConnector.id]}
          onClose={() => setActiveConnectorId(null)}
          onToggleConnect={handleToggleConnector}
        />
      )}
    </section>
  );
};
