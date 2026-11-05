import React from 'react';

interface IconToolFileProps {
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

/** IconToolFile - Figma nodeId: 36:10722 */
const IconToolFile: React.FC<IconToolFileProps> = React.memo(({
  width = 18,
  height = 18,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M14.9998 6.75V11.38C14.9998 13.1722 14.9998 14.0682 14.651 14.7528C14.3442 15.3549 13.8547 15.8444 13.2525 16.1512C12.568 16.5 11.6719 16.5 9.87977 16.5L8.12025 16.5C6.32813 16.5 5.43206 16.5 4.74755 16.1512C4.14544 15.8444 3.65591 15.3549 3.34911 14.7528C3.00032 14.0683 3.0003 13.1723 3.00025 11.3801L3.00013 6.62013C3.00009 4.82793 3.00006 3.93182 3.34883 3.24729C3.65562 2.64516 4.14516 2.1556 4.74729 1.8488C5.43181 1.50001 6.32792 1.50001 8.12012 1.5L9.74977 1.5L14.9998 6.75ZM9.74977 1.5V3.15C9.74977 4.41012 9.74977 5.04018 9.99501 5.52148C10.2107 5.94484 10.5549 6.28905 10.9783 6.50476C11.4596 6.75 12.0897 6.75 13.3498 6.75H14.9998M11.9998 9.75H5.99977M11.9998 12.75H5.99977" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" stroke="#0D0D0D"/>
  </svg>
));

IconToolFile.displayName = 'IconToolFile';

export default IconToolFile;
