import React from 'react';

interface IconInputAddProps {
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

/** IconInputAdd - Figma nodeId: 489:10657 */
const IconInputAdd: React.FC<IconInputAddProps> = React.memo(({
  width = 28,
  height = 28,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 28 28"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M14.0017 6.97363C14.3744 6.97372 14.6764 7.27576 14.6765 7.64844V13.3252H20.3533C20.7259 13.3253 21.0281 13.6273 21.0281 14C21.0281 14.3726 20.7259 14.6746 20.3533 14.6748H14.6765V20.3515C14.6764 20.7242 14.3744 21.0262 14.0017 21.0263C13.629 21.0263 13.327 20.7242 13.3269 20.3515V14.6748H7.65015C7.27736 14.6748 6.97536 14.3727 6.97534 14C6.97534 13.6272 7.27735 13.3252 7.65015 13.3252H13.3269V7.64844C13.327 7.27571 13.629 6.97363 14.0017 6.97363Z" fill="#0D0D0D"/>
  </svg>
));

IconInputAdd.displayName = 'IconInputAdd';

export default IconInputAdd;
