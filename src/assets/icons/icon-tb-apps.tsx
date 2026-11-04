import React from 'react';

interface IconTbAppsProps {
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

/** IconTbApps - Figma nodeId: 245:5913 */
const IconTbApps: React.FC<IconTbAppsProps> = React.memo(({
  width = 54,
  height = 36,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 54 36"
    fill="none"
    className={className}
    {...props}
  >
    <rect width="54" height="36" rx="8" fill="black" fillOpacity="0.06"/>
    <rect x="19.2085" y="10.2016" width="7.33333" height="7.33333" fill="#4E5461"/>
    <rect x="19.2085" y="18.4396" width="7.33333" height="7.33333" fill="#4E5461"/>
    <rect x="27.4326" y="18.4396" width="7.33333" height="7.33333" fill="#4E5461"/>
    <path d="M30.4522 11.9271H29.1581V15.8094H33.0405V14.5153C33.0405 13.0859 31.8817 11.9271 30.4522 11.9271ZM27.4326 10.2016V17.5349H34.766V14.5153C34.766 12.1329 32.8346 10.2016 30.4522 10.2016H27.4326Z" fillRule="evenodd" clipRule="evenodd" fill="#4E5461"/>
  </svg>
));

IconTbApps.displayName = 'IconTbApps';

export default IconTbApps;
