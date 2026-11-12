import React from 'react';

interface IconSelectProps {
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

/** IconSelect - Figma nodeId: I221:30127;221:23474 */
const IconSelect: React.FC<IconSelectProps> = React.memo(({
  width = 20,
  height = 20,
  color = '#373C48',
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
    <path d="M4.20001 4.2002L16.2 9.0002L11 11.0002L9.00001 16.2002L4.20001 4.2002Z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconSelect.displayName = 'IconSelect';

export default IconSelect;
