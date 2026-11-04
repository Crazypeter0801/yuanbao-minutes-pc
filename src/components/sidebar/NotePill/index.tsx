import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import IconNoteCollapse from '@/assets/d2c/icons/v1/icon-note-collapse';
import IconNotePause from '@/assets/d2c/icons/v1/icon-note-pause';
import IconNotePlay from '@/assets/d2c/icons/v1/icon-note-play';
import IconNoteScreenshot from '@/assets/d2c/icons/v1/icon-note-screenshot';
import { Pressable } from '@/components/common/Pressable';
import { AssistantMessageView } from '@/components/sidebar/AssistantMessageView';
import { NoteStar } from '@/components/sidebar/NoteStar';
import type { AssistantMessage } from '@/types/chat';
import styles from './index.module.scss';

interface NotePillProps {
  /** 是否正在记笔记 */
  isListening: boolean;
  /** 展开态由父级控制：提问时要先收起面板，否则回答会被面板挡住 */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** 元宝主动记下的笔记，展开后按时间顺序列出 */
  notes: AssistantMessage[];
  /** 保存截图 */
  onScreenshot: () => void;
  /** 暂停 / 继续 */
  onToggleListening: () => void;
  /** 点击笔记里的「查看原文」 */
  onOpenSource?: () => void;
}

/** 展开后的面板高度（Figma 318:6576） */
const PANEL_HEIGHT = 400;

/**
 * 「元宝正在记笔记」状态条（收起 Figma 317:6060 / 318:6099，展开 Figma 318:6576）
 * - 收起：196×36 胶囊，星标 + 状态文案 + 截图 / 暂停两个圆形图标按钮；
 * - 点击整条（除两个按钮外）展开成 400 高的卡片，列出元宝主动记下的内容；
 * - 展开时胶囊从左下角向右、向上生长，内容在尺寸到位前淡入；点右上角「收起」、再点标题行或按 Esc 收起。
 * 面板贴底向上展开，浮在消息流之上，不挤压输入框和对话。
 */
export const NotePill: FC<NotePillProps> = ({
  isListening,
  expanded,
  onExpandedChange,
  notes,
  onScreenshot,
  onToggleListening,
  onOpenSource,
}) => {
  const [panelWidth, setPanelWidth] = useState(0);
  const slotRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => onExpandedChange(!expanded), [expanded, onExpandedChange]);
  const collapse = useCallback(() => onExpandedChange(false), [onExpandedChange]);

  // 展开宽度 = 底栏内容宽度；量成 px 才能和收起的 196px 平滑过渡，内容区也按最终宽度排版，动画中不重排
  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) {
      return undefined;
    }
    const measure = () => setPanelWidth(slot.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  // 展开时定位到最新一条；展开期间有新笔记也跟到底部
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (expanded && body) {
      body.scrollTop = body.scrollHeight;
    }
  }, [expanded, notes.length]);

  useEffect(() => {
    if (!expanded) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        collapse();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expanded, collapse]);

  const vars = {
    '--note-panel-width': `${panelWidth}px`,
    '--note-panel-height': `${PANEL_HEIGHT}px`,
  } as CSSProperties;

  return (
    <div className={`${styles.slot} ${expanded ? styles.slotExpanded : ''}`} ref={slotRef} style={vars}>
      <div className={`${styles.card} ${expanded ? styles.cardExpanded : ''}`}>
        {/* 标题行：整行都是展开 / 收起的热区（键盘焦点落在左侧文案上） */}
        <div className={styles.header} onClick={toggle} role="presentation">
          <Pressable
            className={styles.summary}
            onClick={toggle}
            stopPropagation
            ariaExpanded={expanded}
            ariaLabel={expanded ? '收起元宝笔记' : '展开元宝笔记'}
          >
            <NoteStar playing={isListening} />
            {/* 暂停文案沿用 Figma 318:7200 原文，不要改成「已暂停记笔记」 */}
            <span className={styles.text}>{isListening ? '元宝正在记笔记... ' : '元宝休息中'}</span>
          </Pressable>
          <div className={styles.actions}>
            <Pressable
              className={styles.iconButton}
              onClick={onScreenshot}
              stopPropagation
              title="保存截图"
              ariaLabel="保存截图"
            >
              <IconNoteScreenshot />
            </Pressable>
            <Pressable
              className={styles.iconButton}
              onClick={onToggleListening}
              stopPropagation
              title={isListening ? '暂停记笔记' : '继续记笔记'}
              ariaLabel={isListening ? '暂停记录' : '继续记录'}
            >
              {isListening ? <IconNotePause /> : <IconNotePlay />}
            </Pressable>
          </div>
          {/* 右上角是「收起」（Figma 320:7230 Minimize 2），不是关闭：收起后纪要与侧栏都还在 */}
          <Pressable
            className={styles.collapse}
            onClick={collapse}
            stopPropagation
            disabled={!expanded}
            title="收起"
            ariaLabel="收起笔记面板"
          >
            <IconNoteCollapse />
          </Pressable>
        </div>

        <div className={`${styles.body} wm-scroll-hidden`} ref={bodyRef} aria-hidden={!expanded}>
          {notes.length > 0 ? (
            notes.map((note) => (
              <AssistantMessageView key={note.id} message={note} shape="round" onOpenSource={onOpenSource} />
            ))
          ) : (
            <p className={styles.empty}>元宝还没有记下内容，会议中的要点会自动出现在这里。</p>
          )}
        </div>
      </div>
    </div>
  );
};
