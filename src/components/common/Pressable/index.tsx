import type { FC, KeyboardEvent, MouseEvent, ReactNode } from 'react';

interface PressableProps {
  /** 点击回调 */
  onClick?: () => void;
  /** 外层类名，由调用方用 CSS Modules 传入 */
  className?: string;
  /** 鼠标悬浮提示 */
  title?: string;
  /** 读屏标签（无文字的纯图标按钮必填） */
  ariaLabel?: string;
  /** 禁用后不响应点击与键盘 */
  disabled?: boolean;
  /** 渲染的标签；放在 <p> 等行内上下文里时用 span，避免非法嵌套 */
  as?: 'div' | 'span';
  /** 阻止点击冒泡（嵌在另一个可点击区域里时使用） */
  stopPropagation?: boolean;
  children: ReactNode;
}

/**
 * 无样式可点击容器
 * 设计规范禁止使用原生 <button>（默认样式难以清除），统一用 div/span + role 提供语义与键盘支持。
 */
export const Pressable: FC<PressableProps> = ({
  onClick,
  className,
  title,
  ariaLabel,
  disabled = false,
  as: Tag = 'div',
  stopPropagation = false,
  children,
}) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (stopPropagation) {
        event.stopPropagation();
      }
      onClick?.();
    }
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    if (!disabled) {
      onClick?.();
    }
  };

  return (
    <Tag
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      title={title}
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </Tag>
  );
};
