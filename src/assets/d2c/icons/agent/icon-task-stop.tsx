import React from 'react';

interface IconTaskStopProps {
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

/** IconTaskStop - Figma nodeId: 205:401 */
const IconTaskStop: React.FC<IconTaskStopProps> = React.memo(({
  width = 10,
  height = 10,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 10 10"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M7.5 1H2.5C1.67157 1 1 1.67157 1 2.5V7.5C1 8.32843 1.67157 9 2.5 9H7.5C8.32843 9 9 8.32843 9 7.5V2.5C9 1.67157 8.32843 1 7.5 1Z" fill="#1F2329"/>
  </svg>
));

IconTaskStop.displayName = 'IconTaskStop';

export default IconTaskStop;
