import React from 'react';

interface IconZoomDividerProps {
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

/** IconZoomDivider - Figma nodeId: 221:30088 */
const IconZoomDivider: React.FC<IconZoomDividerProps> = React.memo(({
  width = 1,
  height = 13,
  color = 'currentColor', // Figma: #black
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 1 13"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M0.5 0.5V12.5" strokeLinecap="round" stroke={color} strokeOpacity="0.1"/>
  </svg>
));

IconZoomDivider.displayName = 'IconZoomDivider';

export default IconZoomDivider;
