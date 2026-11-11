import React from 'react';

interface IconTbYuanbaoActiveProps {
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

/** IconTbYuanbaoActive - Figma nodeId: 214:11011 */
const IconTbYuanbaoActive: React.FC<IconTbYuanbaoActiveProps> = React.memo(({
  width = 24,
  height = 24,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3ZM7.5293 4.26953C4.44327 7.19896 4.06793 11.8386 6.71973 14.7246C9.41345 17.6564 14.2091 17.6664 17.4316 14.7471C19.0428 13.2878 19.2567 10.9165 17.9092 9.4502C16.5624 7.98399 14.1642 7.97859 12.5537 9.43848C10.9426 10.8984 8.54516 10.8937 7.19824 9.42773C5.89326 8.008 6.05298 5.73735 7.5293 4.26953Z" fill="#00CC70"/>
    <path d="M11.0872 12.5964C11.0872 13.9525 10.8174 14.2076 10.2102 14.2076C9.60309 14.2076 9.33325 13.9533 9.33325 12.5964C9.33325 11.2394 9.60309 10.9851 10.2102 10.9851C10.8174 10.9851 11.0872 11.2394 11.0872 12.5964Z" fill="#282828"/>
    <path d="M14.1037 14.2035C13.9269 14.2035 13.7525 14.1206 13.6431 13.9647L12.9329 12.9575C12.7995 12.7683 12.7956 12.5171 12.9228 12.324L13.6331 11.2439C13.8037 10.9841 14.1526 10.912 14.4123 11.0826C14.6721 11.2532 14.7442 11.6021 14.5736 11.8619L14.0743 12.6217L14.5635 13.3157C14.7427 13.57 14.6822 13.9213 14.4278 14.1004C14.3294 14.1702 14.2162 14.2035 14.1037 14.2035Z" fill="#282828"/>
  </svg>
));

IconTbYuanbaoActive.displayName = 'IconTbYuanbaoActive';

export default IconTbYuanbaoActive;
