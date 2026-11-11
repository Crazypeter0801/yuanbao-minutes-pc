import React from 'react';

interface IconStatusSettingAutoProps {
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

/** IconStatusSettingAuto - Figma nodeId: I243:1204;257:1459 */
const IconStatusSettingAuto: React.FC<IconStatusSettingAutoProps> = React.memo(({
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
    <path d="M1.01733 4.58436L1.08465 4.46584C1.83155 3.15077 2.982 2.11112 4.36574 1.50076M4.1658 16.3182L2.68834 17.8016M15.8325 16.3182L17.3087 17.8016M12.9713 8.44222L8.88572 12.5278L7.02862 10.6707M18.9796 4.58408L18.9123 4.46556C18.1654 3.1505 17.0149 2.11085 15.6312 1.50049M17.5006 10.4849C17.5006 14.627 14.1428 17.9849 10.0006 17.9849C5.85849 17.9849 2.50062 14.627 2.50062 10.4849C2.50062 6.34273 5.85849 2.98486 10.0006 2.98486C14.1428 2.98486 17.5006 6.34273 17.5006 10.4849Z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
  </svg>
));

IconStatusSettingAuto.displayName = 'IconStatusSettingAuto';

export default IconStatusSettingAuto;
