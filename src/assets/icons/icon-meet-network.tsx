import React from 'react';

interface IconMeetNetworkProps {
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

/** IconMeetNetwork - Figma nodeId: 245:5707 */
const IconMeetNetwork: React.FC<IconMeetNetworkProps> = React.memo(({
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
    <rect x="8" y="15" width="2" height="5" rx="0.4" fill="#17C07E"/>
    <rect x="13" y="11" width="2" height="9" rx="0.4" fill="#17C07E"/>
    <rect x="18" y="8" width="2" height="12" rx="0.4" fill="#17C07E"/>
  </svg>
));

IconMeetNetwork.displayName = 'IconMeetNetwork';

export default IconMeetNetwork;
