import React from 'react';

interface IconStatusSpinnerProps {
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

/** IconStatusSpinner - Figma nodeId: 262:1301 */
const IconStatusSpinner: React.FC<IconStatusSpinnerProps> = React.memo(({
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
    <path d="M12 5.75C13.2361 5.75 14.4445 6.11656 15.4723 6.80331C16.5001 7.49007 17.3012 8.46619 17.7742 9.60823C18.2473 10.7503 18.3711 12.0069 18.1299 13.2193C17.8888 14.4317 17.2935 15.5453 16.4194 16.4194C15.5453 17.2935 14.4317 17.8888 13.2193 18.1299C12.0069 18.3711 10.7503 18.2473 9.60823 17.7742C8.46619 17.3012 7.49007 16.5001 6.80331 15.4723C6.11656 14.4445 5.75 13.2361 5.75 12" strokeWidth="1.5" strokeLinecap="round" stroke="#9298A5"/>
  </svg>
));

IconStatusSpinner.displayName = 'IconStatusSpinner';

export default IconStatusSpinner;
