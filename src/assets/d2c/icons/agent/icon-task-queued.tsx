import React from 'react';

interface IconTaskQueuedProps {
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

/** IconTaskQueued - Figma nodeId: I204:316;199:258 */
const IconTaskQueued: React.FC<IconTaskQueuedProps> = React.memo(({
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
    <path d="M18.2001 9.99999C18.2001 14.5287 14.5288 18.2 10 18.2C5.47131 18.2 1.80005 14.5287 1.80005 9.99999C1.80005 5.47125 5.47131 1.79999 10 1.79999C14.5288 1.79999 18.2001 5.47125 18.2001 9.99999Z" strokeWidth="1.5" stroke="#C9CDD4"/>
    <path d="M10 6V10.2L12.6 11.8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#8F959E"/>
  </svg>
));

IconTaskQueued.displayName = 'IconTaskQueued';

export default IconTaskQueued;
