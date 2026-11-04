import React from 'react';

interface IconSideStarProps {
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

/** IconSideStar - Figma nodeId: 248:14144 */
const IconSideStar: React.FC<IconSideStarProps> = React.memo(({
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
    <path d="M6.64826 6.05132L7.36624 3.89737C7.56884 3.28957 8.42855 3.28957 8.63115 3.89737L9.34914 6.05132C9.54821 6.64853 10.0168 7.11716 10.614 7.31623L12.768 8.03421C13.3758 8.23681 13.3758 9.09652 12.768 9.29912L10.614 10.0171C10.0168 10.2162 9.54821 10.6848 9.34914 11.282L8.63115 13.436C8.42855 14.0438 7.56884 14.0438 7.36624 13.436L6.64826 11.282C6.44919 10.6848 5.98056 10.2162 5.38335 10.0171L3.2294 9.29912C2.6216 9.09652 2.6216 8.23681 3.2294 8.03421L5.38335 7.31623C5.98056 7.11716 6.44919 6.64853 6.64826 6.05132Z" fill="#7B818F"/>
  </svg>
));

IconSideStar.displayName = 'IconSideStar';

export default IconSideStar;
