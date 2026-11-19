import React from 'react';

interface IconTabYuanbaoOffProps {
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

/** IconTabYuanbaoOff - Figma nodeId: 505:13076 */
const IconTabYuanbaoOff: React.FC<IconTabYuanbaoOffProps> = React.memo(({
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
    <path d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM5.03223 1.41016C1.60334 4.66501 1.18654 9.82064 4.13281 13.0273C7.12583 16.2849 12.4546 16.2965 16.0352 13.0527C17.8255 11.4313 18.0628 8.79618 16.5654 7.16699C15.069 5.53786 12.4047 5.53216 10.6152 7.1543C8.82493 8.77659 6.16057 8.77079 4.66406 7.1416C3.21426 5.56409 3.3919 3.041 5.03223 1.41016Z" fill="#7B818F"/>
    <path d="M8.98569 10.6629C8.98569 12.1697 8.68587 12.4532 8.01128 12.4532C7.33668 12.4532 7.03687 12.1706 7.03687 10.6629C7.03687 9.15515 7.33668 8.87256 8.01128 8.87256C8.68587 8.87256 8.98569 9.15515 8.98569 10.6629Z" fill="#7B818F"/>
    <path d="M12.3375 12.4484C12.1411 12.4484 11.9473 12.3562 11.8258 12.1831L11.0366 11.0639C10.8884 10.8537 10.8841 10.5745 11.0254 10.36L11.8146 9.15988C12.0041 8.87126 12.3918 8.79113 12.6804 8.98068C12.9691 9.17022 13.0492 9.55791 12.8596 9.84653L12.3048 10.6908L12.8484 11.4619C13.0475 11.7445 12.9803 12.1348 12.6977 12.3338C12.5882 12.4114 12.4625 12.4484 12.3375 12.4484Z" fill="#7B818F"/>
  </svg>
));

IconTabYuanbaoOff.displayName = 'IconTabYuanbaoOff';

export default IconTabYuanbaoOff;
