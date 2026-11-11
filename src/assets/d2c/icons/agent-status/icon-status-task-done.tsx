import React from 'react';

interface IconStatusTaskDoneProps {
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

/** IconStatusTaskDone - Figma nodeId: 242:1077 */
const IconStatusTaskDone: React.FC<IconStatusTaskDoneProps> = React.memo(({
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
    <path d="M10 18.5C14.6944 18.5 18.5 14.6944 18.5 10C18.5 5.30558 14.6944 1.5 10 1.5C5.30558 1.5 1.5 5.30558 1.5 10C1.5 14.6944 5.30558 18.5 10 18.5Z" fill="#00C37A"/>
    <path d="M6.2998 10.2998L8.8998 12.8998L13.7998 7.7998" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconStatusTaskDone.displayName = 'IconStatusTaskDone';

export default IconStatusTaskDone;
