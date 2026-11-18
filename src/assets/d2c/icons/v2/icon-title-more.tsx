import React from 'react';

interface IconTitleMoreProps {
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

/** IconTitleMore - Figma nodeId: 439:21128 */
const IconTitleMore: React.FC<IconTitleMoreProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 28 28"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M10.7 20.5H17.3C18.4201 20.5 18.9802 20.5 19.408 20.282C19.7843 20.0903 20.0903 19.7843 20.282 19.408C20.5 18.9802 20.5 18.4201 20.5 17.3V10.7C20.5 9.57989 20.5 9.01984 20.282 8.59202C20.0903 8.21569 19.7843 7.90973 19.408 7.71799C18.9802 7.5 18.4201 7.5 17.3 7.5H10.7C9.57989 7.5 9.01984 7.5 8.59202 7.71799C8.21569 7.90973 7.90973 8.21569 7.71799 8.59202C7.5 9.01984 7.5 9.57989 7.5 10.7V17.3C7.5 18.4201 7.5 18.9802 7.71799 19.408C7.90973 19.7843 8.21569 20.0903 8.59202 20.282C9.01984 20.5 9.57989 20.5 10.7 20.5Z" strokeWidth="1.2" stroke="#373C48"/>
    <rect x="15.1125" y="7.5" width="1.2" height="13" rx="0.6" fill="#373C48"/>
  </svg>
));

IconTitleMore.displayName = 'IconTitleMore';

export default IconTitleMore;
