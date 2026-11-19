import React from 'react';

interface IconNoteChevronProps {
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

/** IconNoteChevron - Figma nodeId: 416:20806 */
const IconNoteChevron: React.FC<IconNoteChevronProps> = React.memo(({
  width = 12,
  height = 12,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 12 12"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M4.75 9L7.75 6L4.75 3" strokeLinecap="round" strokeLinejoin="round" stroke="#7B818F"/>
  </svg>
));

IconNoteChevron.displayName = 'IconNoteChevron';

export default IconNoteChevron;
