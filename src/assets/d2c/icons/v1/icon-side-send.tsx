import React from 'react';

interface IconSideSendProps {
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

/** IconSideSend - Figma nodeId: 316:2770 */
const IconSideSend: React.FC<IconSideSendProps> = React.memo(({
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
    <path d="M0 14C0 6.26801 6.26801 0 14 0C21.732 0 28 6.26801 28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14Z" fill="#666666" fillOpacity="0.12"/>
    <path d="M13.9994 19.8332V8.24924M19 12.9668L14.2087 8.25286C14.0931 8.13772 13.9057 8.13772 13.7901 8.25286L9 12.9668" strokeWidth="1.5" strokeLinecap="round" stroke={color}/>
  </svg>
));

IconSideSend.displayName = 'IconSideSend';

export default IconSideSend;
