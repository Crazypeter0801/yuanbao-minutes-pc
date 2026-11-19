import React from 'react';

interface IconMembersCameraOnProps {
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

/** IconMembersCameraOn - Figma nodeId: 504:11270 */
const IconMembersCameraOn: React.FC<IconMembersCameraOnProps> = React.memo(({
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
    <rect x="1.40078" y="3.3998" width="10" height="9.2" rx="1.56" strokeWidth="1.2" stroke="#B0B6C3"/>
    <path d="M11.6016 10.1331L14.277 10.9259C14.7385 11.0626 15.2016 10.7168 15.2016 10.2355V5.76408C15.2016 5.2828 14.7385 4.93702 14.277 5.07374L11.6016 5.86647" strokeWidth="1.2" stroke="#B0B6C3"/>
  </svg>
));

IconMembersCameraOn.displayName = 'IconMembersCameraOn';

export default IconMembersCameraOn;
