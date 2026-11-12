import React from 'react';

interface IconTaskEntryIconChevronProps {
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

/** IconTaskEntryIconChevron - Figma nodeId: 215:19431 */
const IconTaskEntryIconChevron: React.FC<IconTaskEntryIconChevronProps> = React.memo(({
  width = 3,
  height = 8,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 4 9"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M0.5 8.5L3.5 4.5L0.5 0.5" strokeLinecap="round" strokeLinejoin="round" stroke="#7B818F"/>
  </svg>
));

IconTaskEntryIconChevron.displayName = 'IconTaskEntryIconChevron';

export default IconTaskEntryIconChevron;
