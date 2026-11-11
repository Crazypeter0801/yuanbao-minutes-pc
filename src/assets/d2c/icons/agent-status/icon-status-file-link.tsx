import React from 'react';

interface IconStatusFileLinkProps {
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

/** IconStatusFileLink - Figma nodeId: 264:1359 */
const IconStatusFileLink: React.FC<IconStatusFileLinkProps> = React.memo(({
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
    <rect width="24" height="24" rx="6" fill="#E6EEFF"/>
    <path d="M10.6693 12.6659C11.4212 13.4178 11.7972 13.7938 12.2052 13.9904C12.9366 14.3427 13.7886 14.3427 14.52 13.9904C14.928 13.7938 15.304 13.4178 16.056 12.6659L17.1826 11.5392C17.1835 11.5383 17.184 11.5379 17.1843 11.5375C18.4851 10.2359 18.4851 8.12655 17.1843 6.82497C17.184 6.82459 17.1835 6.82414 17.1826 6.82324C17.1817 6.82233 17.1813 6.82188 17.1809 6.8215C15.8803 5.52177 13.7729 5.52062 12.4709 6.81892C12.4706 6.8193 12.4701 6.81975 12.4692 6.82065L11.8359 7.45253M13.3359 11.3325C12.5839 10.5805 12.2079 10.2045 11.7999 10.0079C11.0686 9.65563 10.2166 9.65561 9.48528 10.0079C9.07725 10.2044 8.70122 10.5804 7.94916 11.3324L6.82205 12.4594C6.82165 12.4598 6.82146 12.46 6.82129 12.4602C5.51989 13.7619 5.51985 15.872 6.82121 17.1737C6.82138 17.1739 6.82158 17.1741 6.82197 17.1744C6.82237 17.1748 6.82257 17.175 6.82273 17.1752C8.12648 18.4786 10.2406 18.4762 11.5414 17.1699C11.5416 17.1697 11.5418 17.1695 11.5422 17.1691L12.1626 16.5459" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="#3370FF"/>
  </svg>
));

IconStatusFileLink.displayName = 'IconStatusFileLink';

export default IconStatusFileLink;
