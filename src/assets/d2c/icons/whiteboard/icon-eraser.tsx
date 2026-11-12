import React from 'react';

interface IconEraserProps {
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

/** IconEraser - Figma nodeId: I221:30127;221:23509 */
const IconEraser: React.FC<IconEraserProps> = React.memo(({
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
    <path d="M4.2528 10.2751L10.4753 4.05252C11.1783 3.34958 12.318 3.34958 13.0209 4.05252L15.0008 6.03242C15.7038 6.73536 15.7038 7.87506 15.0008 8.578L8.77829 14.8005C8.07534 15.5035 6.93565 15.5035 6.2327 14.8005L4.2528 12.8206C3.54986 12.1177 3.54986 10.978 4.2528 10.2751Z" strokeWidth="1.2" stroke={color}/>
    <path d="M6.23001 8.29492L10.7555 12.8204" strokeWidth="1.2" strokeLinecap="round" stroke={color}/>
    <path d="M11.0268 17.2266H17.0268" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconEraser.displayName = 'IconEraser';

export default IconEraser;
