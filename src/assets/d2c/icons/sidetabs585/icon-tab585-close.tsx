import React from 'react';

interface IconTab585CloseProps {
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

/** IconTab585Close - Figma nodeId: 585:68677 */
const IconTab585Close: React.FC<IconTab585CloseProps> = React.memo(({
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
    <path d="M17.9795 9.17578C18.2132 8.94144 18.5916 8.94122 18.8252 9.17578C19.0589 9.41063 19.0589 9.79149 18.8252 10.0264L14.8457 14.0234L18.8242 18.0215C19.0574 18.2563 19.0575 18.6364 18.8242 18.8711C18.5905 19.1059 18.2113 19.1058 17.9775 18.8711L14 14.874L10.0225 18.8711C9.78879 19.1056 9.41045 19.1056 9.17676 18.8711C8.9431 18.6363 8.94322 18.2554 9.17676 18.0205L13.1533 14.0234L9.17578 10.0264C8.94203 9.79149 8.94203 9.41066 9.17578 9.17578C9.40945 8.94129 9.78781 8.94129 10.0215 9.17578L14 13.1738L17.9795 9.17578Z" fill="#4E5461"/>
  </svg>
));

IconTab585Close.displayName = 'IconTab585Close';

export default IconTab585Close;
