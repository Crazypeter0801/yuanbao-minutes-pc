import React from 'react';

interface IconBarRecordProps {
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

/** IconBarRecord - Figma nodeId: 416:20109 */
const IconBarRecord: React.FC<IconBarRecordProps> = React.memo(({
  width = 56,
  height = 30,
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
    <circle cx="28" cy="15" r="7.55556" strokeWidth="1.88889" stroke="#373C48"/>
    <circle cx="28" cy="15.0001" r="5.19444" fill="#373C48"/>
    <path d="M47.5 15.5L50.0004 13L52.5 15.5" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconBarRecord.displayName = 'IconBarRecord';

export default IconBarRecord;
