import React from 'react';

interface IconWindowProps {
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

/** IconWindow - Figma nodeId: 221:30119 */
const IconWindow: React.FC<IconWindowProps> = React.memo(({
  width = 20,
  height = 20,
  color = '#4E5461',
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
    <path d="M14.499 9.67578C15.332 9.67578 15.9988 10.3242 15.999 11.1348V14.541C15.9988 15.3517 15.3321 16 14.499 16H11C10.1669 16 9.5002 15.3517 9.5 14.541V11.1348C9.50026 10.3242 10.167 9.67578 11 9.67578H14.499ZM11 10.6484C10.7335 10.6484 10.5003 10.8755 10.5 11.1348V14.541C10.5002 14.8003 10.7335 15.0273 11 15.0273H14.499C14.7655 15.0273 14.9988 14.8003 14.999 14.541V11.1348C14.9987 10.8755 14.7655 10.6484 14.499 10.6484H11ZM12.7666 4C13.5995 4.00015 14.2654 4.64849 14.2656 5.45898V7.40527C14.2656 7.66458 14.033 7.89133 13.7666 7.8916C13.5 7.8916 13.2666 7.66473 13.2666 7.40527V5.45898C13.2663 5.19982 13.0329 4.97283 12.7666 4.97266H5.50098C5.23452 4.97266 5.00126 5.19972 5.00098 5.45898V12.4971C5.00098 12.7565 5.23436 12.9834 5.50098 12.9834H7.33398C7.60058 12.9834 7.83398 13.2435 7.83398 13.5029C7.83385 13.7623 7.6005 13.9892 7.33398 13.9893H5.50098C4.66779 13.9893 4.00098 13.3401 4.00098 12.5293V5.45898C4.00124 4.6484 4.66795 4 5.50098 4H12.7666Z" fill={color} strokeWidth="0.2" stroke={color}/>
  </svg>
));

IconWindow.displayName = 'IconWindow';

export default IconWindow;
