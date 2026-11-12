import React from 'react';

interface IconZoomChevronProps {
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

/** IconZoomChevron - Figma nodeId: 221:30092 */
const IconZoomChevron: React.FC<IconZoomChevronProps> = React.memo(({
  width = 7,
  height = 4,
  color = '#373C48',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 7 4"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M6.15625 3.12266L3.53125 0.722656L0.90625 3.12266" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconZoomChevron.displayName = 'IconZoomChevron';

export default IconZoomChevron;
