import React from 'react';

interface IconAppTabMoreProps {
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

/** IconAppTabMore - Figma nodeId: 489:10294 */
const IconAppTabMore: React.FC<IconAppTabMoreProps> = React.memo(({
  width = 24,
  height = 24,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 40 40"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M15.2 20C15.1998 20.6626 14.6624 21.2002 13.9998 21.2002C13.3371 21.2002 12.7997 20.6626 12.7996 20C12.7996 19.3373 13.337 18.7998 13.9998 18.7998C14.6625 18.7998 15.2 19.3373 15.2 20ZM21.2 20C21.1998 20.6626 20.6624 21.2002 19.9998 21.2002C19.3371 21.2002 18.7997 20.6626 18.7996 20C18.7996 19.3373 19.337 18.7998 19.9998 18.7998C20.6625 18.7998 21.2 19.3373 21.2 20ZM27.2 20C27.1998 20.6627 26.6624 21.2002 25.9998 21.2002C25.3372 21.2001 24.7997 20.6626 24.7996 20C24.7996 19.3373 25.3371 18.7999 25.9998 18.7998C26.6625 18.7998 27.2 19.3373 27.2 20Z" fill="#4E5461"/>
  </svg>
));

IconAppTabMore.displayName = 'IconAppTabMore';

export default IconAppTabMore;
