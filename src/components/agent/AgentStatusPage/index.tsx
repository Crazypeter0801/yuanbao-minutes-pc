import { useState, type FC } from 'react';
import iconSettings from '@/assets/detail/icon-settings.svg';
import IconStatusBack from '@/assets/d2c/icons/agent-status/icon-status-back';
import IconStatusClose from '@/assets/d2c/icons/agent-status/icon-status-close';
import IconStatusPip from '@/assets/d2c/icons/agent-status/icon-status-pip';
import { YuanbaoAvatar } from '@/components/agent/YuanbaoAvatar';
import { Pressable } from '@/components/common/Pressable';
import type { DetailLibraryFilter, DetailLibraryItem } from '@/data/detailLibrary';
import type { AgentDockControl } from '@/hooks/useAgentDock';
import { AGENT_STATUS_TASKS } from '@/data/agentStatusTasks';
import { AvatarEditor } from './AvatarEditor';
import { LibrarySection } from './LibrarySection';
import { TaskSection } from './TaskSection';
import styles from './index.module.scss';

export type AgentStatusTab = 'overview' | 'library';

interface AgentStatusPageProps {
  dock: AgentDockControl;
  initialTab?: AgentStatusTab;
  /** 已经设置过的形象；为空时头部仍用动态元宝 */
  portrait: string | null;
  onBack: () => void;
  onClose: () => void;
  onApplyPortrait: (src: string) => void;
  onOpenFile: (item: DetailLibraryItem) => void;
  onCreateAuto: () => void;
  onOpenSettings: () => void;
}

/**
 * 元宝详情页（Figma 289:30737 / 289:31272）
 * 盖在元宝窗内部：返回回到对话，右侧仍是弹出和关闭。点头像编辑形象。
 */
export const AgentStatusPage: FC<AgentStatusPageProps> = ({
  dock,
  initialTab = 'overview',
  portrait,
  onBack,
  onClose,
  onApplyPortrait,
  onOpenFile,
  onCreateAuto,
  onOpenSettings,
}) => {
  const [tab, setTab] = useState<AgentStatusTab>(initialTab);
  const [libraryFilter, setLibraryFilter] = useState<DetailLibraryFilter>('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const floating = dock.mode === 'floating';

  return (
    <div className={styles.page}>
      <header
        className={styles.topBar}
        onPointerDown={dock.onTitlePointerDown}
        title="按住拖动，可把元宝从会议窗口分离出来"
      >
        <div className={styles.topLeft} data-nodrag>
          <Pressable className={styles.iconButton} onClick={onBack} title="返回聊天" ariaLabel="返回聊天">
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <path d="M10 3v10" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            ) : (
              <IconStatusPip />
            )}
          </Pressable>
          <Pressable className={styles.iconButton} onClick={onClose} title="关闭元宝" ariaLabel="关闭元宝">
            <IconStatusClose />
          </Pressable>
        </div>
      </header>

      <div className={styles.hero}>
        <Pressable
          className={styles.heroAvatar}
          onClick={() => setEditorOpen(true)}
          ariaLabel="编辑头像"
          title="编辑头像"
        >
          {portrait ? (
            <img className={styles.portrait} src={portrait} alt="" />
          ) : (
            <YuanbaoAvatar mood="working" size={48} />
          )}
          {!editorOpen && <span className={styles.editTip}>编辑头像</span>}
        </Pressable>
        <div className={styles.heroText}>
          <h1 className={styles.name}>元宝</h1>
          <p className={styles.subtitle}>元宝已陪伴您365天 ~</p>
        </div>
        <Pressable className={styles.settings} onClick={onOpenSettings} ariaLabel="设置" title="设置">
          <img src={iconSettings} width={20} height={20} alt="" />
        </Pressable>
      </div>

      <div className={styles.tabBar}>
        <div className={styles.tabs} role="tablist" aria-label="元宝详情">
          <Pressable
            className={`${styles.tab} ${tab === 'overview' ? styles.tabActive : ''}`}
            onClick={() => setTab('overview')}
            ariaLabel="任务"
            ariaExpanded={tab === 'overview'}
          >
            任务
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
            <TaskSection tasks={AGENT_STATUS_TASKS} onCreateAuto={onCreateAuto} />
          ) : (
            <LibrarySection
              activeFilter={libraryFilter}
              onFilterChange={setLibraryFilter}
              onOpenItem={onOpenFile}
            />
          )}
        </div>
      </div>

      {editorOpen && (
        <AvatarEditor
          appliedSrc={portrait}
          onCancel={() => setEditorOpen(false)}
          onApply={(src) => {
            onApplyPortrait(src);
            setEditorOpen(false);
          }}
        />
      )}
    </div>
  );
};
