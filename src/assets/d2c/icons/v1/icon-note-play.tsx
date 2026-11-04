import React from 'react';

interface IconNotePlayProps {
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

/** IconNotePlay - Figma nodeId: 318:6124 */
const IconNotePlay: React.FC<IconNotePlayProps> = React.memo(({
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
    <path d="M16.4333 11.2C16.9667 11.6 16.9667 12.4 16.4333 12.8L11.1 16.8C10.4408 17.2944 9.5 16.824 9.5 16L9.5 8C9.5 7.17595 10.4408 6.70557 11.1 7.2L16.4333 11.2Z" fill="#4E5461"/>
  </svg>
));

IconNotePlay.displayName = 'IconNotePlay';

export default IconNotePlay;
