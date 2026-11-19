import React from 'react';

interface IconBar3RecordProps {
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

/** IconBar3Record - Figma nodeId: 416:20109 */
const IconBar3Record: React.FC<IconBar3RecordProps> = React.memo(({
  width = 60,
  height = 40,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 60 40"
    fill="none"
    className={className}
    {...props}
  >
    <circle cx="22" cy="20" r="7.55556" strokeWidth="1.88889" stroke="#373C48"/>
    <circle cx="22" cy="20.0001" r="5.19444" fill="#373C48"/>
    <path d="M41.5 20.5L44.0004 18L46.5 20.5" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconBar3Record.displayName = 'IconBar3Record';

export default IconBar3Record;
