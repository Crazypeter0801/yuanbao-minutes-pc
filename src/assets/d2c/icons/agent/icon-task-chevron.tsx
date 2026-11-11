import React from 'react';

interface IconTaskChevronProps {
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

/** IconTaskChevron - Figma nodeId: I204:328;199:276 */
const IconTaskChevron: React.FC<IconTaskChevronProps> = React.memo(({
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
    <path d="M6 3.5L10.5 8L6 12.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#8F959E"/>
  </svg>
));

IconTaskChevron.displayName = 'IconTaskChevron';

export default IconTaskChevron;
