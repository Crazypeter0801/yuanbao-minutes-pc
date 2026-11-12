import React from 'react';

interface IconCollapseProps {
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

/** IconCollapse - Figma nodeId: I221:30127;221:23543 */
const IconCollapse: React.FC<IconCollapseProps> = React.memo(({
  width = 6,
  height = 10,
  color = '#7B818F',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 6 10"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M5.00043 0.651805L0.652236 5L5.00043 9.3482" strokeWidth="1.30446" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconCollapse.displayName = 'IconCollapse';

export default IconCollapse;
