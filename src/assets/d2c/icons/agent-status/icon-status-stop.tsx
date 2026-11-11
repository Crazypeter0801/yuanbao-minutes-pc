import React from 'react';

interface IconStatusStopProps {
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

/** IconStatusStop - Figma nodeId: 250:1247 */
const IconStatusStop: React.FC<IconStatusStopProps> = React.memo(({
  width = 24,
  height = 24,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <rect width="24" height="24" rx="12" fill="#1F2329"/>
    <g clipPath="url(#clip0_250_1247)">
    <path d="M15.6 6H8.4C7.07452 6 6 7.07452 6 8.4V15.6C6 16.9255 7.07452 18 8.4 18H15.6C16.9255 18 18 16.9255 18 15.6V8.4C18 7.07452 16.9255 6 15.6 6Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_250_1247">
    <rect width="12" height="12" fill="white" transform="translate(6 6)"/>
    </clipPath>
    </defs>
  </svg>
));

IconStatusStop.displayName = 'IconStatusStop';

export default IconStatusStop;
