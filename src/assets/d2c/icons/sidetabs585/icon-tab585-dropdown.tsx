import React from 'react';

interface IconTab585DropdownProps {
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

/** IconTab585Dropdown - Figma nodeId: 585:68707 */
const IconTab585Dropdown: React.FC<IconTab585DropdownProps> = React.memo(({
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
    <path d="M9 11L14 16L19 11" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconTab585Dropdown.displayName = 'IconTab585Dropdown';

export default IconTab585Dropdown;
