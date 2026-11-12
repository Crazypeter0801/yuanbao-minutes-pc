import React from 'react';

interface IconTitleDividerProps {
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

/** IconTitleDivider - Figma nodeId: 221:30117 */
const IconTitleDivider: React.FC<IconTitleDividerProps> = React.memo(({
  width = 1,
  height = 13,
  color = '#D3D6DB',
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
    <path d="M0.5 0.5V12.5" strokeLinecap="round" stroke={color}/>
  </svg>
));

IconTitleDivider.displayName = 'IconTitleDivider';

export default IconTitleDivider;
