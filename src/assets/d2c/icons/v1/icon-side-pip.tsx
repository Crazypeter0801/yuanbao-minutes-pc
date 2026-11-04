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

/** IconSidePip - Figma nodeId: 316:2636 */
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
    <g clipPath="url(#clip0_316_2636)">
    <path d="M7.50134 4.53369H5.50134C5.2252 4.53369 5.00134 4.75755 5.00134 5.03369V14.5337C5.00134 15.086 5.44906 15.5337 6.00134 15.5337H14.5013C14.7775 15.5337 15.0013 15.3098 15.0013 15.0337V12" strokeWidth="1.2" strokeLinecap="round" stroke="#4E5461"/>
    <path d="M10.2013 9.53369H14.8013C14.9118 9.53369 15.0013 9.44415 15.0013 9.33369V4.73369C15.0013 4.62323 14.9118 4.53369 14.8013 4.53369H10.2013C10.0909 4.53369 10.0013 4.62323 10.0013 4.73369V9.33369C10.0013 9.44415 10.0909 9.53369 10.2013 9.53369Z" strokeWidth="1.2" stroke="#4E5461"/>
    </g>
    <defs>
    <clipPath id="clip0_316_2636">
    <rect width="13.3333" height="13.3333" fill="white" transform="translate(3.33337 3.3335)"/>
    </clipPath>
    </defs>
  </svg>
));

IconSidePip.displayName = 'IconSidePip';

export default IconSidePip;
