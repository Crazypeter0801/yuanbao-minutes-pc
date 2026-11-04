import React from 'react';

interface IconTbMembersProps {
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

/** IconTbMembers - Figma nodeId: 245:5892 */
const IconTbMembers: React.FC<IconTbMembersProps> = React.memo(({
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
    <path d="M16.9995 14C19.3671 14 21.1376 14.7478 22.1206 15.2988C22.7027 15.6254 22.9995 16.2612 22.9995 16.9287V19H17.9995V17.4053C17.9995 16.2355 17.4735 15.0085 16.3159 14.3594C16.1483 14.2654 15.9653 14.1676 15.7671 14.0684C16.1573 14.0245 16.5685 14 16.9995 14Z" fill="#4E5461"/>
    <path d="M20 10C20 11.6569 18.6569 13 17 13C15.3431 13 14 11.6569 14 10C14 8.34315 15.3431 7 17 7C18.6569 7 20 8.34315 20 10Z" fill="#4E5461"/>
    <path d="M9 13.5C11.6259 13.5 13.7003 14.1899 15.0781 14.8447C15.526 15.0576 15.7501 15.1639 16.1133 15.5244C16.3625 15.7719 16.7135 16.3268 16.8301 16.6582C16.9999 17.1413 17 17.5104 17 18.248V20H1V18.248C1 17.5104 1.00005 17.1413 1.16992 16.6582C1.28653 16.3268 1.63745 15.7719 1.88672 15.5244C2.24986 15.1639 2.47399 15.0576 2.92188 14.8447C4.29967 14.1899 6.37412 13.5 9 13.5ZM9 4C11.2091 4 13 5.79086 13 8C13 10.2091 11.2091 12 9 12C6.79086 12 5 10.2091 5 8C5 5.79086 6.79086 4 9 4Z" fill="#4E5461"/>
    <rect x="5" y="4" width="8" height="8" rx="4" fill="#4E5461"/>
    <rect x="14" y="7" width="6" height="6" rx="3" fill="#4E5461"/>
  </svg>
));

IconTbMembers.displayName = 'IconTbMembers';

export default IconTbMembers;
