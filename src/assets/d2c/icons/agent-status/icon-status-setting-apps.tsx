import React from 'react';

interface IconStatusSettingAppsProps {
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

/** IconStatusSettingApps - Figma nodeId: I243:1190;257:1459 */
const IconStatusSettingApps: React.FC<IconStatusSettingAppsProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor', // Figma: #black
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
    <path d="M12.3176 17.7498H6.3361C5.02239 17.7498 4.36554 17.7498 3.86377 17.4942C3.4224 17.2693 3.06356 16.9104 2.83867 16.4691C2.58301 15.9673 2.58301 15.3105 2.58301 13.9968V13.3517C3.87849 13.3517 4.92869 12.3015 4.92869 11.006C4.92869 9.71053 3.87849 8.66033 2.58301 8.66033V7.96589C2.58301 6.69875 2.58301 6.06518 2.82135 5.57765C3.05057 5.10878 3.4296 4.72974 3.89847 4.50052C4.38601 4.26218 5.01958 4.26218 6.28671 4.26218C6.51583 4.26218 6.63039 4.26218 6.70697 4.23256C6.79823 4.19726 6.83407 4.17071 6.89444 4.09369C6.94509 4.02908 6.99093 3.87859 7.08261 3.57764C7.37554 2.61609 8.26949 1.9165 9.32684 1.9165C10.3842 1.9165 11.2781 2.61609 11.5711 3.57764C11.6627 3.87858 11.7086 4.02908 11.7592 4.09369C11.8196 4.17071 11.8554 4.19726 11.9467 4.23256C12.0233 4.26218 12.1378 4.26218 12.367 4.26218C13.6341 4.26218 14.2677 4.26218 14.7552 4.50052C15.2241 4.72974 15.6031 5.10878 15.8323 5.57765C16.0707 6.06518 16.0707 6.69875 16.0707 7.96589V8.66033C17.3661 8.66033 18.4163 9.71053 18.4163 11.006C18.4163 12.3015 17.3661 13.3517 16.0707 13.3517V13.9968C16.0707 15.3105 16.0707 15.9673 15.815 16.4691C15.5901 16.9104 15.2313 17.2693 14.7899 17.4942C14.2881 17.7498 13.6313 17.7498 12.3176 17.7498Z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color} strokeOpacity="0.9"/>
  </svg>
));

IconStatusSettingApps.displayName = 'IconStatusSettingApps';

export default IconStatusSettingApps;
