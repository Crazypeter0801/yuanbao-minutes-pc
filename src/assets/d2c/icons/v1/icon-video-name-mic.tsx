import React from 'react';

interface IconVideoNameMicProps {
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

/** IconVideoNameMic - Figma nodeId: I316:2002;144:17638 */
const IconVideoNameMic: React.FC<IconVideoNameMicProps> = React.memo(({
  width = 10,
  height = 13,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 10 13"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M1.72431 3.51388C1.72431 1.57322 3.14021 0 4.88681 0C6.6334 0 8.0493 1.57322 8.0493 3.51388V5.62187C8.0493 7.56254 6.6334 9.13576 4.88681 9.13576C3.14021 9.13576 1.72431 7.56254 1.72431 5.62187V3.51388Z" fill="white"/>
    <path d="M8.39935 7.6499C8.4451 7.54309 8.56498 7.48601 8.67422 7.52534L9.64705 7.87947C9.75639 7.91926 9.81357 8.0405 9.76956 8.14816C9.0667 9.86125 7.48647 11.1201 5.58687 11.3704V12.789C5.5868 12.9053 5.49223 13 5.37583 13H4.39167C4.27554 12.9997 4.18173 12.9051 4.18166 12.789V11.3683C2.28914 11.113 0.715262 9.85652 0.0144124 8.14816C-0.0294663 8.04061 0.0277863 7.91934 0.136918 7.87947L1.10976 7.52534C1.21912 7.48567 1.33983 7.54294 1.38565 7.6499C1.96864 9.0106 3.32005 9.9619 4.89199 9.96207C6.46412 9.96207 7.81633 9.01076 8.39935 7.6499Z" fill="white"/>
  </svg>
));

IconVideoNameMic.displayName = 'IconVideoNameMic';

export default IconVideoNameMic;
