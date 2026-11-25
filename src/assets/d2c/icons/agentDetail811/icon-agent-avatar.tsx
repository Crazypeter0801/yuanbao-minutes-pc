import React from 'react';

interface IconAgentAvatarProps {
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

/** IconAgentAvatar - Figma nodeId: 811:41048 */
const IconAgentAvatar: React.FC<IconAgentAvatarProps> = React.memo(({
  width = 50,
  height = 50,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 50 50"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M25.5 1C38.7549 1 49.5 11.7451 49.5 25C49.5 38.2549 38.7549 49 25.5 49C12.2451 49 1.5 38.2549 1.5 25C1.5 11.7451 12.2451 1 25.5 1ZM13.5781 4.38533C5.3488 12.1973 4.34773 24.5696 11.4192 32.2656C18.6024 40.0837 31.3909 40.1104 39.9843 32.3256C44.2808 28.4341 44.8512 22.1107 41.2579 18.2005C37.6664 14.2907 31.2712 14.2763 26.9765 18.1693C22.6803 22.0624 16.2872 22.0499 12.6952 18.1405C9.21547 14.3547 9.64134 8.29973 13.5781 4.38533Z" fill="#00CC70"/>
    <path d="M23.0638 26.591C23.0638 30.2075 22.3443 30.8878 20.7251 30.8878C19.1062 30.8878 18.3867 30.2096 18.3867 26.591C18.3867 22.9726 19.1062 22.2944 20.7251 22.2944C22.3443 22.2944 23.0638 22.9726 23.0638 26.591Z" fill="#282828"/>
    <path d="M31.1113 30.8769C30.6398 30.8769 30.1745 30.6556 29.883 30.2398L27.9889 27.554C27.6334 27.0494 27.623 26.3796 27.962 25.8646L29.8561 22.9844C30.311 22.2916 31.2414 22.0993 31.9342 22.5542C32.6268 23.0092 32.819 23.9396 32.3644 24.6324L31.0326 26.6588L32.3374 28.5092C32.815 29.1876 32.6537 30.1241 31.9756 30.6017C31.7129 30.7878 31.411 30.8769 31.1113 30.8769Z" fill="#282828"/>
  </svg>
));

IconAgentAvatar.displayName = 'IconAgentAvatar';

export default IconAgentAvatar;
