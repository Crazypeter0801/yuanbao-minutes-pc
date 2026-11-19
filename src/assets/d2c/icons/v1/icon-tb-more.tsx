import React from 'react';

interface IconTbMoreProps {
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

/** IconTbMore - Figma nodeId: 316:2113 */
const IconTbMore: React.FC<IconTbMoreProps> = React.memo(({
  width = 56,
  height = 31,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 56 31"
    fill="none"
    className={className}
    {...props}
  >
    <circle cx="21" cy="15.5" r="2" fill="#373C48"/>
    <circle cx="28" cy="15.5" r="2" fill="#373C48"/>
    <circle cx="35" cy="15.5" r="2" fill="#373C48"/>
  </svg>
));

IconTbMore.displayName = 'IconTbMore';

export default IconTbMore;
