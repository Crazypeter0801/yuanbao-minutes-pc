import React from 'react';

interface IconStatusSettingLanguageProps {
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

/** IconStatusSettingLanguage - Figma nodeId: I243:1211;257:1459 */
const IconStatusSettingLanguage: React.FC<IconStatusSettingLanguageProps> = React.memo(({
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
    <path d="M11.9343 15.3125H16.3986M11.9343 15.3125L11.0414 17.2656M11.9343 15.3125L14.1664 10.2344L16.3986 15.3125M16.3986 15.3125L17.2914 17.2656M2.57277 3.83525H3.96705M3.96705 3.83525H6.00753M3.96705 3.83525C4.3452 5.30142 5.13334 6.45082 6.02298 7.33207M3.96705 3.83525L3.96654 3.83326M6.00753 3.83525H8.07887M6.00753 3.83525L5.59087 2.5M8.07887 3.83525H9.4423M8.07887 3.83525C7.70073 5.30141 6.91262 6.45082 6.02298 7.33207M8.07887 3.83525L8.07937 3.83332M2.39307 9.64509C3.14994 9.36126 4.6989 8.64367 6.02298 7.33207M6.02298 7.33207C7.34705 8.64363 8.89598 9.36121 9.65284 9.64503M7.0831 17.5H6.66643C4.36525 17.5 2.49977 15.6345 2.49977 13.3333M12.9164 2.5H13.3331C15.6343 2.5 17.4998 4.36548 17.4998 6.66667" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color} strokeOpacity="0.9"/>
  </svg>
));

IconStatusSettingLanguage.displayName = 'IconStatusSettingLanguage';

export default IconStatusSettingLanguage;
