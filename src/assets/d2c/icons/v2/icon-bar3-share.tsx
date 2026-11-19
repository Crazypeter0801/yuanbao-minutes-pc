import React from 'react';

interface IconBar3ShareProps {
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

/** IconBar3Share - Figma nodeId: 416:20081 */
const IconBar3Share: React.FC<IconBar3ShareProps> = React.memo(({
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
    <path d="M24.5996 12C26.8398 12 27.9608 11.9996 28.8164 12.4355C29.5689 12.819 30.181 13.4311 30.5645 14.1836C31.0004 15.0392 31 16.1602 31 18.4004V18.5996C31 20.8398 31.0004 21.9608 30.5645 22.8164C30.181 23.5689 29.5689 24.181 28.8164 24.5645C27.9608 25.0004 26.8398 25 24.5996 25H19.4004C17.1602 25 16.0392 25.0004 15.1836 24.5645C14.4311 24.181 13.819 23.5689 13.4355 22.8164C12.9996 21.9608 13 20.8398 13 18.5996V18.4004C13 16.1602 12.9996 15.0392 13.4355 14.1836C13.819 13.4311 14.4311 12.819 15.1836 12.4355C16.0392 11.9996 17.1602 12 19.4004 12H24.5996ZM22.5303 16.4697C22.2374 16.1768 21.7626 16.1768 21.4697 16.4697L18.1816 19.7578C18.0648 19.8749 18.0647 20.0645 18.1816 20.1816L18.8184 20.8184C18.9355 20.9353 19.1251 20.9352 19.2422 20.8184L21.7881 18.2725C21.9052 18.1557 22.0948 18.1557 22.2119 18.2725L24.7578 20.8184C24.8749 20.9352 25.0645 20.9353 25.1816 20.8184L25.8184 20.1816C25.9353 20.0645 25.9352 19.8749 25.8184 19.7578L22.5303 16.4697Z" fill="#373C48"/>
    <path d="M26.5 28C26.5 28.5523 26.0523 29 25.5 29H18.5C17.9477 29 17.5 28.5523 17.5 28C17.5 27.4477 17.9477 27 18.5 27H25.5C26.0523 27 26.5 27.4477 26.5 28Z" fillRule="evenodd" clipRule="evenodd" fill="#373C48"/>
    <path d="M41.5 20.5L44.0004 18L46.5 20.5" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconBar3Share.displayName = 'IconBar3Share';

export default IconBar3Share;
