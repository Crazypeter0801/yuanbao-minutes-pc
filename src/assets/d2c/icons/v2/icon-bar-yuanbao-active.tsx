import React from 'react';

interface IconBarYuanbaoActiveProps {
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

/** IconBarYuanbaoActive - Figma nodeId: 416:20118 */
const IconBarYuanbaoActive: React.FC<IconBarYuanbaoActiveProps> = React.memo(({
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
    <path d="M11.0873 12.5966C11.0873 13.9528 10.8175 14.2079 10.2103 14.2079C9.60321 14.2079 9.33337 13.9536 9.33337 12.5966C9.33337 11.2397 9.60321 10.9854 10.2103 10.9854C10.8175 10.9854 11.0873 11.2397 11.0873 12.5966Z" fill="#282828"/>
    <path d="M14.1037 14.2037C13.9269 14.2037 13.7524 14.1207 13.6431 13.9648L12.9328 12.9576C12.7995 12.7684 12.7956 12.5172 12.9227 12.3241L13.633 11.244C13.8036 10.9842 14.1525 10.9121 14.4123 11.0827C14.672 11.2533 14.7441 11.6022 14.5736 11.862L14.0742 12.6219L14.5635 13.3158C14.7426 13.5702 14.6821 13.9214 14.4278 14.1005C14.3293 14.1703 14.2161 14.2037 14.1037 14.2037Z" fill="#282828"/>
  </svg>
));

IconBarYuanbaoActive.displayName = 'IconBarYuanbaoActive';

export default IconBarYuanbaoActive;
