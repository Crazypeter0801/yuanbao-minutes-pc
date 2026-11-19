import React from 'react';

interface IconTab574ChevronProps {
  /** 图标宽度，默认与 Figma 设计稿一致 */
  width?: number;
  /** 图标高度，默认与 Figma 设计稿一致 */
  height?: number;
  /** 图标主题色，默认取 Figma 574:16905 stroke (#7B818F / wm_color_text_tertiary) */
  color?: string;
  /** 自定义 className */
  className?: string;
  [key: string]: unknown;
}

/** IconTab574Chevron - Figma nodeId: 574:16905 (from 574:16890, 5x10, 1.2px #7B818F) */
const IconTab574Chevron: React.FC<IconTab574ChevronProps> = React.memo(({
  width = 5,
  height = 10,
  color = '#7B818F',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 5 10"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M0.78955 9.21061L3.94745 5.00008L0.78955 0.789551"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke={color}
    />
  </svg>
));

IconTab574Chevron.displayName = 'IconTab574Chevron';

export default IconTab574Chevron;
