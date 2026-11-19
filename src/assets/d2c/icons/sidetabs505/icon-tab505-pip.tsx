import React from 'react';

interface IconTab505PipProps {
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

/** IconTab505Pip - Figma nodeId: 505:12592 */
const IconTab505Pip: React.FC<IconTab505PipProps> = React.memo(({
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
    <g clipPath="url(#clip0_505_12592)">
    <path d="M10.2357 5.3999H8.99941C7.01119 5.3999 5.39941 7.01168 5.39941 8.9999V14.9999C5.39941 16.9881 7.01119 18.5999 8.99941 18.5999H14.9994C16.9876 18.5999 18.5994 16.9881 18.5994 14.9999V13.8635" strokeWidth="1.44" strokeLinecap="round" stroke="#4E5461"/>
    <path d="M14.3996 11.3999H16.7996C17.7937 11.3999 18.5996 10.594 18.5996 9.5999V7.1999C18.5996 6.20579 17.7937 5.3999 16.7996 5.3999H14.3996C13.4055 5.3999 12.5996 6.20579 12.5996 7.1999V9.5999C12.5996 10.594 13.4055 11.3999 14.3996 11.3999Z" strokeWidth="1.44" stroke="#4E5461"/>
    </g>
    <defs>
    <clipPath id="clip0_505_12592">
    <rect width="16" height="16" fill="white" transform="translate(4 4)"/>
    </clipPath>
    </defs>
  </svg>
));

IconTab505Pip.displayName = 'IconTab505Pip';

export default IconTab505Pip;
