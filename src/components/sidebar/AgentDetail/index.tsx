import { useMemo, useState, type FC } from 'react';
import IconSide3Logo from '@/assets/d2c/icons/v2/icon-side3-logo';
import { Pressable } from '@/components/common/Pressable';
import {
  EXTRA_LIBRARY_DOCS,
  INITIAL_AGENT_PREFERENCES,
  TODAY_TIMELINE_ITEMS,
  type AgentPreferenceItem,
  type AgentScheduledTask,
  type LibraryFilter,
  type ScheduledTaskKind,
  type TimelineIconKind,
} from '@/data/agentDetail';
import { AGENT_TASKS, type AgentTask } from '@/data/agentTasks';
import type { ArtifactItem } from '@/types/artifact';
import styles from './index.module.scss';

export type AgentDetailTab = 'activity' | 'library' | 'settings';

interface AgentDetailProps {
  /** 当前自动与预定任务列表（由 YuanbaoSidebar 持有，顶部状态条实时联动） */
  scheduledTasks: AgentScheduledTask[];
  /** 切换定时/自动任务开关 */
  onToggleTask: (id: string) => void;
  /** 会中实时产物（笔记 / PDF / PPT / 截图） */
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

const LIBRARY_FILTERS: Array<{ id: LibraryFilter; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'note', label: '笔记' },
  { id: 'file', label: '文件' },
  { id: 'capture', label: '截图' },
];

const TaskKindGlyph: FC<{ kind: ScheduledTaskKind; enabled: boolean }> = ({ kind, enabled }) => {
  if (kind === 'heartbeat') {
    return (
      <span className={`${styles.taskGlyph} ${styles.taskGlyphCircle} ${!enabled ? styles.glyphMuted : ''}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 13.2s-4.7-2.9-5.6-5.5C1.7 5.6 3.1 3.7 5 3.7c1.2 0 2.2.7 3 1.7.8-1 1.8-1.7 3-1.7 1.9 0 3.3 1.9 2.6 4-.9 2.6-5.6 5.5-5.6 5.5Z"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (kind === 'live-note') {
    return (
      <span className={`${styles.taskGlyph} ${!enabled ? styles.glyphMuted : ''}`}>
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
          <rect x="2.2" y="2.6" width="12.6" height="11.8" rx="2.6" stroke="currentColor" strokeWidth="1.25" />
          <path d="M5 6.4h7M5 9.2h5.2M5 12h3.4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
        {enabled && <span className={styles.liveDotBadge} aria-hidden="true" />}
      </span>
    );
  }

  if (kind === 'memory') {
    return (
      <span className={`${styles.taskGlyph} ${!enabled ? styles.glyphMuted : ''}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 2.2 9.4 6l3.8 1.4-3.8 1.4L8 12.6 6.6 8.8 2.8 7.4 6.6 6 8 2.2Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className={`${styles.taskGlyph} ${!enabled ? styles.glyphMuted : ''}`}>
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
        <rect x="2.2" y="3.2" width="12.6" height="11" rx="2.4" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2.4 6.6h12.2M5.6 2v2.2M11.4 2v2.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="5.7" cy="9.4" r="0.85" fill="currentColor" />
        <circle cx="8.5" cy="9.4" r="0.85" fill="currentColor" />
        <circle cx="11.3" cy="9.4" r="0.85" fill="currentColor" />
      </svg>
      <span className={styles.clockBadge} aria-hidden="true">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="5" fill="currentColor" />
          <path d="M5 2.7v2.4l1.6 1" stroke="#fff" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  );
};

const TimelineGlyph: FC<{ kind: TimelineIconKind }> = ({ kind }) => {
  if (kind === 'active') {
    return (
      <span className={`${styles.timelineGlyph} ${styles.timelineGlyphActive}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="5.2" cy="5.2" r="1.9" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="10.8" cy="5.2" r="1.9" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="5.2" cy="10.8" r="1.9" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="10.8" cy="10.8" r="1.9" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </span>
    );
  }

  if (kind === 'memory') {
    return (
      <span className={styles.timelineGlyph}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.25" />
          <path d="M8 5.3v3l2 1.2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  if (kind === 'capture') {
    return (
      <span className={styles.timelineGlyph}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="9" rx="2" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="6.1" cy="6.8" r="1" fill="currentColor" />
          <path d="M3.5 11l2.8-2.6 2 1.8 1.6-1.5 2.6 2.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  return (
    <span className={styles.timelineGlyph}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="5.6" stroke="currentColor" strokeWidth="1.25" />
        <path d="M5.6 8.1 7.2 9.7 10.6 6.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
};

/**
 * 元宝 Agent 详情页（参考 Muse Agent 详情结构 + 腾讯会议元宝视觉）
 * 覆盖在元宝面板内，保留对话挂载状态；返回对话不丢消息与草稿。
 */
export const AgentDetail: FC<AgentDetailProps> = ({
  scheduledTasks,
  onToggleTask,
  artifacts,
  topicCount,
  onBack,
  onOpenTaskDetail,
  onOpenArtifact,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<AgentDetailTab>('activity');
  const [tasksCollapsed, setTasksCollapsed] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [todayCollapsed, setTodayCollapsed] = useState(false);
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>('all');
  const [preferences, setPreferences] = useState<AgentPreferenceItem[]>(INITIAL_AGENT_PREFERENCES);

  const enabledTaskCount = useMemo(
    () => scheduledTasks.filter((item) => item.enabled).length,
    [scheduledTasks],
  );

  const visibleTasks = useMemo(
    () => (showAllTasks ? scheduledTasks : scheduledTasks.filter((item) => !item.secondary)),
    [scheduledTasks, showAllTasks],
  );

  const hiddenTaskCount = scheduledTasks.length - scheduledTasks.filter((item) => !item.secondary).length;

  const libraryItems = useMemo(() => {
    const liveDocs = artifacts.map((item) => {
      const category: Exclude<LibraryFilter, 'all'> =
        item.icon === 'yuanbao' || item.icon === 'transcript'
          ? 'note'
          : item.icon === 'image'
            ? 'capture'
            : 'file';
      const kindLabel =
        item.icon === 'yuanbao'
          ? '实时笔记'
          : item.icon === 'image'
            ? '会议截图'
            : item.type;
      return {
        id: item.id,
        name: item.name,
        category,
        kindLabel,
        meta: item.group === 'output' ? '本场元宝产出' : '本场会议来源',
        time: item.size || '刚刚',
        artifact: item,
      };
    });

    const combined = [
      ...liveDocs,
      ...EXTRA_LIBRARY_DOCS.map((doc) => ({ ...doc, artifact: null as ArtifactItem | null })),
    ];

    if (libraryFilter === 'all') {
      return combined;
    }
    return combined.filter((item) => item.category === libraryFilter);
  }, [artifacts, libraryFilter]);

  const togglePreference = (id: string) => {
    setPreferences((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return item;
        }
        const next = !item.enabled;
        onToast(`${item.title}已${next ? '开启' : '关闭'}`);
        return { ...item, enabled: next };
      }),
    );
  };

  const segments: Array<{ id: AgentDetailTab; label: string }> = [
    { id: 'activity', label: '动态' },
    { id: 'library', label: '资料库' },
    { id: 'settings', label: '设置' },
  ];

  const activeSegmentIndex = segments.findIndex((seg) => seg.id === activeTab);

  return (
    <section className={styles.overlay} aria-label="元宝 Agent 详情">
      <header className={styles.topBar}>
        <Pressable className={styles.backButton} onClick={onBack} ariaLabel="返回元宝对话" title="返回元宝对话">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M9.8 3.6 5.4 8l4.4 4.4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>返回对话</span>
        </Pressable>

        <Pressable className={styles.closeButton} onClick={onBack} ariaLabel="关闭详情页" title="关闭详情">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4.2 4.2 11.8 11.8M11.8 4.2 4.2 11.8"
              stroke="currentColor"
              strokeWidth="1.45"
              strokeLinecap="round"
            />
          </svg>
        </Pressable>
      </header>

      <div className={`${styles.scroll} wm-scroll-hidden`}>
        {/* Muse 风格居中 Hero：头像 + 名称 + 实时状态 */}
        <div className={styles.hero}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing}>
              <IconSide3Logo width={50} height={50} />
            </div>
            <Pressable
              className={styles.avatarBadge}
              onClick={() => setActiveTab('settings')}
              ariaLabel="编辑元宝能力设置"
              title="能力与偏好设置"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M7.9 2.1 9.9 4.1M2.3 9.7l.6-2.2L8.4 2a.85.85 0 0 1 1.2 0l.4.4a.85.85 0 0 1 0 1.2L4.5 9.1l-2.2.6Z"
                  stroke="currentColor"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Pressable>
          </div>
          <h2 className={styles.heroName}>元宝</h2>
          <p className={styles.heroStatus}>
            <span className={styles.heroDot} aria-hidden="true" />
            <span>
              会议智能助手 · {enabledTaskCount}项任务运行中 · 已识别 {topicCount + 2} 个议题
            </span>
          </p>
        </div>

        {/* Muse 风格 3 段胶囊切换：动态 / 资料库 / 设置 */}
        <div className={styles.segmentWrap}>
          <div className={styles.segmentTrack} role="tablist" aria-label="Agent 详情视图">
            {segments.map((seg, index) => {
              const selected = seg.id === activeTab;
              const showRightDivider =
                index < segments.length - 1 && index !== activeSegmentIndex && index + 1 !== activeSegmentIndex;
              return (
                <div className={styles.segmentCell} key={seg.id}>
                  <Pressable
                    className={`${styles.segmentItem} ${selected ? styles.segmentItemActive : ''}`}
                    onClick={() => setActiveTab(seg.id)}
                    ariaLabel={seg.label}
                    ariaExpanded={selected}
                  >
                    {seg.id === 'activity' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path
                          d="M4.6 3.7h6.6M4.6 7h6.6M4.6 10.3h6.6M2.4 3.7h.5M2.4 7h.5M2.4 10.3h.5"
                          stroke="currentColor"
                          strokeWidth="1.35"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    {seg.id === 'library' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path
                          d="M7 1.8 11.4 3.6v3.1c0 2.7-1.8 4.8-4.4 5.6-2.6-.8-4.4-2.9-4.4-5.6V3.6L7 1.8Z"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinejoin="round"
                        />
                        <path
                          d="m5.2 7.1 1.2 1.2 2.4-2.4"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {seg.id === 'settings' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path
                          d="M2.2 4.2h9.6M2.2 9.8h9.6"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                        />
                        <circle cx="5.2" cy="4.2" r="1.4" fill="var(--wm-color-background-quaternary)" stroke="currentColor" strokeWidth="1.25" />
                        <circle cx="9" cy="9.8" r="1.4" fill="var(--wm-color-background-quaternary)" stroke="currentColor" strokeWidth="1.25" />
                      </svg>
                    )}
                    <span>{seg.label}</span>
                  </Pressable>
                  {showRightDivider && <span className={styles.segmentDivider} aria-hidden="true" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab 1：动态（预定与自动任务 + 今日活动时间线） */}
        {activeTab === 'activity' && (
          <div className={styles.sections}>
            <section className={styles.section} aria-label="预定与自动任务">
              <Pressable
                className={styles.sectionHeader}
                onClick={() => setTasksCollapsed((value) => !value)}
                ariaExpanded={!tasksCollapsed}
              >
                <span className={styles.sectionTitle}>{enabledTaskCount}项预定与自动任务</span>
                <span className={`${styles.sectionChevron} ${tasksCollapsed ? styles.sectionChevronCollapsed : ''}`}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M3.5 5.4 7 8.9l3.5-3.5"
                      stroke="currentColor"
                      strokeWidth="1.35"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Pressable>

              {!tasksCollapsed && (
                <>
                  <div className={styles.taskList}>
                    {visibleTasks.map((task) => {
                      const expanded = expandedTaskId === task.id;
                      const linkedDetail = task.linkedTaskId
                        ? AGENT_TASKS.find((item) => item.id === task.linkedTaskId)
                        : undefined;
                      return (
                        <div className={`${styles.taskCard} ${expanded ? styles.taskCardExpanded : ''}`} key={task.id}>
                          <div className={styles.taskRow}>
                            <Pressable
                              className={styles.taskMain}
                              onClick={() => setExpandedTaskId(expanded ? null : task.id)}
                              ariaExpanded={expanded}
                            >
                              <TaskKindGlyph kind={task.kind} enabled={task.enabled} />
                              <div className={styles.taskText}>
                                <span className={`${styles.taskTitle} ${!task.enabled ? styles.taskTitlePaused : ''}`}>
                                  {task.title}
                                </span>
                                <span className={styles.taskSchedule}>
                                  {task.enabled ? task.schedule : '已暂停 · 点击右侧开关恢复'}
                                </span>
                              </div>
                            </Pressable>
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

                          {expanded && (
                            <div className={styles.taskExpand}>
                              <p className={styles.expandDesc}>{task.description}</p>
                              <div className={styles.expandMeta}>
                                <span>{task.nextRun}</span>
                                <span>{task.scope}</span>
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
                                  className={styles.expandAction}
                                  onClick={() => onToast(`已手动触发「${task.title}」（演示）`)}
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

                  {hiddenTaskCount > 0 && (
                    <Pressable
                      className={styles.viewAllButton}
                      onClick={() => setShowAllTasks((value) => !value)}
                      ariaExpanded={showAllTasks}
                    >
                      {showAllTasks ? '收起部分预定任务' : `查看所有预定任务（共 ${scheduledTasks.length} 项）`}
                    </Pressable>
                  )}
                </>
              )}
            </section>

            <section className={styles.section} aria-label="今天活动时间线">
              <Pressable
                className={styles.sectionHeader}
                onClick={() => setTodayCollapsed((value) => !value)}
                ariaExpanded={!todayCollapsed}
              >
                <span className={styles.sectionTitle}>今天</span>
                <span className={`${styles.sectionChevron} ${todayCollapsed ? styles.sectionChevronCollapsed : ''}`}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M3.5 5.4 7 8.9l3.5-3.5"
                      stroke="currentColor"
                      strokeWidth="1.35"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Pressable>

              {!todayCollapsed && (
                <div className={styles.timeline}>
                  {TODAY_TIMELINE_ITEMS.map((item) => {
                    const expanded = expandedActivityId === item.id;
                    return (
                      <div
                        className={`${styles.timelineCard} ${expanded ? styles.timelineCardExpanded : ''}`}
                        key={item.id}
                      >
                        <Pressable
                          className={styles.timelineRow}
                          onClick={() => setExpandedActivityId(expanded ? null : item.id)}
                          ariaExpanded={expanded}
                        >
                          <TimelineGlyph kind={item.icon} />
                          <div className={styles.timelineBody}>
                            <span className={styles.timelineTitle}>{item.title}</span>
                            <span className={styles.timelineSummary}>{item.summary}</span>
                            <span className={styles.timelineTime}>{item.time}</span>
                          </div>
                        </Pressable>

                        {expanded && (
                          <div className={styles.timelineExpand}>
                            <p className={styles.expandDesc}>{item.detail}</p>
                            <div className={styles.expandActions}>
                              <Pressable
                                className={styles.expandActionPrimary}
                                onClick={() => {
                                  if (item.returnToChat) {
                                    onBack();
                                  } else {
                                    onToast(`${item.actionLabel}（演示）`);
                                  }
                                }}
                              >
                                {item.actionLabel}
                              </Pressable>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Tab 2：资料库 */}
        {activeTab === 'library' && (
          <div className={styles.sections}>
            <div className={styles.filterRow} role="tablist" aria-label="资料筛选">
              {LIBRARY_FILTERS.map((filter) => (
                <Pressable
                  key={filter.id}
                  className={`${styles.filterChip} ${libraryFilter === filter.id ? styles.filterChipActive : ''}`}
                  onClick={() => setLibraryFilter(filter.id)}
                  ariaExpanded={libraryFilter === filter.id}
                >
                  {filter.label}
                </Pressable>
              ))}
            </div>

            <div className={styles.libraryList}>
              {libraryItems.map((doc) => (
                <Pressable
                  key={doc.id}
                  className={styles.libraryItem}
                  onClick={() =>
                    doc.artifact ? onOpenArtifact(doc.artifact) : onToast(`已打开「${doc.name}」（演示）`)
                  }
                >
                  <span className={styles.libraryBadge}>{doc.kindLabel}</span>
                  <div className={styles.libraryBody}>
                    <span className={styles.libraryName}>{doc.name}</span>
                    <span className={styles.libraryMeta}>
                      {doc.meta} · {doc.time}
                    </span>
                  </div>
                </Pressable>
              ))}
              {libraryItems.length === 0 && <p className={styles.emptyText}>当前分类下暂无会议资料</p>}
            </div>
          </div>
        )}

        {/* Tab 3：设置 */}
        {activeTab === 'settings' && (
          <div className={styles.sections}>
            <div className={styles.prefList}>
              {preferences.map((pref) => (
                <div className={styles.prefRow} key={pref.id}>
                  <div className={styles.prefText}>
                    <span className={styles.prefTitle}>{pref.title}</span>
                    <span className={styles.prefDesc}>{pref.description}</span>
                  </div>
                  <Pressable
                    className={`${styles.switch} ${pref.enabled ? styles.switchOn : ''}`}
                    onClick={() => togglePreference(pref.id)}
                    ariaLabel={`${pref.enabled ? '关闭' : '开启'}${pref.title}`}
                    ariaExpanded={pref.enabled}
                  >
                    <span className={styles.switchThumb} />
                  </Pressable>
                </div>
              ))}
            </div>

            <div className={styles.scopeCard}>
              <div className={styles.scopeRow}>
                <span className={styles.scopeLabel}>工作模式</span>
                <span className={styles.scopeValue}>Personal Agent · 仅自己可见</span>
              </div>
              <div className={styles.scopeRow}>
                <span className={styles.scopeLabel}>上下文范围</span>
                <span className={styles.scopeValue}>本场会议 + 历史项目决策记忆</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
