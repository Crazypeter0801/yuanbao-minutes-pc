import React from 'react';

interface IconChatSendProps {
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

/** IconChatSend - Figma nodeId: I504:12116;924:78795 */
const IconChatSend: React.FC<IconChatSendProps> = React.memo(({
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
    <path d="M0 14C0 6.26801 6.26801 0 14 0C21.732 0 28 6.26801 28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14Z" fill="#D3D6DB"/>
    <path d="M13.9994 20V8.0851M19 12.9374L14.2087 8.08882C14.0931 7.97039 13.9057 7.97039 13.7901 8.08882L9 12.9374" strokeWidth="1.5" strokeLinecap="round" stroke={color}/>
  </svg>
));

IconChatSend.displayName = 'IconChatSend';

export default IconChatSend;
