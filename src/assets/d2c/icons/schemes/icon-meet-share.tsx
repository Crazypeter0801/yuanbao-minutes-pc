import React from 'react';

interface IconMeetShareProps {
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

/** IconMeetShare - Figma nodeId: 245:5712 */
const IconMeetShare: React.FC<IconMeetShareProps> = React.memo(({
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
    <path d="M12 6.90039C12.3314 6.90039 12.5996 7.16863 12.5996 7.5C12.5996 7.83137 12.3314 8.09961 12 8.09961H8.25C8.16716 8.09961 8.09961 8.16716 8.09961 8.25V17.5C8.09961 18.8255 9.17452 19.9004 10.5 19.9004H19.75C19.8328 19.9004 19.9004 19.8328 19.9004 19.75V16C19.9004 15.6686 20.1686 15.4004 20.5 15.4004C20.8314 15.4004 21.0996 15.6686 21.0996 16V19.75C21.0996 20.4956 20.4956 21.0996 19.75 21.0996H10.5C8.51178 21.0996 6.90039 19.4882 6.90039 17.5V8.25C6.90039 7.50442 7.50442 6.90039 8.25 6.90039H12ZM20.6172 6.91113C20.7326 6.9341 20.8394 6.9918 20.9238 7.07617C21.0361 7.18856 21.0995 7.34115 21.0996 7.5V12C21.0996 12.3313 20.8313 12.5995 20.5 12.5996C20.1687 12.5995 19.8994 12.3313 19.8994 12L19.9004 8.94824L13.9248 14.9248C13.6906 15.159 13.3105 15.1579 13.0762 14.9238C12.8421 14.6895 12.842 14.3104 13.0762 14.0762L19.0518 8.09961H16C15.669 8.09937 15.4006 7.83101 15.4004 7.5C15.4006 7.16892 15.6689 6.90052 16 6.90039H20.5L20.6172 6.91113Z" fill="#373C48"/>
  </svg>
));

IconMeetShare.displayName = 'IconMeetShare';

export default IconMeetShare;
