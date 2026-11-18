import React from 'react';

interface IconTopChevronProps {
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

/** IconTopChevron - Figma nodeId: 439:21100 */
const IconTopChevron: React.FC<IconTopChevronProps> = React.memo(({
  width = 12,
  height = 12,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 10 10"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M2.38281 3.68123L4.70158 6L7.02036 3.68123" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="#373C48"/>
  </svg>
));

IconTopChevron.displayName = 'IconTopChevron';

export default IconTopChevron;
