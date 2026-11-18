import React from 'react';

interface IconChatIconAttachProps {
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

/** IconChatIconAttach - Figma nodeId: 305:39535 */
const IconChatIconAttach: React.FC<IconChatIconAttachProps> = React.memo(({
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
    <g clipPath="url(#clip0_305_39535)">
    <path d="M13.8138 8.32782L8.73069 13.4109C7.07932 15.0623 4.40192 15.0623 2.75055 13.4109C1.0992 11.7595 1.09918 9.08216 2.75052 7.43079L8.13255 2.04865C9.2885 0.892677 11.1627 0.892666 12.3186 2.04863C13.4746 3.20457 13.4746 5.07872 12.3187 6.23468L7.08614 11.4674C6.50817 12.0453 5.57108 12.0453 4.9931 11.4674C4.41513 10.8894 4.41513 9.95232 4.9931 9.37435L9.02968 5.33777" strokeWidth="0.96" strokeLinecap="round" stroke="#7B818F"/>
    </g>
    <defs>
    <clipPath id="clip0_305_39535">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
  </svg>
));

IconChatIconAttach.displayName = 'IconChatIconAttach';

export default IconChatIconAttach;
