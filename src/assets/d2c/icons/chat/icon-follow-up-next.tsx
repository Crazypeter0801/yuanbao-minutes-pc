import React from 'react';

interface IconFollowUpNextProps {
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

/** IconFollowUpNext - Figma nodeId: I14355:74961;1396:5170;14355:75191 */
const IconFollowUpNext: React.FC<IconFollowUpNextProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M16.8682 10.8685H9.0004C7.67619 10.8685 7.01409 10.8685 6.46958 10.7285C4.90052 10.3251 3.67528 9.09988 3.27186 7.53082C3.13186 6.98631 3.13186 6.32421 3.13186 5M12.7367 15L16.8682 10.8685L12.7367 6.73709" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconFollowUpNext.displayName = 'IconFollowUpNext';

export default IconFollowUpNext;
