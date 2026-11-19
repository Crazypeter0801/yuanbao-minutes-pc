import React from 'react';

interface IconSide3TasksProps {
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

/** IconSide3Tasks - Figma nodeId: 533:13569 */
const IconSide3Tasks: React.FC<IconSide3TasksProps> = React.memo(({
  width = 16,
  height = 16,
  color = 'currentColor', // Figma: #black
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    {...props}
  >
    <rect opacity="0.6" x="1.5" y="1.5" width="3" height="3" rx="1" fill={color}/>
    <rect opacity="0.6" x="6.5" y="1.5" width="3" height="3" rx="1" fill={color}/>
    <rect x="11.5" y="1.5" width="3" height="3" rx="1" fill={color}/>
    <rect opacity="0.2" x="1.5" y="6.5" width="3" height="3" rx="1" fill={color}/>
    <rect opacity="0.2" x="6.5" y="6.5" width="3" height="3" rx="1" fill={color}/>
    <rect x="11.5" y="6.5" width="3" height="3" rx="1" fill={color}/>
    <rect opacity="0.2" x="1.5" y="11.5" width="3" height="3" rx="1" fill={color}/>
    <rect opacity="0.2" x="6.5" y="11.5" width="3" height="3" rx="1" fill={color}/>
    <rect opacity="0.4" x="11.5" y="11.5" width="3" height="3" rx="1" fill={color}/>
  </svg>
));

IconSide3Tasks.displayName = 'IconSide3Tasks';

export default IconSide3Tasks;
