import React from 'react';

interface IconNoteCollapseProps {
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

/** IconNoteCollapse - Figma nodeId: 318:7196 */
const IconNoteCollapse: React.FC<IconNoteCollapseProps> = React.memo(({
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
    <path d="M2.25 2.25L6 6M6 6L9.75 9.75M6 6L2.25 9.75M6 6L9.75 2.25" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconNoteCollapse.displayName = 'IconNoteCollapse';

export default IconNoteCollapse;
