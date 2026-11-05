import React from 'react';

interface IconInputAddProps {
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

/** IconInputAdd - Figma nodeId: 36:10814 */
const IconInputAdd: React.FC<IconInputAddProps> = React.memo(({
  width = 16,
  height = 16,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 28 28"
    fill="none"
    className={className}
    {...props}
  >
    <rect width="28" height="28" rx="14" fill="#666666" fillOpacity="0.12"/>
    <path d="M14.0017 6.97369C14.3744 6.97378 14.6764 7.27582 14.6765 7.6485V13.3253H20.3533C20.7259 13.3254 21.0281 13.6274 21.0281 14.0001C21.0281 14.3727 20.7259 14.6747 20.3533 14.6749H14.6765V20.3516C14.6764 20.7243 14.3744 21.0263 14.0017 21.0264C13.629 21.0264 13.327 20.7243 13.3269 20.3516V14.6749H7.65015C7.27736 14.6749 6.97536 14.3728 6.97534 14.0001C6.97534 13.6273 7.27735 13.3253 7.65015 13.3253H13.3269V7.6485C13.327 7.27577 13.629 6.97369 14.0017 6.97369Z" fill="#0D0D0D"/>
  </svg>
));

IconInputAdd.displayName = 'IconInputAdd';

export default IconInputAdd;
