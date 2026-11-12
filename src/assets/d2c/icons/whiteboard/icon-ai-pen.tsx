import React from 'react';

interface IconAiPenProps {
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

/** IconAiPen - Figma nodeId: I221:30127;221:23481 */
const IconAiPen: React.FC<IconAiPenProps> = React.memo(({
  width = 20,
  height = 20,
  color = '#373C48',
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
    <path d="M4.75311 15.9496L8.99311 14.8196L16.3531 7.45958C16.7463 7.0433 16.9616 6.49013 16.9534 5.9176C16.9453 5.34506 16.7142 4.79827 16.3093 4.39339C15.9044 3.9885 15.3576 3.75743 14.7851 3.74925C14.2126 3.74107 13.6594 3.95643 13.2431 4.34958L5.88311 11.7096L4.75311 15.9496Z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
    <path d="M13.9412 9.86977L10.8312 6.75977" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
    <path d="M11.7531 16.9492H16.9531" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
    <path d="M5.54999 3.0498C5.88332 4.38314 6.71665 5.21647 8.04999 5.5498C6.71665 5.88314 5.88332 6.71647 5.54999 8.0498C5.21665 6.71647 4.38332 5.88314 3.04999 5.5498C4.38332 5.21647 5.21665 4.38314 5.54999 3.0498Z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconAiPen.displayName = 'IconAiPen';

export default IconAiPen;
