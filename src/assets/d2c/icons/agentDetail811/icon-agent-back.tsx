import React from 'react';

interface IconAgentBackProps {
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

/** IconAgentBack - Figma nodeId: 811:40957 */
const IconAgentBack: React.FC<IconAgentBackProps> = React.memo(({
  width = 32,
  height = 32,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    {...props}
  >
    <rect width="32" height="32" rx="16" fill="#F3F3F4"/>
    <path d="M18.084 21L13.084 16L18.084 11" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconAgentBack.displayName = 'IconAgentBack';

export default IconAgentBack;
