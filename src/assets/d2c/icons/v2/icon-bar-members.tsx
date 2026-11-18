import React from 'react';

interface IconBarMembersProps {
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

/** IconBarMembers - Figma nodeId: 416:20094 */
const IconBarMembers: React.FC<IconBarMembersProps> = React.memo(({
  width = 64,
  height = 30,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 64 44"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M27 17C24.6324 17 22.8629 17.7478 21.8799 18.2988C21.2975 18.6253 21 19.261 21 19.9287V20.5C21 21.3284 21.6716 22 22.5 22H26V20.4053C26 19.2355 26.526 18.0085 27.6836 17.3594C27.8512 17.2654 28.0342 17.1676 28.2324 17.0684C27.8422 17.0245 27.431 17 27 17Z" fill="#373C48"/>
    <path d="M24 13C24 14.6569 25.3431 16 27 16C28.6569 16 30 14.6569 30 13C30 11.3431 28.6569 10 27 10C25.3431 10 24 11.3431 24 13Z" fill="#373C48"/>
    <path d="M35 16.5C32.1894 16.5 30.0107 17.2896 28.6416 17.9814C28.4592 18.0736 28.3678 18.1201 28.124 18.3154C27.6954 18.659 27.1778 19.5006 27.0645 20.0381C27 20.3439 27 20.5409 27 20.9346C27 21.4605 27.0002 21.7236 27.0654 21.9375C27.2111 22.4152 27.5848 22.7889 28.0625 22.9346C28.2764 22.9998 28.5395 23 29.0654 23H40.9346C41.4605 23 41.7236 22.9998 41.9375 22.9346C42.4152 22.7889 42.7889 22.4152 42.9346 21.9375C42.9998 21.7236 43 21.4605 43 20.9346C43 20.5409 43 20.3439 42.9355 20.0381C42.8222 19.5006 42.3046 18.659 41.876 18.3154C41.6322 18.1201 41.5408 18.0736 41.3584 17.9814C39.9893 17.2896 37.8106 16.5 35 16.5ZM35 7C32.7909 7 31 8.79086 31 11C31 13.2091 32.7909 15 35 15C37.2091 15 39 13.2091 39 11C39 8.79086 37.2091 7 35 7Z" fill="#373C48"/>
    <rect x="31" y="7" width="8" height="8" rx="4" fill="#373C48"/>
    <rect x="24" y="10" width="6" height="6" rx="3" fill="#373C48"/>
    <path d="M51.5 15.5L54.0004 13L56.5 15.5" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconBarMembers.displayName = 'IconBarMembers';

export default IconBarMembers;
