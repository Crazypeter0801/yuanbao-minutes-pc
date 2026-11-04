import React from 'react';

interface IconTbInviteHeadProps {
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

/** IconTbInviteHead - Figma nodeId: 316:2091 */
const IconTbInviteHead: React.FC<IconTbInviteHeadProps> = React.memo(({
  width = 8,
  height = 8,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 8 8"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M4 0C6.20914 0 8 1.79086 8 4C8 6.20914 6.20914 8 4 8C1.79086 8 0 6.20914 0 4C0 1.79086 1.79086 0 4 0ZM3.76042 2C3.6282 2.00022 3.52106 2.10737 3.52083 2.23958V3.51979H2.23958C2.10723 3.52002 2 3.62801 2 3.76042V4.23958C2 4.37199 2.10723 4.47998 2.23958 4.48021H3.52083V5.76042C3.52106 5.89263 3.6282 5.99978 3.76042 6H4.24062C4.37303 6 4.48103 5.89277 4.48125 5.76042V4.48021H5.76042C5.89277 4.47998 6 4.37199 6 4.23958V3.76042C6 3.62801 5.89277 3.52002 5.76042 3.51979H4.48125V2.23958C4.48103 2.10723 4.37303 2 4.24062 2H3.76042Z" fill="#373C48"/>
  </svg>
));

IconTbInviteHead.displayName = 'IconTbInviteHead';

export default IconTbInviteHead;
