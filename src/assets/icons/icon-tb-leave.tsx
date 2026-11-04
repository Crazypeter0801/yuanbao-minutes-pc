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

/** IconTbLeave - Figma nodeId: 245:5915 */
const IconTbLeave: React.FC<IconTbLeaveProps> = React.memo(({
  width = 52,
  height = 36,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 52 36"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M0 8C0 3.58172 3.58172 0 8 0H44C48.4183 0 52 3.58172 52 8V28C52 32.4183 48.4183 36 44 36H8C3.58172 36 0 32.4183 0 28V8Z" fill="#FA4E32"/>
    <path d="M31 9C32.1046 9 33 9.89543 33 11V12H31.5V11C31.5 10.7239 31.2761 10.5 31 10.5H24.5C24.2239 10.5 24 10.7239 24 11V25C24 25.2761 24.2239 25.5 24.5 25.5H31C31.2761 25.5 31.5 25.2761 31.5 25V24H33V25C33 26.1046 32.1046 27 31 27H19C17.8954 27 17 26.1046 17 25V11C17 9.89543 17.8954 9 19 9H31ZM36.5303 17.4697C36.8232 17.7626 36.8232 18.2374 36.5303 18.5303L33.0303 22.0303L31.9697 20.9697L34.1895 18.75H27V17.25H34.1895L31.9697 15.0303L33.0303 13.9697L36.5303 17.4697Z" fill="white"/>
  </svg>
));

IconTbLeave.displayName = 'IconTbLeave';

export default IconTbLeave;
