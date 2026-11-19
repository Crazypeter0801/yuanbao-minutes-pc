import React from 'react';

interface IconArtifactChevronProps {
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

/** IconArtifactChevron - Figma nodeId: 14330:23476 */
const IconArtifactChevron: React.FC<IconArtifactChevronProps> = React.memo(({
  width = 16,
  height = 16,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M6.07617 4.57617C6.28114 4.3712 6.59721 4.3454 6.83008 4.49902L6.92383 4.57617L9.89355 7.54492L9.98633 7.64746C10.4192 8.17771 10.3879 8.96069 9.89355 9.45508L6.92383 12.4238C6.68951 12.6581 6.31049 12.6581 6.07617 12.4238C5.84206 12.1895 5.84192 11.8104 6.07617 11.5762L9.04492 8.60645C9.08892 8.56244 9.10023 8.49758 9.07812 8.44336L9.04492 8.39355L6.07617 5.42383L5.99902 5.33008C5.8454 5.09721 5.8712 4.78114 6.07617 4.57617Z" fill="#A6A6A6"/>
  </svg>
));

IconArtifactChevron.displayName = 'IconArtifactChevron';

export default IconArtifactChevron;
