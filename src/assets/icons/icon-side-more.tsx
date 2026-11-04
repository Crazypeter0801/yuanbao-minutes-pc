import React from 'react';

interface IconSideMoreProps {
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

/** IconSideMore - Figma nodeId: 245:5607 */
const IconSideMore: React.FC<IconSideMoreProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M6 10C6 10.5523 5.55229 11 5 11C4.44772 11 4 10.5523 4 10C4 9.44771 4.44772 9 5 9C5.55229 9 6 9.44771 6 10ZM11 10C11 10.5523 10.5523 11 10 11C9.44772 11 9 10.5523 9 10C9 9.44771 9.44772 9 10 9C10.5523 9 11 9.44772 11 10ZM16 10C16 10.5523 15.5523 11 15 11C14.4477 11 14 10.5523 14 10C14 9.44772 14.4477 9 15 9C15.5523 9 16 9.44772 16 10Z" fill="#4E5461"/>
  </svg>
));

IconSideMore.displayName = 'IconSideMore';

export default IconSideMore;
