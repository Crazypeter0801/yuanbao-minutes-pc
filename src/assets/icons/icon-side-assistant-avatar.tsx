import React from 'react';

interface IconSideAssistantAvatarProps {
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

/** IconSideAssistantAvatar - Figma nodeId: 246:6300 */
const IconSideAssistantAvatar: React.FC<IconSideAssistantAvatarProps> = React.memo(({
  width = 32,
  height = 32,
  color = 'currentColor', // Figma: #black
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    {...props}
  >
    <rect width="32" height="32" fill="white"/>
    <g clipPath="url(#clip0_246_6300)">
    <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" fill="#00CC70"/>
    <path d="M23.879 12.5998C22.0832 10.6447 18.8855 10.6385 16.7382 12.5853C14.5898 14.5321 11.3931 14.5248 9.59731 12.5698C7.85732 10.6768 8.0703 7.64966 10.0388 5.69257C5.92401 9.59848 5.42362 15.7851 8.95942 19.6331C12.551 23.5421 18.9455 23.5556 23.2422 19.6631C25.3905 17.7174 25.6759 14.5548 23.879 12.5998Z" fill="white"/>
    <path d="M14.7829 16.7951C14.7829 18.6033 14.4231 18.9434 13.6136 18.9434C12.8041 18.9434 12.4443 18.6043 12.4443 16.7951C12.4443 14.9858 12.8041 14.6467 13.6136 14.6467C14.4231 14.6467 14.7829 14.9858 14.7829 16.7951Z" fill={color}/>
    <path d="M18.8047 18.9383C18.5689 18.9383 18.3363 18.8276 18.1905 18.6198L17.2435 17.2769C17.0657 17.0246 17.0605 16.6896 17.2301 16.4322L18.1771 14.992C18.4045 14.6457 18.8698 14.5495 19.2161 14.777C19.5625 15.0044 19.6586 15.4697 19.4312 15.816L18.7654 16.8292L19.4177 17.7545C19.6566 18.0936 19.5759 18.5619 19.2368 18.8008C19.1055 18.8938 18.9546 18.9383 18.8047 18.9383Z" fill={color}/>
    </g>
    <defs>
    <clipPath id="clip0_246_6300">
    <rect width="24" height="24" fill="white" transform="translate(4 4)"/>
    </clipPath>
    </defs>
  </svg>
));

IconSideAssistantAvatar.displayName = 'IconSideAssistantAvatar';

export default IconSideAssistantAvatar;
