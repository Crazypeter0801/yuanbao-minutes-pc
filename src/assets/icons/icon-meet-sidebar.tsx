import React from 'react';

interface IconMeetSidebarProps {
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

/** IconMeetSidebar - Figma nodeId: 245:5865 */
const IconMeetSidebar: React.FC<IconMeetSidebarProps> = React.memo(({
  width = 28,
  height = 28,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 28 28"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M8.5 20.5H19.5C20.0523 20.5 20.5 20.0523 20.5 19.5V8.5C20.5 7.94772 20.0523 7.5 19.5 7.5H8.5C7.94772 7.5 7.5 7.94772 7.5 8.5V19.5C7.5 20.0523 7.94772 20.5 8.5 20.5Z" strokeWidth="1.2" stroke="#4E5461"/>
    <rect x="16" y="8" width="4" height="12" fill="#4E5461"/>
  </svg>
));

IconMeetSidebar.displayName = 'IconMeetSidebar';

export default IconMeetSidebar;
