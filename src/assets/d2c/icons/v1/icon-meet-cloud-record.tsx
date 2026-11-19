import React from 'react';

interface IconMeetCloudRecordProps {
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

/** IconMeetCloudRecord - Figma nodeId: 316:4885 */
const IconMeetCloudRecord: React.FC<IconMeetCloudRecordProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
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
    <circle cx="16" cy="13" r="3" fill="#FA4E32"/>
    <path d="M10 4C12.7614 4 15 6.23858 15 9C15 9.04214 14.9971 9.08409 14.9961 9.12598C13.2727 9.57129 12 11.1375 12 13C12 14.195 12.5246 15.267 13.3555 16H5C2.79086 16 1 14.2091 1 12C1 9.79086 2.79086 8 5 8C5.03331 8 5.0665 8.00114 5.09961 8.00195C5.56212 5.71874 7.58035 4 10 4Z" fill="#373C48"/>
  </svg>
));

IconMeetCloudRecord.displayName = 'IconMeetCloudRecord';

export default IconMeetCloudRecord;
