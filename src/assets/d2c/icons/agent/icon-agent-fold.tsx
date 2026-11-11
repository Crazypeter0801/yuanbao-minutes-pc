import React from 'react';

interface IconAgentFoldProps {
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

/** IconAgentFold - Figma nodeId: 214:11132 */
const IconAgentFold: React.FC<IconAgentFoldProps> = React.memo(({
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
    <path d="M1.66675 9.33333L1.66677 7.8666C1.66679 6.74652 1.6668 6.18647 1.88479 5.75866C2.07654 5.38234 2.3825 5.07638 2.75882 4.88464C3.18664 4.66666 3.74669 4.66666 4.86677 4.66666H10.0001M14.3336 8.81482V9.73334C14.3336 11.2268 14.3336 11.9735 14.043 12.544C13.7873 13.0457 13.3794 13.4537 12.8776 13.7094C12.3072 14 11.5605 14 10.067 14H5.93348C4.43999 14 3.69324 14 3.12281 13.7094C2.62104 13.4537 2.21309 13.0457 1.95743 12.544C1.66678 11.9735 1.66679 11.2268 1.66682 9.73327L1.6669 5.19995C1.66691 4.07986 1.66692 3.51981 1.88491 3.09199C2.07666 2.71568 2.38262 2.40972 2.75895 2.21798C3.18677 2 3.74681 2 4.8669 2L6.06698 2C6.65364 2 6.94697 2.00001 7.21621 2.0769C7.45466 2.145 7.67837 2.25685 7.87593 2.40676C8.09898 2.57601 8.27497 2.81067 8.62697 3.28L9.35586 4.25186C9.46447 4.39667 9.51878 4.46908 9.58647 4.52267C9.65853 4.57973 9.7416 4.62127 9.83048 4.64468C9.91397 4.66667 10.0045 4.66667 10.1855 4.66667C11.5673 4.66667 12.2582 4.66667 12.794 4.91652C13.3622 5.18148 13.8188 5.63816 14.0838 6.20636C14.3336 6.74215 14.3336 7.43304 14.3336 8.81482Z" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconAgentFold.displayName = 'IconAgentFold';

export default IconAgentFold;
