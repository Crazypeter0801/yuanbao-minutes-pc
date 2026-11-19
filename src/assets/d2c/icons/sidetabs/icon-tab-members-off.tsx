import React from 'react';

interface IconTabMembersOffProps {
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

/** IconTabMembersOff - Figma nodeId: 504:11386 */
const IconTabMembersOff: React.FC<IconTabMembersOffProps> = React.memo(({
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
    <path d="M7 14C4.63241 14 2.86289 14.7478 1.87988 15.2988C1.29748 15.6253 1.00004 16.261 1 16.9287V17.5C1 18.3284 1.67157 19 2.5 19H6V17.4053C6 16.2355 6.52601 15.0085 7.68359 14.3594C7.85118 14.2654 8.03425 14.1676 8.23242 14.0684C7.8422 14.0245 7.43099 14 7 14Z" fill="#7B818F"/>
    <path d="M4 10C4 11.6569 5.34315 13 7 13C8.65685 13 10 11.6569 10 10C10 8.34315 8.65685 7 7 7C5.34315 7 4 8.34315 4 10Z" fill="#7B818F"/>
    <path d="M15 13.5C12.1894 13.5 10.0107 14.2896 8.6416 14.9814C8.45923 15.0736 8.36776 15.1201 8.12402 15.3154C7.69543 15.659 7.17779 16.5006 7.06445 17.0381C7 17.3439 7 17.5409 7 17.9346C7 18.4605 7.0002 18.7236 7.06543 18.9375C7.21111 19.4152 7.58482 19.7889 8.0625 19.9346C8.27641 19.9998 8.53946 20 9.06543 20H20.9346C21.4605 20 21.7236 19.9998 21.9375 19.9346C22.4152 19.7889 22.7889 19.4152 22.9346 18.9375C22.9998 18.7236 23 18.4605 23 17.9346C23 17.5409 23 17.3439 22.9355 17.0381C22.8222 16.5006 22.3046 15.659 21.876 15.3154C21.6322 15.1201 21.5408 15.0736 21.3584 14.9814C19.9893 14.2896 17.8106 13.5 15 13.5ZM15 4C12.7909 4 11 5.79086 11 8C11 10.2091 12.7909 12 15 12C17.2091 12 19 10.2091 19 8C19 5.79086 17.2091 4 15 4Z" fill="#7B818F"/>
    <rect x="11" y="4" width="8" height="8" rx="4" fill="#7B818F"/>
    <rect x="4" y="7" width="6" height="6" rx="3" fill="#7B818F"/>
  </svg>
));

IconTabMembersOff.displayName = 'IconTabMembersOff';

export default IconTabMembersOff;
