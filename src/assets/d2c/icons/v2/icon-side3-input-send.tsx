import React from 'react';

interface IconSide3InputSendProps {
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

/** IconSide3InputSend - Figma nodeId: 489:10662 */
const IconSide3InputSend: React.FC<IconSide3InputSendProps> = React.memo(({
  width = 44,
  height = 28,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 44 28"
    fill="none"
    className={className}
    {...props}
  >
    <g clipPath="url(#clip0_489_10662)">
    <path d="M16 14C16 6.26801 22.268 0 30 0C37.732 0 44 6.26801 44 14C44 21.732 37.732 28 30 28C22.268 28 16 21.732 16 14Z" fill="#666666" fillOpacity="0.12"/>
    <path d="M29.9994 19.8332V8.24924M35 12.9668L30.2087 8.25286C30.0931 8.13772 29.9057 8.13772 29.7901 8.25286L25 12.9668" strokeWidth="1.5" strokeLinecap="round" stroke={color}/>
    </g>
    <defs>
    <clipPath id="clip0_489_10662">
    <rect width="28" height="28" fill="white" transform="translate(16)"/>
    </clipPath>
    </defs>
  </svg>
));

IconSide3InputSend.displayName = 'IconSide3InputSend';

export default IconSide3InputSend;
