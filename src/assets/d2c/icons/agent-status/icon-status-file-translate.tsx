import React from 'react';

interface IconStatusFileTranslateProps {
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

/** IconStatusFileTranslate - Figma nodeId: I243:1502;242:1112 */
const IconStatusFileTranslate: React.FC<IconStatusFileTranslateProps> = React.memo(({
  width = 36,
  height = 36,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 36 36"
    fill="none"
    className={className}
    {...props}
  >
    <rect width="36" height="36" rx="10" fill="#E8F0FF"/>
    <path d="M14 11.5H20.5L23.5 14.5V23.5C23.5 24.05 23.05 24.5 22.5 24.5H14C13.45 24.5 13 24.05 13 23.5V12.5C13 11.95 13.45 11.5 14 11.5Z" strokeWidth="1.5" strokeLinejoin="round" stroke="#3B6FE8"/>
    <path d="M15.7998 17.5H20.1998M15.7998 20.5H18.9998" strokeWidth="1.5" strokeLinecap="round" stroke="#3B6FE8"/>
  </svg>
));

IconStatusFileTranslate.displayName = 'IconStatusFileTranslate';

export default IconStatusFileTranslate;
