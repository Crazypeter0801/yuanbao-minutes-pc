import React from 'react';

interface IconChat556SettingsProps {
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

/** IconChat556Settings - Figma nodeId: 556:10124 */
const IconChat556Settings: React.FC<IconChat556SettingsProps> = React.memo(({
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
    <path d="M14.8145 4.68848C15.6578 4.68853 16.4361 5.14085 16.8545 5.87305L19.6895 10.834C20.1023 11.5565 20.1023 12.4435 19.6895 13.166L16.8545 18.1279C16.4361 18.86 15.6577 19.3115 14.8145 19.3115H9.18555C8.34239 19.3114 7.5639 18.86 7.14551 18.1279L4.31055 13.166C3.89775 12.4435 3.89771 11.5565 4.31055 10.834L7.14551 5.87305C7.56388 5.1409 8.34232 4.6886 9.18555 4.68848H14.8145ZM12.2324 9.67969C10.9506 9.67969 9.91131 10.7182 9.91113 12C9.91113 13.2819 10.9505 14.3213 12.2324 14.3213C13.5143 14.3212 14.5537 13.2819 14.5537 12C14.5535 10.7183 13.5142 9.67977 12.2324 9.67969Z" fill="#4E5461"/>
  </svg>
));

IconChat556Settings.displayName = 'IconChat556Settings';

export default IconChat556Settings;
