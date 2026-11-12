import React from 'react';

interface IconAddProps {
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

/** IconAdd - Figma nodeId: I221:30127;221:23531 */
const IconAdd: React.FC<IconAddProps> = React.memo(({
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
    <path d="M7.1 3.5H12.9C13.8548 3.5 14.7705 3.87928 15.4456 4.55442C16.1207 5.22955 16.5 6.14522 16.5 7.1V12.9C16.5 13.8548 16.1207 14.7705 15.4456 15.4456C14.7705 16.1207 13.8548 16.5 12.9 16.5H7.1C6.14522 16.5 5.22955 16.1207 4.55442 15.4456C3.87928 14.7705 3.5 13.8548 3.5 12.9V7.1C3.5 6.14522 3.87928 5.22955 4.55442 4.55442C5.22955 3.87928 6.14522 3.5 7.1 3.5Z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
    <path d="M9.99687 6.7998V9.9998M9.99687 9.9998V13.1998M9.99687 9.9998H6.79688M9.99687 9.9998H13.1969" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconAdd.displayName = 'IconAdd';

export default IconAdd;
