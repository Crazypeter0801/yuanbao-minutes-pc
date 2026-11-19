import React from 'react';

interface IconChat556FileProps {
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

/** IconChat556File - Figma nodeId: 556:9845 */
const IconChat556File: React.FC<IconChat556FileProps> = React.memo(({
  width = 24,
  height = 24,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M7.37695 4.95312C8.02241 4.95312 8.64219 5.20675 9.10254 5.65918L10.4668 7H17.9688C18.6485 7 19.2002 7.55169 19.2002 8.23145V17.0312C19.2 18.1187 18.3179 19 17.2305 19H6.66992C5.58243 19 4.70038 18.1187 4.7002 17.0312V6.92285C4.7002 5.83525 5.58232 4.95312 6.66992 4.95312H7.37695Z" fill="#4E5461"/>
  </svg>
));

IconChat556File.displayName = 'IconChat556File';

export default IconChat556File;
