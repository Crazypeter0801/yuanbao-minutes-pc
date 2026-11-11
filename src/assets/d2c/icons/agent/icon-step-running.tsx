import React from 'react';

interface IconStepRunningProps {
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

/** IconStepRunning - Figma nodeId: I205:372;199:290 */
const IconStepRunning: React.FC<IconStepRunningProps> = React.memo(({
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
    <g clipPath="url(#clip0_0_47)">
    <path d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" strokeWidth="2.5" stroke="#D5EFE1"/>
    <path d="M10 2C11.2629 1.99918 12.508 2.29734 13.6335 2.87008C14.759 3.44283 15.7329 4.27389 16.4756 5.29529C17.2183 6.31668 17.7086 7.49939 17.9064 8.74665C18.1043 9.99391 18.004 11.2703 17.6139 12.4714C17.2238 13.6725 16.5549 14.7641 15.6619 15.6571C14.7688 16.55 13.6771 17.2189 12.476 17.6089C11.2749 17.9989 9.9985 18.0991 8.75125 17.9011C7.50401 17.7032 6.32134 17.2128 5.3 16.47" strokeWidth="2.5" strokeLinecap="round" stroke="#16B364"/>
    </g>
    <defs>
    <clipPath id="clip0_0_47">
    <rect width="20" height="20" fill="white"/>
    </clipPath>
    </defs>
  </svg>
));

IconStepRunning.displayName = 'IconStepRunning';

export default IconStepRunning;
