import React from 'react';

interface IconTabCloseProps {
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

/** IconTabClose - Figma nodeId: 504:11067 */
const IconTabClose: React.FC<IconTabCloseProps> = React.memo(({
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
    <path d="M13.9795 5.17676C14.2133 4.94191 14.5914 4.94191 14.8252 5.17676C15.0588 5.41162 15.0588 5.79156 14.8252 6.02637L10.8457 10.0244L14.8242 14.0215C15.0573 14.2563 15.0576 14.6364 14.8242 14.8711C14.5905 15.1059 14.2113 15.1058 13.9775 14.8711L10 10.874L6.02246 14.8711C5.78881 15.1056 5.41047 15.1055 5.17676 14.8711C4.9431 14.6363 4.94321 14.2554 5.17676 14.0205L9.1543 10.0234L5.17578 6.02637C4.94205 5.79151 4.9421 5.41164 5.17578 5.17676C5.40953 4.9419 5.78774 4.94189 6.02148 5.17676L10 9.17383L13.9795 5.17676Z" fill="#4E5461"/>
  </svg>
));

IconTabClose.displayName = 'IconTabClose';

export default IconTabClose;
