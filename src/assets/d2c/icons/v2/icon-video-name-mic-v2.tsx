import React from 'react';

interface IconVideoNameMicV2Props {
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

/** IconVideoNameMicV2 - Figma nodeId: 532:13485 */
const IconVideoNameMicV2: React.FC<IconVideoNameMicV2Props> = React.memo(({
  width = 9,
  height = 12,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 10 13"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M1.72382 3.51361C1.72382 1.5731 3.13961 0 4.88607 0C6.63253 0 8.04831 1.5731 8.04831 3.51361V5.62143C8.04831 7.56194 6.63253 9.13503 4.88607 9.13503C3.13961 9.13503 1.72382 7.56194 1.72382 5.62143V3.51361Z" fill="#4E5461"/>
    <path d="M8.39869 7.64981C8.44467 7.54309 8.56531 7.48553 8.67456 7.52526L9.64732 7.87936C9.75633 7.91927 9.81259 8.04055 9.76879 8.14803C9.06599 9.86105 7.48594 11.1197 5.58643 11.37V12.7885C5.58643 12.9046 5.49247 12.999 5.37644 12.9995H4.39235C4.27592 12.9995 4.18133 12.9049 4.18133 12.7885V11.3679C2.28909 11.1126 0.716189 9.85617 0.0154407 8.14803C-0.0286331 8.04035 0.0285767 7.91916 0.137936 7.87936L1.10967 7.52526C1.21891 7.48582 1.33974 7.54303 1.38554 7.64981C1.96852 9.01055 3.32062 9.96179 4.89263 9.96179C6.46425 9.96149 7.81576 9.01025 8.39869 7.64981Z" fill="#4E5461"/>
  </svg>
));

IconVideoNameMicV2.displayName = 'IconVideoNameMicV2';

export default IconVideoNameMicV2;
