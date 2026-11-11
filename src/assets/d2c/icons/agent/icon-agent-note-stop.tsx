import React from 'react';

interface IconAgentNoteStopProps {
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

/** IconAgentNoteStop - Figma nodeId: 214:11123 */
const IconAgentNoteStop: React.FC<IconAgentNoteStopProps> = React.memo(({
  width = 24,
  height = 24,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <rect width="24" height="24" rx="12" fill="#F3F3F4"/>
    <rect x="8" y="8" width="2.5" height="8" rx="1.25" fill="#4E5461"/>
    <rect x="13.5" y="8" width="2.5" height="8" rx="1.25" fill="#4E5461"/>
  </svg>
));

IconAgentNoteStop.displayName = 'IconAgentNoteStop';

export default IconAgentNoteStop;
