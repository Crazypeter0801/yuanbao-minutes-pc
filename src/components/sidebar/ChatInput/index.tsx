import { useCallback, useEffect, useRef, useState, useLayoutEffect, type KeyboardEvent, type FC } from 'react';
import IconInputPlus from '@/assets/d2c/icons/input/icon-input-plus';
import IconMenuFile from '@/assets/d2c/icons/input/icon-menu-file';
import IconMenuImage from '@/assets/d2c/icons/input/icon-menu-image';
import IconMenuMeeting from '@/assets/d2c/icons/input/icon-menu-meeting';
import { Pressable } from '@/components/common/Pressable';
import { SendButton } from '@/components/sidebar/SendButton';
import styles from './index.module.scss';

/** 最多自动撑高到 4 行（14/20） */
const MAX_TEXTAREA_HEIGHT = 80;

/** 添加按钮后的三个入口（Figma AI 搜索 727:60493） */
const TOOLS = [
  { key: 'meeting', label: '选择会议', Icon: IconMenuMeeting },
  { key: 'image', label: '上传图片', Icon: IconMenuImage },
  { key: 'file', label: '本地文件', Icon: IconMenuFile },
] as const;

interface ChatInputProps {
  placeholder: string;
  onSubmit: (text: string) => void;
  /** 点工具入口（选择会议 / 上传图片 / 本地文件），演示里只给 Toast */
  onToolAction?: (label: string) => void;
  /** 输入内容变化回调（供「/」唤起与筛选推荐指令） */
  onValueChange?: (value: string) => void;
  /** 递增时清空输入框（点选指令后清掉「/」） */
  clearSignal?: number;
  /** 推荐指令弹层打开时与弹层一体呈现 */
  commandOpen?: boolean;
  /** 测量输入框高度，供一体化弹层精准留空 */
  onHeightChange?: (height: number) => void;
}

/**
 * 输入框（Figma 36:10521）
 *
 * 一行三段：左侧 28×28 的添加按钮（只有加号，默认无底色，hover 才出浅灰圆底）、中间的输入区、右侧发送按钮。
 * 点添加按钮向上弹出工具浮层（160 宽、圆角 12），三项：选择会议 / 上传图片 / 本地文件。
 * 单行高 48：padding 10、按钮 28；多行时向上撑高，发送按钮贴底。
 * Enter 发送、Shift+Enter 换行；中文输入法组词期间不触发发送。
 */
export const ChatInput: FC<ChatInputProps> = ({
  placeholder,
  onSubmit,
  onToolAction,
  onValueChange,
  clearSignal,
  commandOpen = false,
  onHeightChange,
}) => {
  const [value, setValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canSend = value.trim().length > 0;

  useEffect(() => {
    if (clearSignal) {
      setValue('');
      onValueChange?.('');
    }
  }, [clearSignal, onValueChange]);

  useLayoutEffect(() => {
    const node = wrapRef.current;
    if (!node || !onHeightChange) {
      return undefined;
    }
    const report = () => onHeightChange(node.offsetHeight);
    report();
    const observer = new ResizeObserver(report);
    observer.observe(node);
    return () => observer.disconnect();
  }, [onHeightChange]);

  useLayoutEffect(() => {
    const node = textareaRef.current;
    if (!node) {
      return;
    }
    node.style.height = '0px';
    node.style.height = `${Math.min(node.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [value]);

  // 点浮层外面收起来；点内部不关，交给具体项自己处理
  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }
    const onPointerDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const submit = () => {
    if (!canSend) {
      return;
    }
    onSubmit(value.trim());
    setValue('');
    onValueChange?.('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  const pickTool = (label: string) => {
    setMenuOpen(false);
    // 演示阶段这几个入口只示意，不真的打开文件选择器
    onToolAction?.(label);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      {menuOpen && (
        <div className={styles.menu} role="menu" aria-label="添加内容">
          {TOOLS.map(({ key, label, Icon }) => (
            <Pressable
              key={key}
              className={styles.menuItem}
              onClick={() => pickTool(label)}
              ariaLabel={label}
            >
              <span className={styles.menuIcon} aria-hidden="true">
                <Icon />
              </span>
              <span className={styles.menuLabel}>{label}</span>
            </Pressable>
          ))}
        </div>
      )}

      <div className={`${styles.input} ${commandOpen ? styles.inputIntegrated : ''}`}>
        <div className={styles.field}>
          <Pressable
            className={`${styles.add} ${menuOpen ? styles.addActive : ''}`}
            onClick={toggleMenu}
            title="添加"
            ariaLabel="添加"
            ariaExpanded={menuOpen}
          >
            <IconInputPlus />
          </Pressable>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            rows={1}
            value={value}
            placeholder={placeholder}
            onChange={(event) => {
              const next = event.target.value;
              setValue(next);
              onValueChange?.(next);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <SendButton enabled={canSend} onClick={submit} />
      </div>
    </div>
  );
};
