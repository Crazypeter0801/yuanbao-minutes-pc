import React from 'react';

interface IconTaskEntryIconFilePlusProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  [key: string]: unknown;
}

/** Icon/File plus - Figma nodeId: 268:25270 */
const IconTaskEntryIconFilePlus: React.FC<IconTaskEntryIconFilePlusProps> = React.memo(({
  width = 16,
  height = 16,
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
    <path
      d="M7.66723 14.6667H5.86719C4.7471 14.6667 4.18706 14.6667 3.75924 14.4487C3.38292 14.2569 3.07696 13.951 2.88521 13.5747C2.66722 13.1469 2.66721 12.5868 2.66719 11.4667L2.66705 4.5334C2.66703 3.41328 2.66702 2.85321 2.88501 2.42538C3.07675 2.04905 3.38271 1.74308 3.75904 1.55133C4.18687 1.33334 4.74693 1.33334 5.86705 1.33334L8.66721 1.33333L13.3339 6V7.66667M8.66721 1.33333V4.4C8.66721 4.96005 8.66721 5.24008 8.77621 5.45399C8.87208 5.64215 9.02506 5.79513 9.21322 5.89101C9.42713 6 9.70716 6 10.2672 6H13.3339M12.3333 14.6667V12.3333M12.3333 12.3333V10M12.3333 12.3333H10M12.3333 12.3333H14.6667"
      stroke="#7B818F"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

IconTaskEntryIconFilePlus.displayName = 'IconTaskEntryIconFilePlus';

export default IconTaskEntryIconFilePlus;
