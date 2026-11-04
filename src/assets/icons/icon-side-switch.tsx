import React from 'react';

interface IconSideSwitchProps {
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

/** IconSideSwitch - Figma nodeId: 246:6311 */
const IconSideSwitch: React.FC<IconSideSwitchProps> = React.memo(({
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
    <path d="M12.2188 9.14038C12.4947 9.14058 12.7188 9.36436 12.7188 9.64038C12.7185 9.91622 12.4946 10.1402 12.2188 10.1404H5.18164L6.67578 11.363C6.88913 11.538 6.92085 11.8526 6.74609 12.0662C6.57133 12.2797 6.25666 12.3109 6.04297 12.1365L3.46484 10.0271C3.30136 9.89334 3.23966 9.67138 3.31055 9.47241C3.3816 9.27338 3.56991 9.14038 3.78125 9.14038H12.2188ZM9.25391 3.93335C9.42877 3.71963 9.74429 3.68817 9.95801 3.86304L12.5361 5.97241C12.699 6.10625 12.7612 6.32845 12.6904 6.5271C12.6194 6.72592 12.4299 6.85898 12.2188 6.85913H3.78125C3.50536 6.85896 3.28143 6.63501 3.28125 6.35913C3.28125 6.08309 3.50525 5.8593 3.78125 5.85913H10.8184L9.32422 4.63647C9.11072 4.46163 9.07925 4.14701 9.25391 3.93335Z" fill="#4E5461"/>
  </svg>
));

IconSideSwitch.displayName = 'IconSideSwitch';

export default IconSideSwitch;
