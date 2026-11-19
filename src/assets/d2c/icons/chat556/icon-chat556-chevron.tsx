import React from 'react';

interface IconChat556ChevronProps {
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

/** IconChat556Chevron - Figma nodeId: 556:9832 */
const IconChat556Chevron: React.FC<IconChat556ChevronProps> = React.memo(({
  width = 11,
  height = 6,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 11 6"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M0.924253 0.924215L4.73738 4.73734C5.15856 5.15852 5.84144 5.15852 6.26262 4.73734L10.0757 0.924215" strokeWidth="1.84888" strokeLinecap="round" stroke="#373C48"/>
  </svg>
));

IconChat556Chevron.displayName = 'IconChat556Chevron';

export default IconChat556Chevron;
