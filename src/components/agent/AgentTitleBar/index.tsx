import { useState, type FC } from 'react';
import IconAgentClose from '@/assets/d2c/icons/agent/icon-agent-close';
import IconAgentMore from '@/assets/d2c/icons/agent/icon-agent-more';
import IconAgentPip from '@/assets/d2c/icons/agent/icon-agent-pip';
import IconTaskEntryIconChevron from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-chevron';
import { PopMenu, type PopMenuItem } from '@/components/common/PopMenu';
import { Pressable } from '@/components/common/Pressable';
import { YuanbaoAvatar } from '@/components/agent/YuanbaoAvatar';
import {
  CHAT_FONT_FAMILIES,
  CHAT_FONT_SIZES,
  type ChatFontFamilyKey,
  type ChatFontSizeKey,
} from '@/data/chatPreferences';
import type { YuanbaoMood } from '@/data/agentTasks';
import type { AgentDockControl } from '@/hooks/useAgentDock';
import styles from './index.module.scss';

interface AgentTitleBarProps {
  /** 吸附 / 分离状态与拖动句柄 */
  dock: AgentDockControl;
  /** 头像状态（雪碧图动画） */
  mood: YuanbaoMood;
  /** 名称下方的状态文字；空字符串时不渲染副标题 */
  statusText: string;
  /** 同一个状态要重播时递增（连续摸头） */
  replayKey: number;
  /** 一次性动画（打招呼 / 喝彩 / 吃新动态…）播完 */
  onOnceEnd: () => void;
  /** 点一下头像：摸摸元宝 */
  onTouch: () => void;
  /** 详情页设置过的形象。有值时替换雪碧图 */
  portrait?: string | null;
  /** 点击头像或名字：进入 Agent 状态页 */
  onOpenStatus: () => void;
  /** 关闭元宝窗口（和底部元宝按钮是同一个开关） */
  onClose: () => void;
  /** 对话区当前字号 */
  fontSize: ChatFontSizeKey;
  /** 对话区当前字体 */
  fontFamily: ChatFontFamilyKey;
  /** 切换字号：实时改对话区 */
  onFontSizeChange: (key: ChatFontSizeKey) => void;
  /** 切换字体：实时改对话区 */
  onFontFamilyChange: (key: ChatFontFamilyKey) => void;
}

/**
 * 元宝窗口标题栏（Figma 215:19035 / 416:20844）
 * 左侧胶囊：头像 +「元宝 ›」+ 状态副标题（正在记笔记... / 任务 activity）；点胶囊进状态页。
 * 右侧：更多 / 独立窗口 / 关闭（无白底胶囊，间距 4）。按住空白处可拖出；浮出时会议区不自动变宽。
 */
export const AgentTitleBar: FC<AgentTitleBarProps> = ({
  dock,
  mood,
  statusText,
  replayKey,
  onOnceEnd,
  onTouch,
  onOpenStatus,
  onClose,
  portrait,
  fontSize,
  fontFamily,
  onFontSizeChange,
  onFontFamilyChange,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const floating = dock.mode === 'floating';
  const showStatus = Boolean(statusText);
  const moreItems: PopMenuItem[] = [
    ...CHAT_FONT_SIZES.map<PopMenuItem>((option) => ({
      key: `size-${option.key}`,
      group: '字号',
      label: option.label,
      active: option.key === fontSize,
      onClick: () => onFontSizeChange(option.key),
    })),
    ...CHAT_FONT_FAMILIES.map<PopMenuItem>((option) => ({
      key: `font-${option.key}`,
      group: '字体',
      label: option.label,
      active: option.key === fontFamily,
      onClick: () => onFontFamilyChange(option.key),
    })),
  ];

  return (
    <header
      className={`${styles.header} ${dock.dragging ? styles.headerDragging : ''}`}
      onPointerDown={dock.onTitlePointerDown}
      title="按住拖动，可把元宝从会议窗口分离出来"
    >
      {/* 头部胶囊：头像 +「元宝 ›」+ 状态副标题，整块可进入状态页 */}
      <span className={styles.pillSlot} data-nodrag>
        <Pressable
          className={`${styles.pill} ${showStatus ? styles.pillWithStatus : ''}`}
          onClick={() => {
            onTouch();
            onOpenStatus();
          }}
          ariaLabel="查看元宝状态"
          title="查看元宝状态"
        >
          <span className={styles.avatarSlot} aria-hidden="true">
            {portrait ? (
              <img className={styles.portrait} src={portrait} alt="" />
            ) : (
              <YuanbaoAvatar className={styles.avatar} mood={mood} replayKey={replayKey} onOnceEnd={onOnceEnd} />
            )}
          </span>
          <span className={styles.pillText}>
            <span className={styles.nameRow}>
              <span className={styles.name}>元宝</span>
              {showStatus && (
                <span className={styles.chevron} aria-hidden="true">
                  <IconTaskEntryIconChevron />
                </span>
              )}
            </span>
            {showStatus && (
              <span className={styles.status} key={statusText} role="status">
                {statusText}
              </span>
            )}
          </span>
        </Pressable>
      </span>

      <div className={styles.actions} data-nodrag>
        <div className={styles.moreWrap}>
          <Pressable
            className={styles.iconButton}
            onClick={() => setMenuOpen((open) => !open)}
            title="更多"
            ariaLabel="更多操作"
          >
            <IconAgentMore />
          </Pressable>
          {menuOpen && <PopMenu items={moreItems} onClose={() => setMenuOpen(false)} />}
        </div>
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
            <IconAgentPip />
          )}
        </Pressable>
        <Pressable className={styles.iconButton} onClick={onClose} title="关闭元宝" ariaLabel="关闭元宝">
          <IconAgentClose />
        </Pressable>
      </div>
    </header>
  );
};
