import React from 'react';

interface IconModalCloseProps {
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

/** IconModalClose - Figma nodeId: 796:85430 */
const IconModalClose: React.FC<IconModalCloseProps> = React.memo(({
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
    <path d="M13.9795 5.17676C14.2133 4.9419 14.5914 4.94191 14.8252 5.17676C15.0587 5.41164 15.0589 5.79159 14.8252 6.02637L10.8447 10.0244L14.8242 14.0225C15.0573 14.2573 15.0575 14.6374 14.8242 14.8721C14.5905 15.1069 14.2113 15.1067 13.9775 14.8721L9.99902 10.874L6.02246 14.8701C5.78868 15.1048 5.40948 15.1049 5.17578 14.8701C4.94265 14.6353 4.94258 14.2552 5.17578 14.0205L9.15332 10.0244L5.17578 6.02734C4.94206 5.79249 4.94212 5.41262 5.17578 5.17773C5.40953 4.94287 5.78774 4.94286 6.02148 5.17773L9.99902 9.17383L13.9795 5.17676Z" fill="#4E5461"/>
  </svg>
));

IconModalClose.displayName = 'IconModalClose';

export default IconModalClose;
