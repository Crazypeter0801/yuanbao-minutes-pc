import React from 'react';

interface IconTbLeaveProps {
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

/** IconTbLeave - Figma nodeId: 316:2616 */
const IconTbLeave: React.FC<IconTbLeaveProps> = React.memo(({
  width = 120,
  height = 48,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 120 48"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M97 15C98.1046 15 99 15.8954 99 17V18H97.5V17C97.5 16.7239 97.2761 16.5 97 16.5H90.5C90.2239 16.5 90 16.7239 90 17V31C90 31.2761 90.2239 31.5 90.5 31.5H97C97.2761 31.5 97.5 31.2761 97.5 31V30H99V31C99 32.1046 98.1046 33 97 33H85C83.8954 33 83 32.1046 83 31V17C83 15.8954 83.8954 15 85 15H97ZM102.53 23.4697C102.823 23.7626 102.823 24.2374 102.53 24.5303L99.0303 28.0303L97.9697 26.9697L100.189 24.75H93V23.25H100.189L97.9697 21.0303L99.0303 19.9697L102.53 23.4697Z" fill="#FA4E32"/>
  </svg>
));

IconTbLeave.displayName = 'IconTbLeave';

export default IconTbLeave;
