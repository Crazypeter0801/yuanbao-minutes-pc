import React from 'react';

interface IconAgentCloseProps {
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

/** IconAgentClose - Figma nodeId: 214:11060 */
const IconAgentClose: React.FC<IconAgentCloseProps> = React.memo(({
  width = 24,
  height = 21,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 21"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M17.9784 5.17688C18.2122 4.94202 18.5904 4.94203 18.8241 5.17688C19.0578 5.41175 19.0579 5.79163 18.8241 6.02649L14.8446 10.0245L18.8231 14.0216C19.0565 14.2565 19.0567 14.6364 18.8231 14.8712C18.5895 15.106 18.2112 15.1058 17.9774 14.8712L13.9989 10.8741L10.0214 14.8712C9.78763 15.1055 9.40928 15.1057 9.17567 14.8712C8.94201 14.6364 8.94213 14.2555 9.17567 14.0206L13.1532 10.0235L9.17469 6.02649C8.94104 5.7917 8.94121 5.41177 9.17469 5.17688C9.40845 4.94202 9.78665 4.94201 10.0204 5.17688L13.9989 9.17395L17.9784 5.17688Z" fill="#4E5461"/>
  </svg>
));

IconAgentClose.displayName = 'IconAgentClose';

export default IconAgentClose;
