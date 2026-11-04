import React from 'react';

interface IconInputChevronProps {
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

/** IconInputChevron - Figma nodeId: 248:12552 */
const IconInputChevron: React.FC<IconInputChevronProps> = React.memo(({
  width = 14,
  height = 16,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 16"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M4.625 6.3125L8 9.6875L11.375 6.3125" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="#A6A6A6"/>
  </svg>
));

IconInputChevron.displayName = 'IconInputChevron';

export default IconInputChevron;
