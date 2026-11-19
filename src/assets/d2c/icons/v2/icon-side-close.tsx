import React from 'react';

interface IconSideCloseProps {
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

/** IconSideClose - Figma nodeId: 489:10614 */
const IconSideClose: React.FC<IconSideCloseProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 21"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M13.9785 5.17578C14.2123 4.94092 14.5914 4.94093 14.8252 5.17578C15.0587 5.41054 15.0586 5.79053 14.8252 6.02539L10.8457 10.0234L14.8232 14.0205C15.0568 14.2554 15.0569 14.6353 14.8232 14.8701C14.5896 15.1049 14.2113 15.1048 13.9775 14.8701L10 10.873L6.02246 14.8701C5.78868 15.1048 5.40948 15.1049 5.17578 14.8701C4.94238 14.6354 4.94258 14.2553 5.17578 14.0205L9.15332 10.0234L5.1748 6.02539C4.94152 5.79057 4.94144 5.41055 5.1748 5.17578C5.40856 4.94092 5.78774 4.94091 6.02148 5.17578L9.99902 9.17285L13.9785 5.17578Z" fill="#4E5461"/>
  </svg>
));

IconSideClose.displayName = 'IconSideClose';

export default IconSideClose;
