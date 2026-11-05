import React from 'react';

interface IconMenuFileProps {
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

/** IconMenuFile - Figma nodeId: I727:60493;86:62631;27263:6722 */
const IconMenuFile: React.FC<IconMenuFileProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor', // Figma: #black
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
    <path d="M15.9996 7.9V12.2213C15.9996 13.894 15.9996 14.7304 15.6741 15.3693C15.3877 15.9312 14.9308 16.3881 14.3688 16.6745C13.73 17 12.8936 17 11.2209 17L9.57871 17C7.90606 17 7.06973 17 6.43086 16.6745C5.86889 16.3881 5.41199 15.9313 5.12564 15.3693C4.80011 14.7304 4.80008 13.8941 4.80004 12.2215L4.79993 7.77879C4.79988 6.10606 4.79986 5.2697 5.12538 4.6308C5.41172 4.06881 5.86862 3.6119 6.43061 3.32554C7.0695 3.00001 7.90586 3.00001 9.57859 3L11.0996 3L15.9996 7.9ZM11.0996 3V4.54C11.0996 5.71611 11.0996 6.30417 11.3285 6.75338C11.5298 7.14852 11.8511 7.46978 12.2462 7.67111C12.6954 7.9 13.2835 7.9 14.4596 7.9H15.9996M13.1996 10.7H7.59959M13.1996 13.5H7.59959" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconMenuFile.displayName = 'IconMenuFile';

export default IconMenuFile;
