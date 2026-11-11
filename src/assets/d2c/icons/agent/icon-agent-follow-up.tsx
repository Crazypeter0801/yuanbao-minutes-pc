import React from 'react';

interface IconAgentFollowUpProps {
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

/** IconAgentFollowUp - Figma nodeId: 214:13244 */
const IconAgentFollowUp: React.FC<IconAgentFollowUpProps> = React.memo(({
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
    <path d="M13.4944 8.6948H7.2002H7.20019C6.14083 8.6948 5.61115 8.6948 5.17555 8.5828C3.9203 8.26008 2.94011 7.2799 2.61737 6.02466C2.50537 5.58905 2.50537 5.05937 2.50537 4M10.1892 5.38967L13.4944 8.6948L10.1892 12" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="#525252"/>
  </svg>
));

IconAgentFollowUp.displayName = 'IconAgentFollowUp';

export default IconAgentFollowUp;
