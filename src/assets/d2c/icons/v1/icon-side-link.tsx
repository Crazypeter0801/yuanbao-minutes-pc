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

/** IconSideLink - Figma nodeId: 316:2697 */
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
    <path d="M8.00207 9.49922C8.56605 10.0632 8.84803 10.3452 9.15402 10.4926C9.70256 10.7569 10.3416 10.7569 10.8901 10.4926C11.1961 10.3452 11.4781 10.0632 12.0421 9.49921L12.8871 8.65423C12.8878 8.65355 12.8881 8.65322 12.8884 8.65293C13.8639 7.67675 13.8639 6.09473 12.8884 5.11855C12.8881 5.11826 12.8878 5.11792 12.8871 5.11724C12.8864 5.11657 12.8861 5.11623 12.8858 5.11594C11.9104 4.14115 10.3298 4.14028 9.35332 5.114C9.35304 5.11429 9.3527 5.11463 9.35202 5.1153L8.87707 5.58921M10.0021 8.49921C9.43805 7.93519 9.15604 7.65318 8.85002 7.50576C8.30154 7.24154 7.66258 7.24152 7.11409 7.50572C6.80806 7.65313 6.52604 7.93513 5.96199 8.49913L5.11666 9.34439C5.11636 9.34469 5.11621 9.34484 5.11609 9.34496C4.14004 10.3212 4.14001 11.9038 5.11603 12.8801C5.11616 12.8802 5.1163 12.8804 5.1166 12.8807C5.1169 12.8809 5.11705 12.8811 5.11717 12.8812C6.09498 13.8587 7.68057 13.8569 8.65617 12.8772C8.65629 12.8771 8.65644 12.8769 8.65674 12.8766L9.12207 12.4092" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconSideLink.displayName = 'IconSideLink';

export default IconSideLink;
