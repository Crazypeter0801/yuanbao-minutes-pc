import React from 'react';

interface IconVideoNameMicProps {
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

/** IconVideoNameMic - Figma nodeId: I416:20030;314:41384 */
const IconVideoNameMic: React.FC<IconVideoNameMicProps> = React.memo(({
  width = 9,
  height = 12,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 10 13"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M1.72422 3.51347C1.72422 1.57303 3.13995 0 4.88634 0C6.63273 0 8.04846 1.57303 8.04846 3.51347V5.6212C8.04846 7.56164 6.63273 9.13467 4.88634 9.13467C3.13995 9.13467 1.72422 7.56164 1.72422 5.6212V3.51347Z" fill="#4E5461"/>
    <path d="M8.39938 7.649C8.44544 7.54261 8.56517 7.48599 8.67422 7.52548L9.64694 7.87957C9.75598 7.91941 9.81316 8.04074 9.76943 8.14822C9.0667 9.86088 7.48631 11.1186 5.58724 11.369V12.7885C5.58707 12.9046 5.49233 12.9992 5.37622 12.9995H4.39218C4.27601 12.9993 4.18236 12.9046 4.18219 12.7885V11.368C2.28983 11.1128 0.716273 9.85639 0.01544 8.14822C-0.0285626 8.04061 0.0286871 7.9194 0.137931 7.87957L1.11065 7.52548C1.21983 7.48609 1.34068 7.54231 1.38652 7.649C1.96939 9.00977 3.32046 9.96184 4.89243 9.96191C6.46428 9.96172 7.81655 9.00969 8.39938 7.649Z" fill="#4E5461"/>
  </svg>
));

IconVideoNameMic.displayName = 'IconVideoNameMic';

export default IconVideoNameMic;
