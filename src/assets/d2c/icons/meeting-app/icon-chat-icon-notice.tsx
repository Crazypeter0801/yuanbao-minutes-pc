import React from 'react';

interface IconChatIconNoticeProps {
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

/** IconChatIconNotice - Figma nodeId: 305:39525 */
const IconChatIconNotice: React.FC<IconChatIconNoticeProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 57"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M2.91725 7.03172L2.96249 15.0226C2.97038 16.4156 2.97432 17.1121 3.24789 17.6438C3.48855 18.1115 3.87062 18.4914 4.3397 18.7294C4.87294 19 5.56944 19 6.96242 19H13.4945C14.8946 19 15.5947 19 16.1295 18.7275C16.5999 18.4878 16.9823 18.1054 17.222 17.635C17.4945 17.1002 17.4945 16.4002 17.4945 15.0002V8.45242L17.4862 6.82522V6.82521C17.4793 5.4909 17.4759 4.82375 17.2143 4.31382C16.9842 3.86521 16.6187 3.50047 16.1696 3.27133C15.6591 3.01087 14.992 3.00889 13.6576 3.00493L11.9996 3L6.91005 3.00908C5.50501 3.01158 4.80249 3.01284 4.26715 3.2876C3.79627 3.52927 3.41425 3.91415 3.17609 4.38681C2.90532 4.92419 2.90929 5.6267 2.91725 7.03172Z" fill="#0066FF"/>
    <path d="M6 7H14M6 11H14M6 15H11.1429" strokeWidth="1.5" strokeLinecap="round" stroke={color}/>
  </svg>
));

IconChatIconNotice.displayName = 'IconChatIconNotice';

export default IconChatIconNotice;
