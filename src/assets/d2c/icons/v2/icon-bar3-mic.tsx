import React from 'react';

interface IconBar3MicProps {
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

/** IconBar3Mic - Figma nodeId: 416:20058 */
const IconBar3Mic: React.FC<IconBar3MicProps> = React.memo(({
  width = 60,
  height = 40,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 60 40"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M17.4617 15.5C17.4617 12.7386 19.4764 10.5 21.9617 10.5C24.447 10.5 26.4617 12.7386 26.4617 15.5V19C26.4617 21.7614 24.447 24 21.9617 24C19.4764 24 17.4617 21.7614 17.4617 19V15.5Z" fill="#373C48"/>
    <path d="M15.9756 21.7881C16.4645 21.6105 16.9988 21.8688 17.2589 22.3193C18.1969 23.9443 19.9532 25.0361 21.962 25.0361C23.9704 25.0358 25.7262 23.9441 26.6641 22.3193C26.9243 21.8689 27.4585 21.6103 27.9473 21.7881C28.5338 22.0017 28.8432 22.6565 28.544 23.2041C27.4214 25.2562 25.3664 26.7261 22.9473 27.0439V28.5C22.9473 29.0521 22.4994 29.4997 21.9473 29.5C21.3952 29.4999 20.9474 29.0522 20.9473 28.5V27.041C18.5405 26.7156 16.4973 25.2483 15.379 23.2041C15.0795 22.6563 15.3889 22.0016 15.9756 21.7881Z" fill="#373C48"/>
    <path d="M21.7801 23.9961C19.379 23.8902 17.4617 21.6939 17.4617 19.0001V16.9961H26.4617V19.0001C26.4617 21.6939 24.5444 23.8902 22.1433 23.9961H21.7801Z" fillRule="evenodd" clipRule="evenodd" fill="#27D08E"/>
    <path d="M41.5 20.5L44.0004 18L46.5 20.5" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconBar3Mic.displayName = 'IconBar3Mic';

export default IconBar3Mic;
