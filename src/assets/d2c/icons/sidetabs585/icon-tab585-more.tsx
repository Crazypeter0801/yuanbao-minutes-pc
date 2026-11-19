import React from 'react';

interface IconTab585MoreProps {
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

/** IconTab585More - Figma nodeId: 585:68666 */
const IconTab585More: React.FC<IconTab585MoreProps> = React.memo(({
  width = 28,
  height = 28,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 28 28"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M10 14C10 14.5523 9.55229 15 9 15C8.44772 15 8 14.5523 8 14C8 13.4477 8.44772 13 9 13C9.55229 13 10 13.4477 10 14ZM15 14C15 14.5523 14.5523 15 14 15C13.4477 15 13 14.5523 13 14C13 13.4477 13.4477 13 14 13C14.5523 13 15 13.4477 15 14ZM20 14C20 14.5523 19.5523 15 19 15C18.4477 15 18 14.5523 18 14C18 13.4477 18.4477 13 19 13C19.5523 13 20 13.4477 20 14Z" fill="#4E5461"/>
  </svg>
));

IconTab585More.displayName = 'IconTab585More';

export default IconTab585More;
