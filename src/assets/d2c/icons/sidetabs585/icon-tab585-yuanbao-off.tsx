import React from 'react';

interface IconTab585YuanbaoOffProps {
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

/** IconTab585YuanbaoOff - Figma nodeId: 585:68700 */
const IconTab585YuanbaoOff: React.FC<IconTab585YuanbaoOffProps> = React.memo(({
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
    <path d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM4.02637 1.12891C1.28341 3.7328 0.949666 7.85656 3.30664 10.4219C5.70096 13.0278 9.96365 13.0371 12.8281 10.4424C14.2604 9.14524 14.4508 7.03675 13.2529 5.7334C12.0557 4.43006 9.92373 4.4258 8.49219 5.72363C7.05996 7.02129 4.92958 7.01616 3.73242 5.71289C2.57248 4.45095 2.71421 2.43364 4.02637 1.12891ZM6.40918 7.09766C6.94885 7.09766 7.18848 7.3241 7.18848 8.53027C7.18843 9.73542 6.9488 9.96191 6.40918 9.96191C5.86973 9.96185 5.62993 9.73594 5.62988 8.53027C5.62988 7.32428 5.86967 7.09772 6.40918 7.09766ZM9.45215 7.32812C9.60378 7.09723 9.91461 7.03294 10.1455 7.18457C10.3762 7.33626 10.4396 7.64614 10.2881 7.87695L9.84473 8.55273L10.2793 9.16992C10.4384 9.39594 10.3851 9.70797 10.1592 9.86719C10.0717 9.92916 9.97095 9.95893 9.87109 9.95898C9.71395 9.95898 9.55812 9.88463 9.46094 9.74609L8.83008 8.85156C8.71153 8.68339 8.70825 8.45971 8.82129 8.28809L9.45215 7.32812Z" fill="#4E5461"/>
  </svg>
));

IconTab585YuanbaoOff.displayName = 'IconTab585YuanbaoOff';

export default IconTab585YuanbaoOff;
