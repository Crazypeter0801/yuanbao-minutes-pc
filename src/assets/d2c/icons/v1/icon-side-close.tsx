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

/** IconSideClose - Figma nodeId: 316:2647 */
const IconSideClose: React.FC<IconSideCloseProps> = React.memo(({
  width = 20,
  height = 21,
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
    <path d="M13.9785 5.17676C14.2123 4.9419 14.5905 4.94191 14.8242 5.17676C15.0579 5.41163 15.058 5.79151 14.8242 6.02637L10.8447 10.0244L14.8232 14.0215C15.0566 14.2564 15.0568 14.6363 14.8232 14.8711C14.5896 15.1059 14.2113 15.1057 13.9775 14.8711L9.99902 10.874L6.02148 14.8711C5.78774 15.1054 5.40939 15.1056 5.17578 14.8711C4.94212 14.6363 4.94224 14.2554 5.17578 14.0205L9.15332 10.0234L5.1748 6.02637C4.94115 5.79158 4.94132 5.41165 5.1748 5.17676C5.40856 4.9419 5.78676 4.94189 6.02051 5.17676L9.99902 9.17383L13.9785 5.17676Z" fill="#4E5461"/>
  </svg>
));

IconSideClose.displayName = 'IconSideClose';

export default IconSideClose;
