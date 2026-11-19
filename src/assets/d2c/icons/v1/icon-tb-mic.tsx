import React from 'react';

interface IconTbMicProps {
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

/** IconTbMic - Figma nodeId: 316:2049 */
const IconTbMic: React.FC<IconTbMicProps> = React.memo(({
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
    <path d="M27.4617 10.4062C27.4617 7.64483 29.4764 5.40625 31.9617 5.40625C34.447 5.40625 36.4617 7.64483 36.4617 10.4062V13.9062C36.4617 16.6677 34.447 18.9062 31.9617 18.9062C29.4764 18.9062 27.4617 16.6677 27.4617 13.9062V10.4062Z" fill="#373C48"/>
    <path d="M25.9756 16.6943C26.4645 16.5167 26.9988 16.775 27.2589 17.2256C28.1969 18.8506 29.9532 19.9424 31.962 19.9424C33.9704 19.9421 35.7262 18.8503 36.6641 17.2256C36.9243 16.7752 37.4585 16.5166 37.9473 16.6943C38.5338 16.908 38.8432 17.5627 38.544 18.1104C37.4214 20.1625 35.3664 21.6324 32.9473 21.9502V23.4062C32.9473 23.9583 32.4994 24.406 31.9473 24.4062C31.3952 24.4062 30.9474 23.9584 30.9473 23.4062V21.9473C28.5405 21.6218 26.4973 20.1545 25.379 18.1104C25.0795 17.5626 25.3889 16.9079 25.9756 16.6943Z" fill="#373C48"/>
    <path d="M31.7801 18.9023C29.379 18.7964 27.4617 16.6002 27.4617 13.9063V11.9023H36.4617V13.9063C36.4617 16.6002 34.5444 18.7964 32.1433 18.9023H31.7801Z" fillRule="evenodd" clipRule="evenodd" fill="#27D08E"/>
    <path d="M51.5 15.5L54.0004 13L56.5 15.5" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconTbMic.displayName = 'IconTbMic';

export default IconTbMic;
