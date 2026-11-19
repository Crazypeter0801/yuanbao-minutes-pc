import React from 'react';

interface IconTab505MoreProps {
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

/** IconTab505More - Figma nodeId: 505:12597 */
const IconTab505More: React.FC<IconTab505MoreProps> = React.memo(({
  width = 24,
  height = 24,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M7.2002 12C7.20009 12.6627 6.66268 13.2002 6 13.2002C5.33741 13.2001 4.79991 12.6626 4.7998 12C4.7998 11.3373 5.33735 10.7999 6 10.7998C6.66274 10.7998 7.2002 11.3373 7.2002 12ZM13.2002 12C13.2001 12.6627 12.6627 13.2002 12 13.2002C11.3374 13.2001 10.7999 12.6626 10.7998 12C10.7998 11.3373 11.3373 10.7999 12 10.7998C12.6627 10.7998 13.2002 11.3373 13.2002 12ZM19.2002 12C19.2001 12.6627 18.6627 13.2002 18 13.2002C17.3374 13.2001 16.7999 12.6626 16.7998 12C16.7998 11.3373 17.3373 10.7999 18 10.7998C18.6627 10.7998 19.2002 11.3373 19.2002 12Z" fill="#4E5461"/>
  </svg>
));

IconTab505More.displayName = 'IconTab505More';

export default IconTab505More;
