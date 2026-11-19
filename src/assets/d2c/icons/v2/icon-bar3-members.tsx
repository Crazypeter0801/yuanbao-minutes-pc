import React from 'react';

interface IconBar3MembersProps {
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

/** IconBar3Members - Figma nodeId: 416:20094 */
const IconBar3Members: React.FC<IconBar3MembersProps> = React.memo(({
  width = 60,
  height = 40,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 60 40"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M17 22C14.6324 22 12.8629 22.7478 11.8799 23.2988C11.2975 23.6253 11 24.261 11 24.9287V25.5C11 26.3284 11.6716 27 12.5 27H16V25.4053C16 24.2355 16.526 23.0085 17.6836 22.3594C17.8512 22.2654 18.0342 22.1676 18.2324 22.0684C17.8422 22.0245 17.431 22 17 22Z" fill="#373C48"/>
    <path d="M14 18C14 19.6569 15.3431 21 17 21C18.6569 21 20 19.6569 20 18C20 16.3431 18.6569 15 17 15C15.3431 15 14 16.3431 14 18Z" fill="#373C48"/>
    <path d="M25 21.5C22.1894 21.5 20.0107 22.2896 18.6416 22.9814C18.4592 23.0736 18.3678 23.1201 18.124 23.3154C17.6954 23.659 17.1778 24.5006 17.0645 25.0381C17 25.3439 17 25.5409 17 25.9346C17 26.4605 17.0002 26.7236 17.0654 26.9375C17.2111 27.4152 17.5848 27.7889 18.0625 27.9346C18.2764 27.9998 18.5395 28 19.0654 28H30.9346C31.4605 28 31.7236 27.9998 31.9375 27.9346C32.4152 27.7889 32.7889 27.4152 32.9346 26.9375C32.9998 26.7236 33 26.4605 33 25.9346C33 25.5409 33 25.3439 32.9355 25.0381C32.8222 24.5006 32.3046 23.659 31.876 23.3154C31.6322 23.1201 31.5408 23.0736 31.3584 22.9814C29.9893 22.2896 27.8106 21.5 25 21.5ZM25 12C22.7909 12 21 13.7909 21 16C21 18.2091 22.7909 20 25 20C27.2091 20 29 18.2091 29 16C29 13.7909 27.2091 12 25 12Z" fill="#373C48"/>
    <rect x="21" y="12" width="8" height="8" rx="4" fill="#373C48"/>
    <rect x="14" y="15" width="6" height="6" rx="3" fill="#373C48"/>
    <path d="M41.5 20.5L44.0004 18L46.5 20.5" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconBar3Members.displayName = 'IconBar3Members';

export default IconBar3Members;
