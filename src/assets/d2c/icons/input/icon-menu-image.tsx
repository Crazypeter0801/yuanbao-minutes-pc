import React from 'react';

interface IconMenuImageProps {
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

/** IconMenuImage - Figma nodeId: I727:60493;86:62626;27263:6722 */
const IconMenuImage: React.FC<IconMenuImageProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor', // Figma: #black
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
    <path d="M4.375 7.88274L4.375 12.118C4.375 14.0673 5.95517 15.6474 7.90441 15.6474L12.8456 15.6475C14.7948 15.6475 16.375 14.0673 16.375 12.118L16.375 7.88274C16.375 5.9335 14.7948 4.35333 12.8456 4.35333L7.90441 4.35333C5.95517 4.35333 4.375 5.9335 4.375 7.88274Z" stroke={color}/>
    <path d="M16.1968 12.6086C14.1304 11.9577 13.2035 7.31219 10.749 9.543C9.05826 11.0796 6.91416 12.9407 4.54972 12.6086" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
    <circle cx="7.70388" cy="7.68026" r="1.07692" fill={color}/>
  </svg>
));

IconMenuImage.displayName = 'IconMenuImage';

export default IconMenuImage;
