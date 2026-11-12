import React from 'react';

interface IconZoomOutProps {
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

/** IconZoomOut - Figma nodeId: 221:30086 */
const IconZoomOut: React.FC<IconZoomOutProps> = React.memo(({
  width = 12,
  height = 12,
  color = '#373C48',
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
    <rect x="3" y="5.40039" width="6" height="1.2" rx="0.6" fill={color}/>
  </svg>
));

IconZoomOut.displayName = 'IconZoomOut';

export default IconZoomOut;
