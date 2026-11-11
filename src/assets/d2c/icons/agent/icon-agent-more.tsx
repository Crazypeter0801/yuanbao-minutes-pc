import React from 'react';

interface IconAgentMoreProps {
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

/** IconAgentMore - Figma nodeId: 214:11056 */
const IconAgentMore: React.FC<IconAgentMoreProps> = React.memo(({
  width = 24,
  height = 20,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 20"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M10 10C10 10.5523 9.55229 11 9 11C8.44772 11 8 10.5523 8 10C8 9.44771 8.44772 9 9 9C9.55229 9 10 9.44771 10 10ZM15 10C15 10.5523 14.5523 11 14 11C13.4477 11 13 10.5523 13 10C13 9.44771 13.4477 9 14 9C14.5523 9 15 9.44772 15 10ZM20 10C20 10.5523 19.5523 11 19 11C18.4477 11 18 10.5523 18 10C18 9.44772 18.4477 9 19 9C19.5523 9 20 9.44772 20 10Z" fill="#4E5461"/>
  </svg>
));

IconAgentMore.displayName = 'IconAgentMore';

export default IconAgentMore;
