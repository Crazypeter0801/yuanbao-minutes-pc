import React from 'react';

interface IconStepPendingProps {
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

/** IconStepPending - Figma nodeId: I205:381;199:299 */
const IconStepPending: React.FC<IconStepPendingProps> = React.memo(({
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
    <path d="M18.2 9.99999C18.2 14.5287 14.5287 18.2 10 18.2C5.47127 18.2 1.8 14.5287 1.8 9.99999C1.8 5.47125 5.47127 1.79999 10 1.79999C14.5287 1.79999 18.2 5.47125 18.2 9.99999Z" strokeWidth="1.5" stroke="#C9CDD4"/>
  </svg>
));

IconStepPending.displayName = 'IconStepPending';

export default IconStepPending;
