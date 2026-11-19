import React from 'react';

interface IconMembersSearchProps {
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

/** IconMembersSearch - Figma nodeId: 504:11254 */
const IconMembersSearch: React.FC<IconMembersSearchProps> = React.memo(({
  width = 30,
  height = 30,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    fill="none"
    className={className}
    {...props}
  >
    <rect width="30" height="30" rx="15" fill="#F3F3F4"/>
    <path d="M13.8496 8.5C17.0803 8.50011 19.7 11.119 19.7002 14.3496L19.6924 14.6514C19.6274 15.9328 19.1484 17.1043 18.3887 18.0381L20.8027 20.4512C21.0368 20.6855 21.037 21.0656 20.8027 21.2998C20.5685 21.534 20.1884 21.5338 19.9541 21.2998L17.541 18.8857C16.5339 19.7064 15.2499 20.2001 13.8496 20.2002L13.5488 20.1924C10.4579 20.0356 8 17.4795 8 14.3496C8.00021 11.1191 10.6191 8.50021 13.8496 8.5ZM13.8496 9.7002C11.2818 9.70041 9.20041 11.7818 9.2002 14.3496C9.2002 16.9176 11.2817 18.9998 13.8496 19C16.4176 18.9999 18.5 16.9177 18.5 14.3496C18.4998 11.7817 16.4175 9.7003 13.8496 9.7002Z" fill="#4E5461"/>
  </svg>
));

IconMembersSearch.displayName = 'IconMembersSearch';

export default IconMembersSearch;
