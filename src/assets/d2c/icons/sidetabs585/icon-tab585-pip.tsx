import React from 'react';

interface IconTab585PipProps {
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

/** IconTab585Pip - Figma nodeId: 585:68671 */
const IconTab585Pip: React.FC<IconTab585PipProps> = React.memo(({
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
    <g clipPath="url(#clip0_585_68671)">
    <path d="M12.5298 8.5H11.4995C9.84266 8.5 8.49951 9.84315 8.49951 11.5V16.5C8.49951 18.1569 9.84266 19.5 11.4995 19.5H16.4995C18.1564 19.5 19.4995 18.1569 19.4995 16.5V15.553" strokeWidth="1.2" strokeLinecap="round" stroke="#4E5461"/>
    <path d="M15.9995 13.5H17.9995C18.8279 13.5 19.4995 12.8284 19.4995 12V10C19.4995 9.17157 18.8279 8.5 17.9995 8.5H15.9995C15.1711 8.5 14.4995 9.17157 14.4995 10V12C14.4995 12.8284 15.1711 13.5 15.9995 13.5Z" strokeWidth="1.2" stroke="#4E5461"/>
    </g>
    <defs>
    <clipPath id="clip0_585_68671">
    <rect width="13.3333" height="13.3333" fill="white" transform="translate(7.3335 7.3335)"/>
    </clipPath>
    </defs>
  </svg>
));

IconTab585Pip.displayName = 'IconTab585Pip';

export default IconTab585Pip;
