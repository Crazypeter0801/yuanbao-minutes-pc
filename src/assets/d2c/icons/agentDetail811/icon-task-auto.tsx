import React from 'react';

interface IconTaskAutoProps {
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

/** IconTaskAuto - Figma nodeId: 811:40978 */
const IconTaskAuto: React.FC<IconTaskAutoProps> = React.memo(({
  width = 36,
  height = 36,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 36 36"
    fill="none"
    className={className}
    {...props}
  >
    <g filter="url(#filter0_i_811_40978)">
    <path d="M0 10C0 4.47715 4.47715 0 10 0H26C31.5228 0 36 4.47715 36 10V26C36 31.5228 31.5228 36 26 36H10C4.47715 36 0 31.5228 0 26V10Z" fill="#F3F3F4"/>
    <path d="M17.9993 14.6665V17.9998L20.666 19.3332M24.3327 17.9998C24.3327 21.4976 21.4972 24.3332 17.9993 24.3332C14.5015 24.3332 11.666 21.4976 11.666 17.9998C11.666 14.502 14.5015 11.6665 17.9993 11.6665C21.4972 11.6665 24.3327 14.502 24.3327 17.9998Z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
    </g>
    <defs>
    <filter id="filter0_i_811_40978" x="0" y="0" width="36" height="36" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feMorphology radius="0.5" operator="erode" in="SourceAlpha" result="effect1_innerShadow_811_40978"/>
    <feOffset/>
    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.921569 0 0 0 0 0.929412 0 0 0 0 0.94902 0 0 0 1 0"/>
    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_811_40978"/>
    </filter>
    </defs>
  </svg>
));

IconTaskAuto.displayName = 'IconTaskAuto';

export default IconTaskAuto;
