import React from 'react';

interface IconStatusTaskRunningProps {
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

/** IconStatusTaskRunning - Figma nodeId: 242:1051 */
const IconStatusTaskRunning: React.FC<IconStatusTaskRunningProps> = React.memo(({
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
    <path d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" strokeWidth="2.2" stroke="#CFEFDF"/>
    <path d="M10 2.5C10.9849 2.5 11.9602 2.69399 12.8701 3.0709C13.7801 3.44781 14.6069 4.00026 15.3033 4.6967C15.9997 5.39314 16.5522 6.21993 16.9291 7.12987C17.306 8.03982 17.5 9.01509 17.5 10" strokeWidth="2.2" strokeLinecap="round" stroke="#00C37A"/>
  </svg>
));

IconStatusTaskRunning.displayName = 'IconStatusTaskRunning';

export default IconStatusTaskRunning;
