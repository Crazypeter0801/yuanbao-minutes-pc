import React from 'react';

interface IconTextProps {
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

/** IconText - Figma nodeId: I221:30127;221:23505 */
const IconText: React.FC<IconTextProps> = React.memo(({
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
    <path d="M3.60001 5.6V4H16.4V5.6M10 4.2V15.8M7.00001 16H13" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconText.displayName = 'IconText';

export default IconText;
