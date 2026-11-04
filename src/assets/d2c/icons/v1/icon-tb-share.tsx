import React from 'react';

interface IconTbShareProps {
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

/** IconTbShare - Figma nodeId: 316:2074 */
const IconTbShare: React.FC<IconTbShareProps> = React.memo(({
  width = 64,
  height = 44,
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
    <rect x="44" y="32" width="12" height="12" rx="6" fill="white" fillOpacity="0.01"/>
    <path d="M34.5996 7C36.8398 7 37.9608 6.99957 38.8164 7.43555C39.5689 7.81902 40.181 8.43109 40.5645 9.18359C41.0004 10.0392 41 11.1602 41 13.4004V13.5996C41 15.8398 41.0004 16.9608 40.5645 17.8164C40.181 18.5689 39.5689 19.181 38.8164 19.5645C37.9608 20.0004 36.8398 20 34.5996 20H29.4004C27.1602 20 26.0392 20.0004 25.1836 19.5645C24.4311 19.181 23.819 18.5689 23.4355 17.8164C22.9996 16.9608 23 15.8398 23 13.5996V13.4004C23 11.1602 22.9996 10.0392 23.4355 9.18359C23.819 8.43109 24.4311 7.81902 25.1836 7.43555C26.0392 6.99957 27.1602 7 29.4004 7H34.5996ZM32.5303 11.4697C32.2374 11.1768 31.7626 11.1768 31.4697 11.4697L28.1816 14.7578C28.0648 14.8749 28.0647 15.0645 28.1816 15.1816L28.8184 15.8184C28.9355 15.9353 29.1251 15.9352 29.2422 15.8184L31.7881 13.2725C31.9052 13.1557 32.0948 13.1557 32.2119 13.2725L34.7578 15.8184C34.8749 15.9352 35.0645 15.9353 35.1816 15.8184L35.8184 15.1816C35.9353 15.0645 35.9352 14.8749 35.8184 14.7578L32.5303 11.4697Z" fill="#373C48"/>
    <path d="M36.5 23C36.5 23.5523 36.0523 24 35.5 24H28.5C27.9477 24 27.5 23.5523 27.5 23C27.5 22.4477 27.9477 22 28.5 22H35.5C36.0523 22 36.5 22.4477 36.5 23Z" fillRule="evenodd" clipRule="evenodd" fill="#373C48"/>
    <path d="M51.5 15.5L54.0004 13L56.5 15.5" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconTbShare.displayName = 'IconTbShare';

export default IconTbShare;
