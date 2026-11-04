import React from 'react';

interface IconTbArrowProps {
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

/** IconTbArrow - Figma nodeId: 316:2103 */
const IconTbArrow: React.FC<IconTbArrowProps> = React.memo(({
  width = 12,
  height = 24,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 12 24"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M3.5 12.5L6.00041 10L8.5 12.5" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconTbArrow.displayName = 'IconTbArrow';

export default IconTbArrow;
