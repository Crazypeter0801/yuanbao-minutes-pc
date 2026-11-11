import React from 'react';

interface IconStatusChevronProps {
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

/** IconStatusChevron - Figma nodeId: I243:1190;242:1150 */
const IconStatusChevron: React.FC<IconStatusChevronProps> = React.memo(({
  width = 16,
  height = 16,
  color = 'currentColor',
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
    <path d="M6 3.5L10.5 8L6 12.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#A9AFBA"/>
  </svg>
));

IconStatusChevron.displayName = 'IconStatusChevron';

export default IconStatusChevron;
