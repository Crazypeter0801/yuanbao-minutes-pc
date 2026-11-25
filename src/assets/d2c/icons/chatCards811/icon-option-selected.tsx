import React from 'react';

interface IconOptionSelectedProps {
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

/** IconOptionSelected - Figma nodeId: I1025:12796;1268:22172 */
const IconOptionSelected: React.FC<IconOptionSelectedProps> = React.memo(({
  width = 20,
  height = 20,
  color = '#3A83F7',
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
    <circle cx="10" cy="10" r="10" fill={color} />
    <path d="M13.4091 6.65918C13.7352 6.33309 14.2647 6.33309 14.5908 6.65918C14.9168 6.98527 14.9168 7.51473 14.5908 7.84082L9.09076 13.3408C8.76467 13.6669 8.2352 13.6669 7.90912 13.3408L5.40912 10.8408C5.08303 10.5147 5.08303 9.98527 5.40912 9.65918C5.7352 9.33309 6.26467 9.33309 6.59076 9.65918L8.49994 11.5684L13.4091 6.65918Z" fill="white" />
  </svg>
));

IconOptionSelected.displayName = 'IconOptionSelected';

export default IconOptionSelected;
