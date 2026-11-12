import React from 'react';

interface IconLaserProps {
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

/** IconLaser - Figma nodeId: I221:30127;221:23493 */
const IconLaser: React.FC<IconLaserProps> = React.memo(({
  width = 20,
  height = 20,
  color = '#373C48',
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
    <g clipPath="url(#clip0_0_27)">
    <path d="M7.37 11.0299L12.79 16.4499C12.92 16.5799 13.0743 16.683 13.2442 16.7534C13.4141 16.8238 13.5961 16.86 13.78 16.86C13.9639 16.86 14.1459 16.8238 14.3158 16.7534C14.4857 16.683 14.64 16.5799 14.77 16.4499L16.45 14.7699C16.58 14.6399 16.6832 14.4855 16.7535 14.3157C16.8239 14.1458 16.8601 13.9637 16.8601 13.7799C16.8601 13.596 16.8239 13.414 16.7535 13.2441C16.6832 13.0742 16.58 12.9199 16.45 12.7899L11.03 7.36988C10.5385 6.91549 9.89022 6.66902 9.22101 6.68214C8.5518 6.69526 7.91365 6.96694 7.44036 7.44024C6.96706 7.91353 6.69538 8.55168 6.68226 9.22089C6.66914 9.8901 6.91562 10.5384 7.37 11.0299Z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
    <path d="M7.37 11.0301L11.03 7.37012" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
    <path d="M13.78 13.7796L12.1 12.0996" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
    <path d="M5.68999 5.6898L4.30999 4.3098M9.79999 4.2698L10.02 2.5498M4.26999 9.7998L2.54999 10.0198" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={color}/>
    </g>
    <defs>
    <clipPath id="clip0_0_27">
    <rect width="20" height="20" fill="white"/>
    </clipPath>
    </defs>
  </svg>
));

IconLaser.displayName = 'IconLaser';

export default IconLaser;
