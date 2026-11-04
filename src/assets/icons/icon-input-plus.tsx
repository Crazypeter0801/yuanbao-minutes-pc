import React from 'react';

interface IconInputPlusProps {
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

/** IconInputPlus - Figma nodeId: 248:12535 */
const IconInputPlus: React.FC<IconInputPlusProps> = React.memo(({
  width = 28,
  height = 28,
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
    <path d="M14.002 6.97369C14.3746 6.97378 14.6767 7.27582 14.6768 7.6485V13.3253H20.3535C20.7262 13.3254 21.0283 13.6274 21.0283 14.0001C21.0283 14.3727 20.7262 14.6747 20.3535 14.6749H14.6768V20.3516C14.6767 20.7243 14.3746 21.0263 14.002 21.0264C13.6292 21.0264 13.3272 20.7243 13.3271 20.3516V14.6749H7.65039C7.27761 14.6749 6.9756 14.3728 6.97559 14.0001C6.97559 13.6273 7.2776 13.3253 7.65039 13.3253H13.3271V7.6485C13.3272 7.27577 13.6292 6.97369 14.002 6.97369Z" fill="#0D0D0D"/>
  </svg>
));

IconInputPlus.displayName = 'IconInputPlus';

export default IconInputPlus;
