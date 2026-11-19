import React from 'react';

interface IconMenuMeetingProps {
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

/** IconMenuMeeting - Figma nodeId: I727:60493;86:62618;27263:6722 */
const IconMenuMeeting: React.FC<IconMenuMeetingProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor', // Figma: #black
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
    <path d="M12.8013 5.80206L7.20319 11.4L10.0082 14.2049L12.8013 11.4117L15.5882 14.1988L17.4158 12.3716C17.9555 11.8317 17.9555 10.9563 17.4158 10.4164L12.8013 5.80206ZM7.19945 5.80206L9.99257 8.6069L4.40649 14.1931L2.58508 12.3716C2.04521 11.8317 2.04521 10.9565 2.58508 10.4164L7.19945 5.80206Z" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconMenuMeeting.displayName = 'IconMenuMeeting';

export default IconMenuMeeting;
