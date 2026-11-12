import React from 'react';

interface IconShapeProps {
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

/** IconShape - Figma nodeId: I221:30127;221:23500 */
const IconShape: React.FC<IconShapeProps> = React.memo(({
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
    <path d="M10.5 8.50293H14.5C15.0304 8.50293 15.5391 8.71364 15.9142 9.08872C16.2893 9.46379 16.5 9.9725 16.5 10.5029V14.5029C16.5 15.0334 16.2893 15.5421 15.9142 15.9171C15.5391 16.2922 15.0304 16.5029 14.5 16.5029H10.5C9.96957 16.5029 9.46086 16.2922 9.08579 15.9171C8.71071 15.5421 8.5 15.0334 8.5 14.5029V10.5029C8.5 9.9725 8.71071 9.46379 9.08579 9.08872C9.46086 8.71364 9.96957 8.50293 10.5 8.50293Z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
    <path d="M11.8226 8.5026C11.9945 7.6196 11.8784 6.70472 11.4913 5.89269C11.1042 5.08065 10.4666 4.41436 9.67233 3.99191C8.8781 3.56947 7.96922 3.41319 7.07951 3.54609C6.18979 3.679 5.36626 4.09405 4.73016 4.73016C4.09405 5.36626 3.679 6.18979 3.54609 7.07951C3.41319 7.96922 3.56947 8.8781 3.99191 9.67233C4.41436 10.4666 5.08065 11.1042 5.89269 11.4913C6.70472 11.8784 7.6196 11.9945 8.5026 11.8226" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconShape.displayName = 'IconShape';

export default IconShape;
