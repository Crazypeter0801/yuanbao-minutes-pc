import React from 'react';

interface IconSidePauseProps {
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

/** IconSidePause - Figma nodeId: 246:6315 */
const IconSidePause: React.FC<IconSidePauseProps> = React.memo(({
  width = 36,
  height = 36,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 36 36"
    fill="none"
    className={className}
    {...props}
  >
    <rect width="36" height="36" rx="18" fill="#F3F3F4"/>
    <rect x="13" y="12" width="3" height="12" rx="1.5" fill="#4E5461"/>
    <rect x="20" y="12" width="3" height="12" rx="1.5" fill="#4E5461"/>
  </svg>
));

IconSidePause.displayName = 'IconSidePause';

export default IconSidePause;
