import React from 'react';

interface IconStatusTaskConfirmProps {
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

/** IconStatusTaskConfirm - Figma nodeId: 242:1067 */
const IconStatusTaskConfirm: React.FC<IconStatusTaskConfirmProps> = React.memo(({
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
    <path d="M10 18.5C14.6944 18.5 18.5 14.6944 18.5 10C18.5 5.30558 14.6944 1.5 10 1.5C5.30558 1.5 1.5 5.30558 1.5 10C1.5 14.6944 5.30558 18.5 10 18.5Z" fill="#FF9F1A"/>
    <path d="M10 5.6001V10.6001" strokeWidth="1.8" strokeLinecap="round" stroke={color}/>
    <path d="M10.0002 15.0502C10.5801 15.0502 11.0502 14.5801 11.0502 14.0002C11.0502 13.4203 10.5801 12.9502 10.0002 12.9502C9.4203 12.9502 8.9502 13.4203 8.9502 14.0002C8.9502 14.5801 9.4203 15.0502 10.0002 15.0502Z" fill="white"/>
  </svg>
));

IconStatusTaskConfirm.displayName = 'IconStatusTaskConfirm';

export default IconStatusTaskConfirm;
