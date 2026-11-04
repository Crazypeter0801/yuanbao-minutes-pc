import React from 'react';

interface IconBArrowProps {
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

/** IconBArrow - Figma nodeId: 248:14048 */
const IconBArrow: React.FC<IconBArrowProps> = React.memo(({
  width = 12,
  height = 36,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 12 36"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M3 18.75L6.00049 15.75L9 18.75" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="#1A1A1A"/>
  </svg>
));

IconBArrow.displayName = 'IconBArrow';

export default IconBArrow;
