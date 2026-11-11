import { useState, type FC } from 'react';
import IconAgentClose from '@/assets/d2c/icons/agent/icon-agent-close';
import IconAgentMore from '@/assets/d2c/icons/agent/icon-agent-more';
import IconAgentPip from '@/assets/d2c/icons/agent/icon-agent-pip';
import { PopMenu, type PopMenuItem } from '@/components/common/PopMenu';
import { Pressable } from '@/components/common/Pressable';
import { YuanbaoAvatar } from '@/components/agent/YuanbaoAvatar';
import type { YuanbaoMood } from '@/data/agentTasks';
import type { AgentDockControl } from '@/hooks/useAgentDock';
import styles from './index.module.scss';

interface AgentTitleBarProps {
  /** 吸附 / 分离状态与拖动句柄 */
  dock: AgentDockControl;
  /** 头像状态（雪碧图动画） */
  mood: YuanbaoMood;
  /** 名称下方的状态文字：待命 / 正在生成会议纪要… / 等你确认 / 任务已完成 / 休息中 */
  statusText: string;
  /** 打招呼动画播完 */
  onGreetingEnd: () => void;
  /** 关闭元宝窗口（和底部元宝按钮是同一个开关） */
  onClose: () => void;
  /** 在元宝主端打开 */
  onOpenMain: () => void;
  /** 「更多」菜单项 */
  menuItems: PopMenuItem[];
}

/**
 * 元宝窗口标题栏（Figma 214:11040）
 * 左：标题胶囊（元宝头像 + 名称 + 状态文字）；右：独立窗口 / 更多 / 关闭，三个中性灰图标。
 * 没有 macOS 红黄绿圆点；按住这一行（按钮除外）拖动即可把元宝从会议窗口分离出来，拖回会议右缘松手再吸附回去。
 * 头像用雪碧图跟着任务状态动（Figma 197:42 方案 A：顶部头像集成），状态文字常驻在名称下方。
 */
export const AgentTitleBar: FC<AgentTitleBarProps> = ({
  dock,
  mood,
  statusText,
  onGreetingEnd,
  onClose,
  onOpenMain,
  menuItems,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const moreItems: PopMenuItem[] = [
    { key: 'open-main', label: '在元宝主端打开', onClick: onOpenMain },
    ...menuItems,
  ];
  const floating = dock.mode === 'floating';

  return (
    <header
      className={`${styles.header} ${dock.dragging ? styles.headerDragging : ''}`}
      onPointerDown={dock.onTitlePointerDown}
      title="按住拖动，可把元宝从会议窗口分离出来"
    >
      {/* 标题胶囊（Figma 215:16125）：头像压在左侧 52 的留白里，文字两行 */}
      <div className={styles.pill}>
        <YuanbaoAvatar className={styles.avatar} mood={mood} onOnceEnd={onGreetingEnd} />
        <div className={styles.titleText}>
          <span className={styles.name}>元宝</span>
          {/* key 跟着文案变：换状态时淡入一次 */}
          <span className={styles.status} key={statusText} role="status">
            {statusText}
          </span>
        </div>
      </div>

      <div className={styles.actions} data-nodrag>
        <Pressable
          className={styles.iconButton}
          onClick={dock.toggleDock}
          title={floating ? '吸附回会议' : '独立窗口打开'}
          ariaLabel={floating ? '吸附回会议' : '独立窗口打开'}
        >
          {floating ? (
            /* 吸附：窗口 + 右侧并列栏 */
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10 3v10" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          ) : (
            <IconAgentPip />
          )}
        </Pressable>
        <div className={styles.moreWrap}>
          {/* 「更多」「关闭」导出的图标左侧自带 4 的间距（Figma …:margin），按钮宽 24、hover 底只铺右侧 20 */}
          <Pressable
            className={`${styles.iconButton} ${styles.iconButtonMargin}`}
            onClick={() => setMenuOpen((open) => !open)}
            title="更多"
            ariaLabel="更多操作"
          >
            <IconAgentMore />
          </Pressable>
          {menuOpen && <PopMenu items={moreItems} onClose={() => setMenuOpen(false)} />}
        </div>
        <Pressable
          className={`${styles.iconButton} ${styles.iconButtonMargin}`}
          onClick={onClose}
          title="关闭元宝"
          ariaLabel="关闭元宝"
        >
          <IconAgentClose />
        </Pressable>
      </div>
    </header>
  );
};
