import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import IconNoteCollapse from '@/assets/d2c/icons/v1/icon-note-collapse';
import IconNotePause from '@/assets/d2c/icons/v1/icon-note-pause';
import IconNotePlay from '@/assets/d2c/icons/v1/icon-note-play';
import { Pressable } from '@/components/common/Pressable';
import { NoteStar } from '@/components/sidebar/NoteStar';
import { commandGroups, type CommandItem } from '@/data/commands';
import styles from './index.module.scss';

interface NotePillProps {
  /** 是否正在记笔记 */
  isListening: boolean;
  /** 展开态由父级控制：提问时要先收起面板，否则回答会被面板挡住 */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** 暂停 / 继续 */
  onToggleListening: () => void;
  /** 点了指令集合里的某一项 */
  onCommand: (item: CommandItem) => void;
}

/** 展开后的卡片宽度：比产物面板窄，够放最长的一条指令即可 */
const PANEL_WIDTH = 240;
/** 卡片内固定占位：上 padding 12 + 标题行 24 */
const PANEL_CHROME = 36;
const PANEL_MIN_HEIGHT = 200;
const PANEL_MAX_HEIGHT = 400;

/**
 * 「元宝正在记笔记」状态条（收起 Figma 36:2249，展开为指令集合）
 *
 * 收起：196×36 胶囊，星标 + 状态文案 + 暂停 / 继续按钮（截图按钮已去掉，
 * 截图能力移到输入框左侧的「截图提问」入口）。
 * 展开：同一张卡向右上方长成 240 宽的面板，动作与产物面板同一套曲线，
 * 只是更窄；面板里是会议常用指令 + 演示场景的快捷入口，点一条就当作用户发了那句话。
 */
export const NotePill: FC<NotePillProps> = ({
  isListening,
  expanded,
  onExpandedChange,
  onToggleListening,
  onCommand,
}) => {
  const [panelHeight, setPanelHeight] = useState(PANEL_MIN_HEIGHT);
  /** 是否还能往下滚：能滚且没到底时，底部加渐隐提示「下面还有」 */
  const [showBottomFade, setShowBottomFade] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => onExpandedChange(!expanded), [expanded, onExpandedChange]);
  const collapse = useCallback(() => onExpandedChange(false), [onExpandedChange]);

  // 面板高度跟着指令条数走：收起态 body 被压扁，scrollHeight 仍是内容全高
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) {
      return;
    }
    const content = PANEL_CHROME + body.scrollHeight;
    setPanelHeight(Math.min(PANEL_MAX_HEIGHT, Math.max(PANEL_MIN_HEIGHT, content)));
  }, [expanded]);

  // 刚展开时从第一条读起
  const prevExpanded = useRef(expanded);
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (body && expanded && !prevExpanded.current) {
      body.scrollTop = 0;
    }
    prevExpanded.current = expanded;
  }, [expanded]);

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

  // 底部渐隐只在「能滚且没滚到底」时出现
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) {
      return undefined;
    }
    const check = () => {
      const scrollable = body.scrollHeight > body.clientHeight + 1;
      const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 1;
      setShowBottomFade(scrollable && !atBottom);
    };
    check();
    body.addEventListener('scroll', check);
    const observer = new ResizeObserver(check);
    observer.observe(body);
    return () => {
      body.removeEventListener('scroll', check);
      observer.disconnect();
    };
  }, [expanded, panelHeight]);

  const vars = {
    '--note-panel-width': `${PANEL_WIDTH}px`,
    '--note-panel-height': `${panelHeight}px`,
  } as CSSProperties;

  return (
    <div className={`${styles.slot} ${expanded ? styles.slotExpanded : ''}`} style={vars}>
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
              onClick={onToggleListening}
              stopPropagation
              title={isListening ? '暂停记笔记' : '继续记笔记'}
              ariaLabel={isListening ? '暂停记录' : '继续记录'}
            >
              {isListening ? <IconNotePause /> : <IconNotePlay />}
            </Pressable>
          </div>
          {/* 右上角是「收起」（Figma 320:7230 Minimize 2），不是关闭 */}
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

        <div
          className={`${styles.body} ${showBottomFade ? styles.bodyOverflowing : ''} wm-scroll-hidden`}
          ref={bodyRef}
          aria-hidden={!expanded}
        >
          {commandGroups.map((group) => (
            <div className={styles.group} key={group.title}>
              <p className={styles.groupTitle}>{group.title}</p>
              <div className={styles.commandList}>
                {group.items.map((item) => (
                  <Pressable
                    key={item.label}
                    className={styles.command}
                    onClick={() => onCommand(item)}
                    ariaLabel={item.label}
                  >
                    <span className={styles.commandText}>{item.label}</span>
                  </Pressable>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
