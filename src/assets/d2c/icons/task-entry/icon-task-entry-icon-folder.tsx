import React from 'react';

interface IconTaskEntryIconFolderProps {
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

/** IconTaskEntryIconFolder - Figma nodeId: 215:22033 */
const IconTaskEntryIconFolder: React.FC<IconTaskEntryIconFolderProps> = React.memo(({
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
    <path d="M1.66663 9.33333L1.66665 7.8666C1.66667 6.74652 1.66668 6.18647 1.88467 5.75866C2.07642 5.38234 2.38238 5.07638 2.7587 4.88464C3.18652 4.66666 3.74656 4.66666 4.86665 4.66666H9.99996M14.3335 8.81482V9.73334C14.3335 11.2268 14.3335 11.9735 14.0429 12.544C13.7872 13.0457 13.3793 13.4537 12.8775 13.7094C12.3071 14 11.5603 14 10.0669 14H5.93336C4.43987 14 3.69312 14 3.12268 13.7094C2.62091 13.4537 2.21296 13.0457 1.95731 12.544C1.66666 11.9735 1.66667 11.2268 1.6667 9.73327L1.66677 5.19995C1.66679 4.07986 1.6668 3.51981 1.88479 3.09199C2.07654 2.71568 2.3825 2.40972 2.75882 2.21798C3.18665 2 3.74669 2 4.86678 2L6.06686 2C6.65352 2 6.94685 2.00001 7.21608 2.0769C7.45454 2.145 7.67825 2.25685 7.8758 2.40676C8.09885 2.57601 8.27485 2.81067 8.62685 3.28L9.35574 4.25186C9.46435 4.39667 9.51866 4.46908 9.58635 4.52267C9.6584 4.57973 9.74148 4.62127 9.83036 4.64468C9.91385 4.66667 10.0044 4.66667 10.1854 4.66667C11.5672 4.66667 12.258 4.66667 12.7938 4.91652C13.362 5.18148 13.8187 5.63816 14.0837 6.20636C14.3335 6.74215 14.3335 7.43304 14.3335 8.81482Z" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconTaskEntryIconFolder.displayName = 'IconTaskEntryIconFolder';

export default IconTaskEntryIconFolder;
