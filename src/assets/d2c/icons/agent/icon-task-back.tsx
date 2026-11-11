import React from 'react';

interface IconTaskBackProps {
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

/** IconTaskBack - Figma nodeId: 205:338 */
const IconTaskBack: React.FC<IconTaskBackProps> = React.memo(({
  width = 14,
  height = 14,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 14"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M8.80001 2.8L4.60001 7L8.80001 11.2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#646A73"/>
  </svg>
));

IconTaskBack.displayName = 'IconTaskBack';

export default IconTaskBack;
