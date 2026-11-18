import React from 'react';

interface IconSide3CloseProps {
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

/** IconSide3Close - Figma nodeId: 529:13419 */
const IconSide3Close: React.FC<IconSide3CloseProps> = React.memo(({
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
    <path d="M13.9785 5.15234C14.2122 4.91756 14.5904 4.91773 14.8242 5.15234C15.058 5.38721 15.058 5.76709 14.8242 6.00195L10.8447 10L14.8232 13.9971C15.0567 14.2319 15.0568 14.6119 14.8232 14.8467C14.5896 15.0815 14.2113 15.0813 13.9775 14.8467L9.99902 10.8496L6.02148 14.8467C5.7877 15.0812 5.40944 15.0814 5.17578 14.8467C4.9422 14.6119 4.94239 14.2319 5.17578 13.9971L9.15332 10L5.1748 6.00195C4.94134 5.7671 4.94125 5.38715 5.1748 5.15234C5.4085 4.91754 5.78675 4.91764 6.02051 5.15234L9.99902 9.14941L13.9785 5.15234Z" fill="#4E5461"/>
  </svg>
));

IconSide3Close.displayName = 'IconSide3Close';

export default IconSide3Close;
