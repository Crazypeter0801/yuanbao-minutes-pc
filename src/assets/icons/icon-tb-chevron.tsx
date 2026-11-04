import React from 'react';

interface IconTbChevronProps {
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

/** IconTbChevron - Figma nodeId: 245:5884 */
const IconTbChevron: React.FC<IconTbChevronProps> = React.memo(({
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
    <path d="M3.5 18.5L6.00041 16L8.5 18.5" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconTbChevron.displayName = 'IconTbChevron';

export default IconTbChevron;
