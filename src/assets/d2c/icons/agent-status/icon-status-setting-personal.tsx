import React from 'react';

interface IconStatusSettingPersonalProps {
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

/** IconStatusSettingPersonal - Figma nodeId: I243:1197;257:1459 */
const IconStatusSettingPersonal: React.FC<IconStatusSettingPersonalProps> = React.memo(({
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
    <path d="M10.0015 2.0835C12.5328 2.0835 14.5848 4.13552 14.5848 6.66683C14.5848 7.25781 14.4715 7.8221 14.2678 8.34082C14.0444 8.3089 13.816 8.29159 13.5838 8.29159C11.6153 8.29165 9.92488 9.47917 9.18766 11.1765C7.04471 10.7924 5.41813 8.92031 5.41813 6.66683C5.41813 4.13552 7.47016 2.0835 10.0015 2.0835ZM17.5473 15.1533C16.2816 17.3454 13.4785 18.0965 11.2863 16.8309C10.7745 16.5354 10.3425 16.1551 9.99512 15.7194C10.1345 15.5419 10.2637 15.3527 10.3798 15.1516C11.3639 13.4468 11.1808 11.3891 10.0794 9.90198C11.4836 8.2382 13.9181 7.76557 15.8697 8.89231C18.0619 10.158 18.813 12.9611 17.5473 15.1533ZM2.45564 15.1533C1.18998 12.9611 1.94108 10.158 4.13325 8.89231C4.64506 8.59682 5.19039 8.41278 5.74146 8.32982C5.8255 8.53924 5.92472 8.74571 6.04082 8.9468C7.02512 10.6515 8.89877 11.5218 10.7373 11.3115C11.4761 13.3594 10.6682 15.7041 8.71658 16.8309C6.52441 18.0965 3.72129 17.3454 2.45564 15.1533Z" strokeWidth="1.2" strokeLinecap="round" stroke={color} strokeOpacity="0.9"/>
  </svg>
));

IconStatusSettingPersonal.displayName = 'IconStatusSettingPersonal';

export default IconStatusSettingPersonal;
