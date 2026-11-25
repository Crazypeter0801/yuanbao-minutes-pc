import React from 'react';

interface IconConnectorChevronProps {
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

/** IconConnectorChevron - Figma nodeId: 777:85057 */
const IconConnectorChevron: React.FC<IconConnectorChevronProps> = React.memo(({
  width = 7,
  height = 10,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 7 10"
    fill="none"
    className={className}
    {...props}
  >
    <g clipPath="url(#clip0_777_85057)">
    <path d="M1.78955 9.21061L4.94745 5.00008L1.78955 0.789551" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="#7B818F"/>
    </g>
    <defs>
    <clipPath id="clip0_777_85057">
    <rect width="5" height="10" fill="white" transform="translate(1)"/>
    </clipPath>
    </defs>
  </svg>
));

IconConnectorChevron.displayName = 'IconConnectorChevron';

export default IconConnectorChevron;
