import type { FC } from 'react';
import IconAgentClose from '@/assets/d2c/icons/agent/icon-agent-close';
import IconAgentPip from '@/assets/d2c/icons/agent/icon-agent-pip';
import IconTaskEntryIconChevron from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-chevron';
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
}

/**
 * 元宝窗口标题栏（Figma 215:19389 / 215:21818）
 * 左侧是胶囊（Figma 215:19391 / 294:36996）：头像 +「元宝 ›」+ 副标题。
 * 方案 A 副标题是「正在记笔记...」，方案 B 是「正在听...」；
 * 点胶囊进入 Agent 状态页。右侧只有独立窗口和关闭（Figma 215:21862），中性灰图标。
 * 按住标题栏空白处（按钮和胶囊除外）拖动即可把元宝从会议窗口分离出来，拖到会议左 / 右缘松手再吸附回去。
 * 头像用雪碧图跟着任务状态动（Figma 197:42 方案 A：顶部头像集成）。
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
}) => {
  const floating = dock.mode === 'floating';

  return (
    <header
      className={`${styles.header} ${dock.dragging ? styles.headerDragging : ''}`}
      onPointerDown={dock.onTitlePointerDown}
      title="按住拖动，可把元宝从会议窗口分离出来"
    >
      {/* 头部胶囊：头像 +「元宝 ›」（方案 A 再带一行状态），整块可进入状态页 */}
      <span className={styles.pillSlot} data-nodrag>
        <Pressable
          className={styles.pill}
          onClick={() => {
            // 保留摸头反馈；状态页会盖住对话区，动画在返回后继续按状态机收尾
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
              <span className={styles.chevron} aria-hidden="true">
                <IconTaskEntryIconChevron />
              </span>
            </span>
            {/* key 跟着文案变：换状态时淡入一次。两套方案都有副标题 */}
            <span className={styles.status} key={statusText} role="status">
              {statusText}
            </span>
          </span>
        </Pressable>
      </span>

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
        {/* 关闭图标左侧自带 4 的间距（Figma 215:21871），按钮宽 24、hover 底只铺右侧 20 */}
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
