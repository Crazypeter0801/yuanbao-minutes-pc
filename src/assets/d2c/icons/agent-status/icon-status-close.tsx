import React from 'react';

interface IconStatusCloseProps {
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

/** IconStatusClose - Figma nodeId: 243:1069 */
const IconStatusClose: React.FC<IconStatusCloseProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 21"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M13.9784 5.17664C14.2122 4.94178 14.5904 4.94179 14.8241 5.17664C15.0578 5.41151 15.0579 5.79139 14.8241 6.02625L10.8446 10.0243L14.8231 14.0214C15.0565 14.2563 15.0567 14.6362 14.8231 14.871C14.5895 15.1058 14.2112 15.1056 13.9774 14.871L9.99891 10.8739L6.02137 14.871C5.78763 15.1053 5.40928 15.1055 5.17567 14.871C4.94201 14.6362 4.94213 14.2553 5.17567 14.0204L9.15321 10.0233L5.17469 6.02625C4.94104 5.79146 4.94121 5.41153 5.17469 5.17664C5.40845 4.94178 5.78665 4.94177 6.0204 5.17664L9.99891 9.17371L13.9784 5.17664Z" fill="#4E5461"/>
  </svg>
));

IconStatusClose.displayName = 'IconStatusClose';

export default IconStatusClose;
