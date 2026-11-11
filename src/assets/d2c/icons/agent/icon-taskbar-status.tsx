import React from 'react';

interface IconTaskbarStatusProps {
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

/** IconTaskbarStatus - Figma nodeId: 204:291 */
const IconTaskbarStatus: React.FC<IconTaskbarStatusProps> = React.memo(({
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
    <g clipPath="url(#clip0_204_291)">
    <path d="M14.4001 8.00001C14.4001 11.5346 11.5347 14.4 8.0001 14.4C4.46548 14.4 1.6001 11.5346 1.6001 8.00001C1.6001 4.46538 4.46548 1.60001 8.0001 1.60001C11.5347 1.60001 14.4001 4.46538 14.4001 8.00001Z" strokeWidth="2.2" stroke="#D5EFE1"/>
    <path d="M7.99999 1.60001C9.00976 1.60022 10.0051 1.83935 10.9048 2.29787C11.8045 2.75639 12.5829 3.42128 13.1764 4.2382C13.7699 5.05512 14.1617 6.00088 14.3198 6.9982C14.4778 7.99552 14.3977 9.01609 14.0858 9.97649C13.774 10.9369 13.2393 11.8099 12.5255 12.5241C11.8117 13.2383 10.9391 13.7735 9.97883 14.086C9.01862 14.3984 7.9981 14.4792 7.00069 14.3217C6.00327 14.1643 5.05727 13.773 4.23999 13.18" strokeWidth="2.2" strokeLinecap="round" stroke="#16B364"/>
    </g>
    <defs>
    <clipPath id="clip0_204_291">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
  </svg>
));

IconTaskbarStatus.displayName = 'IconTaskbarStatus';

export default IconTaskbarStatus;
