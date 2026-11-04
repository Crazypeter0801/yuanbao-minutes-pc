import React from 'react';

interface IconTbRecordProps {
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

/** IconTbRecord - Figma nodeId: 316:2104 */
const IconTbRecord: React.FC<IconTbRecordProps> = React.memo(({
  width = 56,
  height = 44,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 56 44"
    fill="none"
    className={className}
    {...props}
  >
    <rect x="44" y="32" width="12" height="12" rx="6" fill="white" fillOpacity="0.01"/>
    <path d="M35.5556 15C35.5556 19.1728 32.1728 22.5556 28 22.5556C23.8272 22.5556 20.4444 19.1728 20.4444 15C20.4444 10.8272 23.8272 7.44444 28 7.44444C32.1728 7.44444 35.5556 10.8272 35.5556 15Z" strokeWidth="1.88889" stroke="#373C48"/>
    <circle cx="28" cy="15.0001" r="5.19444" fill="#373C48"/>
    <path d="M47.5 15.5L50.0004 13L52.5 15.5" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconTbRecord.displayName = 'IconTbRecord';

export default IconTbRecord;
