import React from 'react';

interface IconTbInviteBodyProps {
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

/** IconTbInviteBody - Figma nodeId: 316:2098 */
const IconTbInviteBody: React.FC<IconTbInviteBodyProps> = React.memo(({
  width = 12,
  height = 7,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 12 7"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M8.52002 0C9.81027 0 10.975 0.158338 12 0.395216C11.1649 1.25775 10.65 2.43214 10.65 3.72751C10.65 4.95512 11.112 6.07459 11.871 6.92252H2.50234C2.15682 6.92252 1.98374 6.92275 1.83879 6.90276C0.893689 6.77226 0.150258 6.02883 0.0197608 5.08372C-0.000235704 4.93877 0 4.7657 0 4.42018C8.10795e-09 4.32195 0.000363291 4.27276 0.0145606 4.12272C0.0879045 3.34768 0.782047 2.18964 1.4311 1.75975C1.55627 1.67681 1.42726 1.74576 1.47894 1.71815C2.91204 0.952562 5.33501 0 8.52002 0Z" fill="#373C48"/>
  </svg>
));

IconTbInviteBody.displayName = 'IconTbInviteBody';

export default IconTbInviteBody;
