import React from 'react';

interface IconTbCameraProps {
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

/** IconTbCamera - Figma nodeId: 245:5886 */
const IconTbCamera: React.FC<IconTbCameraProps> = React.memo(({
  width = 24,
  height = 24,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M17 19H2V13C2 10.2 2.00013 8.79998 2.54492 7.73047C3.02429 6.78966 3.78966 6.02429 4.73047 5.54492C5.79998 5.00013 7.20005 5 10 5H17V19ZM8.2998 8C8.13427 8.00011 8.00011 8.13427 8 8.2998V9.2002C8.00011 9.36573 8.13427 9.49989 8.2998 9.5H13.7002C13.8657 9.49989 13.9999 9.36573 14 9.2002V8.2998C13.9999 8.13427 13.8657 8.00011 13.7002 8H8.2998Z" fill="#4E5461"/>
    <path d="M18 9L20.8422 7.57889C21.2256 7.38721 21.4173 7.29137 21.5731 7.31439C21.7091 7.33449 21.8309 7.40974 21.9097 7.52245C22 7.65151 22 7.86582 22 8.29443V15.7056C22 16.1342 22 16.3485 21.9097 16.4776C21.8309 16.5903 21.7091 16.6655 21.5731 16.6856C21.4173 16.7087 21.2256 16.6128 20.8422 16.4211L18 15V9Z" fill="#4E5461"/>
  </svg>
));

IconTbCamera.displayName = 'IconTbCamera';

export default IconTbCamera;
