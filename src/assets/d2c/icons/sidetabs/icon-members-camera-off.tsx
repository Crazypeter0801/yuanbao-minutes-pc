import React from 'react';

interface IconMembersCameraOffProps {
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

/** IconMembersCameraOff - Figma nodeId: 504:11306 */
const IconMembersCameraOff: React.FC<IconMembersCameraOffProps> = React.memo(({
  width = 16,
  height = 16,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M2.85449 4.00586C2.3744 4.05882 2.00098 4.46575 2.00098 4.95996V11.04C2.0011 11.5701 2.43082 12 2.96094 12H9.5625L10.4854 13.0996C10.3492 13.1422 10.2078 13.1736 10.0615 13.1885L9.84082 13.2002H2.96094L2.74023 13.1885C1.72354 13.0854 0.914793 12.2774 0.811523 11.2607L0.800781 11.04V4.95996C0.800781 4.10315 1.30032 3.36394 2.02344 3.01465L2.85449 4.00586ZM10.0615 2.81055C11.1508 2.92109 12.001 3.84153 12.001 4.95996V5.12109L14.1064 4.49805C14.9522 4.2475 15.8013 4.88169 15.8018 5.76367V10.2354C15.8018 11.1177 14.9524 11.7516 14.1064 11.501L12.001 10.877V11.04L11.9941 11.1631L10.8008 9.74121V4.95996C10.8008 4.42978 10.371 4.00002 9.84082 4H5.98242L4.97559 2.7998H9.84082L10.0615 2.81055ZM14.4473 5.64941L12.001 6.37305V9.625L14.4473 10.3506C14.5242 10.3734 14.6016 10.3156 14.6016 10.2354V5.76367C14.6011 5.68382 14.5239 5.62674 14.4473 5.64941Z" fill="#B0B6C3"/>
    <path d="M2.39844 1.6001L12.683 13.8568" strokeWidth="1.2" strokeLinecap="round" stroke="#FA4E32"/>
  </svg>
));

IconMembersCameraOff.displayName = 'IconMembersCameraOff';

export default IconMembersCameraOff;
