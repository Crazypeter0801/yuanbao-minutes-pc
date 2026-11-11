import React from 'react';

interface IconTaskbarCollapseProps {
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

/** IconTaskbarCollapse - Figma nodeId: 204:295 */
const IconTaskbarCollapse: React.FC<IconTaskbarCollapseProps> = React.memo(({
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
    <path d="M3 5.20001L7 9.20001L11 5.20001" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#646A73"/>
  </svg>
));

IconTaskbarCollapse.displayName = 'IconTaskbarCollapse';

export default IconTaskbarCollapse;
