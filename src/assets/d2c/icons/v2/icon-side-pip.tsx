import React from 'react';

interface IconSidePipProps {
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

/** IconSidePip - Figma nodeId: 489:10609 */
const IconSidePip: React.FC<IconSidePipProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
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
    <g clipPath="url(#clip0_489_10609)">
    <path d="M8.52966 4.5H7.49939C5.84254 4.5 4.49939 5.84315 4.49939 7.5V12.5C4.49939 14.1569 5.84254 15.5 7.49939 15.5H12.4994C14.1562 15.5 15.4994 14.1569 15.4994 12.5V11.553" strokeWidth="1.2" strokeLinecap="round" stroke="#4E5461"/>
    <path d="M11.9994 9.5H13.9994C14.8278 9.5 15.4994 8.82843 15.4994 8V6C15.4994 5.17157 14.8278 4.5 13.9994 4.5H11.9994C11.171 4.5 10.4994 5.17157 10.4994 6V8C10.4994 8.82843 11.171 9.5 11.9994 9.5Z" strokeWidth="1.2" stroke="#4E5461"/>
    </g>
    <defs>
    <clipPath id="clip0_489_10609">
    <rect width="13.3333" height="13.3333" fill="white" transform="translate(3.33337 3.3335)"/>
    </clipPath>
    </defs>
  </svg>
));

IconSidePip.displayName = 'IconSidePip';

export default IconSidePip;
