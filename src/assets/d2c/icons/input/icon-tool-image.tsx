import React from 'react';

interface IconToolImageProps {
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

/** IconToolImage - Figma nodeId: 36:10699 */
const IconToolImage: React.FC<IconToolImageProps> = React.memo(({
  width = 18,
  height = 18,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M2.87987 6.83828L2.87987 11.1583C2.87987 13.1465 4.49165 14.7583 6.47988 14.7583L11.5199 14.7583C13.5081 14.7583 15.1199 13.1465 15.1199 11.1583L15.1199 6.83828C15.1199 4.85006 13.5081 3.23828 11.5199 3.23828L6.47987 3.23828C4.49165 3.23828 2.87987 4.85006 2.87987 6.83828Z" strokeWidth="1.35" stroke="#0D0D0D"/>
    <path d="M14.9395 11.6583C12.8317 10.9944 11.8863 6.25599 9.38268 8.53141C7.65816 10.0987 5.47118 11.9971 3.05945 11.6583" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" stroke="#0D0D0D"/>
    <circle cx="6.30004" cy="6.65819" r="1.26" fill="#0D0D0D"/>
  </svg>
));

IconToolImage.displayName = 'IconToolImage';

export default IconToolImage;
