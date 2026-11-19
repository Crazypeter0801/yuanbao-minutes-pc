import React from 'react';

interface IconMembersMicOnProps {
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

/** IconMembersMicOn - Figma nodeId: 504:11266 */
const IconMembersMicOn: React.FC<IconMembersMicOnProps> = React.memo(({
  width = 16,
  height = 16,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M7.99922 10.0002C9.53871 10.0002 10.7992 8.66123 10.7992 7.02592V4.17448C10.7992 2.53916 9.53871 1.2002 7.99922 1.2002C6.45828 1.2002 5.19922 2.53916 5.19922 4.17448V7.02592C5.19922 8.66123 6.45828 10.0002 7.99922 10.0002Z" strokeWidth="1.2" stroke="#B0B6C3"/>
    <path d="M2.80078 6.7998V7.19981C2.80078 10.0717 5.1289 12.3998 8.00078 12.3998C10.8727 12.3998 13.2008 10.0717 13.2008 7.19981V6.7998" strokeWidth="1.2" strokeLinecap="round" stroke="#B0B6C3"/>
    <line x1="7.79922" y1="12.9999" x2="7.79922" y2="14.9999" strokeWidth="1.2" strokeLinecap="round" stroke="#B0B6C3"/>
  </svg>
));

IconMembersMicOn.displayName = 'IconMembersMicOn';

export default IconMembersMicOn;
