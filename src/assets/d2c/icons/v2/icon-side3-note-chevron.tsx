import React from 'react';

interface IconSide3NoteChevronProps {
  /** 图标宽度，默认与 Figma 设计稿一致 */
  width?: number;
  /** 图标高度，默认与 Figma 设计稿一致 */
  height?: number;
  /** 图标主题色，单色图标默认 currentColor（继承父元素 color） */
  color?: string;
  /** 自定义 className */
  className?: string;
  [key: string]: unknown;
}

/** IconSide3NoteChevron - Figma nodeId: 416:20806 */
const IconSide3NoteChevron: React.FC<IconSide3NoteChevronProps> = React.memo(({
  width = 18,
  height = 18,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M7.125 13.5L11.625 9L7.125 4.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="#7B818F"/>
  </svg>
));

IconSide3NoteChevron.displayName = 'IconSide3NoteChevron';

export default IconSide3NoteChevron;
