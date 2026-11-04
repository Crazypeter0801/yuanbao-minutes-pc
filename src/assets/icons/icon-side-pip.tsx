import React from 'react';

interface IconSidePipProps {
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

/** IconSidePip - Figma nodeId: 245:5597 */
const IconSidePip: React.FC<IconSidePipProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    {...props}
  >
    <g clipPath="url(#clip0_245_5597)">
    <path d="M7.50146 4.53333H5.50146C5.22532 4.53333 5.00146 4.75718 5.00146 5.03333V14.5333C5.00146 15.0856 5.44918 15.5333 6.00146 15.5333H14.5015C14.7776 15.5333 15.0015 15.3095 15.0015 15.0333V11.9996" strokeWidth="1.2" strokeLinecap="round" stroke="#4E5461"/>
    <path d="M10.2015 9.53333H14.8015C14.9119 9.53333 15.0015 9.44378 15.0015 9.33333V4.73333C15.0015 4.62287 14.9119 4.53333 14.8015 4.53333H10.2015C10.091 4.53333 10.0015 4.62287 10.0015 4.73333V9.33333C10.0015 9.44378 10.091 9.53333 10.2015 9.53333Z" strokeWidth="1.2" stroke="#4E5461"/>
    </g>
    <defs>
    <clipPath id="clip0_245_5597">
    <rect width="13.3333" height="13.3333" fill="white" transform="translate(3.3335 3.33337)"/>
    </clipPath>
    </defs>
  </svg>
));

IconSidePip.displayName = 'IconSidePip';

export default IconSidePip;
