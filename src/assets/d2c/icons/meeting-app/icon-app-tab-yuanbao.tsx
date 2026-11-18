import React from 'react';

interface IconAppTabYuanbaoProps {
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

/** IconAppTabYuanbao - Figma nodeId: 489:10286 */
const IconAppTabYuanbao: React.FC<IconAppTabYuanbaoProps> = React.memo(({
  width = 24,
  height = 24,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 40 40"
    fill="none"
    className={className}
    {...props}
  >
    <rect x="0.25" y="0.25" width="39.5" height="39.5" rx="7.75" stroke="#EBEDF2" strokeWidth="0.5"/>
    <path d="M20 10.3999C25.3018 10.3999 29.6004 14.6978 29.6006 19.9995C29.6006 25.3014 25.3019 29.6001 20 29.6001C14.6982 29.5999 10.4004 25.3013 10.4004 19.9995C10.4006 14.6979 14.6984 10.4001 20 10.3999ZM15.2314 11.7544C11.9399 14.8791 11.5396 19.8284 14.3682 22.9067C17.2415 26.034 22.3575 26.0442 25.7949 22.9302C27.5132 21.3736 27.7411 18.8437 26.3037 17.2798C24.912 15.7649 22.468 15.7126 20.7549 17.1265L20.4287 17.4097C18.7149 18.8238 16.2708 18.7712 14.8789 17.2563C13.487 15.742 13.6569 13.3201 15.2314 11.7544ZM18.0918 18.9175C18.7393 18.9175 19.0273 19.1889 19.0273 20.6362C19.0273 22.0827 18.7393 22.3549 18.0918 22.355C17.4442 22.355 17.1563 22.0836 17.1562 20.6362C17.1562 19.1888 17.4442 18.9175 18.0918 18.9175ZM21.7432 19.1938C21.9251 18.9168 22.2971 18.84 22.5742 19.022C22.8513 19.2039 22.928 19.576 22.7461 19.853L22.2139 20.6636L22.7354 21.4038C22.9264 21.6751 22.8621 22.0497 22.5908 22.2407C22.4858 22.3151 22.365 22.3501 22.2451 22.3501C22.0567 22.35 21.8705 22.2622 21.7539 22.0962L20.9961 21.021C20.8541 20.8192 20.8498 20.551 20.9854 20.3452L21.7432 19.1938Z" fill="#4E5461"/>
  </svg>
));

IconAppTabYuanbao.displayName = 'IconAppTabYuanbao';

export default IconAppTabYuanbao;
