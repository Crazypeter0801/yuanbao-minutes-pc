import React from 'react';

interface IconMeetGridProps {
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

/** IconMeetGrid - Figma nodeId: 245:5827 */
const IconMeetGrid: React.FC<IconMeetGridProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M3 10V15C3 15.5523 3.44772 16 4 16H10M3 10V5C3 4.44772 3.44772 4 4 4H10M3 10H17M17 10V5C17 4.44772 16.5523 4 16 4H10M17 10V15C17 15.5523 16.5523 16 16 16H10M10 4V16" strokeWidth="1.2" stroke="#373C48"/>
  </svg>
));

IconMeetGrid.displayName = 'IconMeetGrid';

export default IconMeetGrid;
