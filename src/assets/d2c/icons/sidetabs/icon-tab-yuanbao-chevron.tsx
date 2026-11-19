import React from 'react';

interface IconTabYuanbaoChevronProps {
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

/** IconTabYuanbaoChevron - Figma nodeId: 541:13598 */
const IconTabYuanbaoChevron: React.FC<IconTabYuanbaoChevronProps> = React.memo(({
  width = 3,
  height = 8,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 5 10"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M0.789474 9.21053L3.94737 5L0.789474 0.789474" strokeWidth="1.57895" strokeLinecap="round" strokeLinejoin="round" stroke="#B0B6C3"/>
  </svg>
));

IconTabYuanbaoChevron.displayName = 'IconTabYuanbaoChevron';

export default IconTabYuanbaoChevron;
