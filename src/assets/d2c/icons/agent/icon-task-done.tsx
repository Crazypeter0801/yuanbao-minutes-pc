import React from 'react';

interface IconTaskDoneProps {
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

/** IconTaskDone - Figma nodeId: I204:328;199:268 */
const IconTaskDone: React.FC<IconTaskDoneProps> = React.memo(({
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
    <path d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z" fill="#16B364"/>
    <path d="M6 10.4L8.7 13.1L14 7.70001" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconTaskDone.displayName = 'IconTaskDone';

export default IconTaskDone;
