import React from 'react';

interface IconSideLinkProps {
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

/** IconSideLink - Figma nodeId: 248:14898 */
const IconSideLink: React.FC<IconSideLinkProps> = React.memo(({
  width = 18,
  height = 18,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    className={className}
    {...props}
  >
    <rect width="18" height="18" rx="9" fill="#E6E8EB"/>
    <path d="M8.00183 9.49934C8.5658 10.0633 8.84779 10.3453 9.15378 10.4927C9.70231 10.757 10.3414 10.757 10.8899 10.4927C11.1959 10.3453 11.4779 10.0633 12.0418 9.49934L12.8868 8.65435C12.8875 8.65368 12.8878 8.65334 12.8881 8.65305C13.8637 7.67687 13.8637 6.09485 12.8881 5.11867C12.8879 5.11838 12.8875 5.11804 12.8868 5.11737C12.8862 5.11669 12.8858 5.11635 12.8855 5.11607C11.9101 4.14127 10.3296 4.1404 9.35308 5.11413C9.35279 5.11441 9.35246 5.11475 9.35178 5.11542L8.87683 5.58933M10.0018 8.49934C9.43781 7.93531 9.15579 7.6533 8.84977 7.50588C8.3013 7.24166 7.66233 7.24165 7.11384 7.50585C6.80781 7.65325 6.52579 7.93525 5.96174 8.49925L5.11641 9.34451C5.11612 9.34481 5.11597 9.34496 5.11584 9.34508C4.13979 10.3213 4.13977 11.9039 5.11579 12.8802C5.11591 12.8803 5.11606 12.8805 5.11636 12.8808C5.11665 12.8811 5.1168 12.8812 5.11693 12.8813C6.09474 13.8589 7.68032 13.8571 8.65592 12.8773C8.65605 12.8772 8.6562 12.8771 8.65649 12.8768L9.12183 12.4093" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconSideLink.displayName = 'IconSideLink';

export default IconSideLink;
