import React from 'react';

interface IconBar3MoreProps {
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

/** IconBar3More - Figma nodeId: 416:20124 */
const IconBar3More: React.FC<IconBar3MoreProps> = React.memo(({
  width = 60,
  height = 40,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 60 40"
    fill="none"
    className={className}
    {...props}
  >
    <circle cx="23" cy="20.5" r="2" fill="#373C48"/>
    <circle cx="30" cy="20.5" r="2" fill="#373C48"/>
    <circle cx="37" cy="20.5" r="2" fill="#373C48"/>
  </svg>
));

IconBar3More.displayName = 'IconBar3More';

export default IconBar3More;
