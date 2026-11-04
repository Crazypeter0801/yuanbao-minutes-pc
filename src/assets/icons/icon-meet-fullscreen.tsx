import React from 'react';

interface IconMeetFullscreenProps {
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

/** IconMeetFullscreen - Figma nodeId: 245:5858 */
const IconMeetFullscreen: React.FC<IconMeetFullscreenProps> = React.memo(({
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
    <path d="M7.5 11V8C7.5 7.72386 7.72386 7.5 8 7.5H11" strokeWidth="1.2" strokeLinecap="round" stroke="#373C48"/>
    <path d="M7.5 17V20C7.5 20.2761 7.72386 20.5 8 20.5H11" strokeWidth="1.2" strokeLinecap="round" stroke="#373C48"/>
    <path d="M20.5 17V20C20.5 20.2761 20.2761 20.5 20 20.5H17" strokeWidth="1.2" strokeLinecap="round" stroke="#373C48"/>
    <path d="M20.5 11V8C20.5 7.72386 20.2761 7.5 20 7.5H17" strokeWidth="1.2" strokeLinecap="round" stroke="#373C48"/>
  </svg>
));

IconMeetFullscreen.displayName = 'IconMeetFullscreen';

export default IconMeetFullscreen;
