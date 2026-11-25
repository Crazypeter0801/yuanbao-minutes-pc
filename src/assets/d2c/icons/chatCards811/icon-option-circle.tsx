import React from 'react';

interface IconOptionCircleProps {
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

/** IconOptionCircle - Figma nodeId: I811:29938;1268:21011 */
const IconOptionCircle: React.FC<IconOptionCircleProps> = React.memo(({
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
    <path d="M19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19V20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20V19C14.9706 19 19 14.9706 19 10Z" fill={color} fillOpacity="0.2"/>
  </svg>
));

IconOptionCircle.displayName = 'IconOptionCircle';

export default IconOptionCircle;
