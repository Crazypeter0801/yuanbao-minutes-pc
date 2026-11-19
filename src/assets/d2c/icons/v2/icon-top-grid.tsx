import React from 'react';

interface IconTopGridProps {
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

/** IconTopGrid - Figma nodeId: 439:21097 */
const IconTopGrid: React.FC<IconTopGridProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
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
    <path d="M3 10V12.8C3 13.9201 3 14.4802 3.21799 14.908C3.40973 15.2843 3.71569 15.5903 4.09202 15.782C4.51984 16 5.0799 16 6.2 16H10M3 10V7.2C3 6.07989 3 5.51984 3.21799 5.09202C3.40973 4.71569 3.71569 4.40973 4.09202 4.21799C4.51984 4 5.07989 4 6.2 4H10M3 10H17M17 10V7.2C17 6.0799 17 5.51984 16.782 5.09202C16.5903 4.71569 16.2843 4.40973 15.908 4.21799C15.4802 4 14.9201 4 13.8 4H10M17 10V12.8C17 13.9201 17 14.4802 16.782 14.908C16.5903 15.2843 16.2843 15.5903 15.908 15.782C15.4802 16 14.9201 16 13.8 16H10M10 4V16" strokeWidth="1.2" stroke="#373C48"/>
  </svg>
));

IconTopGrid.displayName = 'IconTopGrid';

export default IconTopGrid;
