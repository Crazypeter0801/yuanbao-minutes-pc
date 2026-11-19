import React from 'react';

interface IconTabPipProps {
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

/** IconTabPip - Figma nodeId: 504:11061 */
const IconTabPip: React.FC<IconTabPipProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
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
    <path d="M8.52954 4.5H7.49927C5.84241 4.5 4.49927 5.84315 4.49927 7.5V12.5C4.49927 14.1569 5.84241 15.5 7.49927 15.5H12.4993C14.1561 15.5 15.4993 14.1569 15.4993 12.5V11.553" strokeWidth="1.2" strokeLinecap="round" stroke="#4E5461"/>
    <path d="M11.9993 9.5H13.9993C14.8277 9.5 15.4993 8.82843 15.4993 8V6C15.4993 5.17157 14.8277 4.5 13.9993 4.5H11.9993C11.1708 4.5 10.4993 5.17157 10.4993 6V8C10.4993 8.82843 11.1708 9.5 11.9993 9.5Z" strokeWidth="1.2" stroke="#4E5461"/>
  </svg>
));

IconTabPip.displayName = 'IconTabPip';

export default IconTabPip;
