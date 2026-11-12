import React from 'react';

interface IconSaveProps {
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

/** IconSave - Figma nodeId: I221:30127;221:23526 */
const IconSave: React.FC<IconSaveProps> = React.memo(({
  width = 20,
  height = 20,
  color = '#373C48',
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
    <path d="M10.0031 3.5V11.7M6.80313 8.7L10.0031 11.9L13.2031 8.7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
    <path d="M3.60001 12.9004V15.1004C3.60001 15.2842 3.63622 15.4663 3.70657 15.6361C3.77693 15.806 3.88005 15.9603 4.01006 16.0903C4.14006 16.2203 4.29439 16.3235 4.46425 16.3938C4.6341 16.4642 4.81616 16.5004 5.00001 16.5004H15C15.1839 16.5004 15.3659 16.4642 15.5358 16.3938C15.7056 16.3235 15.86 16.2203 15.99 16.0903C16.12 15.9603 16.2231 15.806 16.2934 15.6361C16.3638 15.4663 16.4 15.2842 16.4 15.1004V12.9004" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconSave.displayName = 'IconSave';

export default IconSave;
