import React from 'react';

interface IconAgentPipProps {
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

/** IconAgentPip - Figma nodeId: 214:11048 */
const IconAgentPip: React.FC<IconAgentPipProps> = React.memo(({
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
    <mask id="mask0_214_11048" maskUnits="userSpaceOnUse" x="3" y="3" width="14" height="14">
    <path d="M16.6666 3.3335H3.33325V16.6668H16.6666V3.3335Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_214_11048)">
    <path d="M7.50122 4.53369H5.50122C5.22508 4.53369 5.00122 4.75755 5.00122 5.03369V14.5337C5.00122 15.086 5.44894 15.5337 6.00122 15.5337H14.5012C14.7774 15.5337 15.0012 15.3098 15.0012 15.0337V12" strokeWidth="1.2" strokeLinecap="round" stroke="#4E5461"/>
    <path d="M10.2012 9.53369H14.8012C14.9117 9.53369 15.0012 9.44415 15.0012 9.33369V4.73369C15.0012 4.62323 14.9117 4.53369 14.8012 4.53369H10.2012C10.0908 4.53369 10.0012 4.62323 10.0012 4.73369V9.33369C10.0012 9.44415 10.0908 9.53369 10.2012 9.53369Z" strokeWidth="1.2" stroke="#4E5461"/>
    </g>
  </svg>
));

IconAgentPip.displayName = 'IconAgentPip';

export default IconAgentPip;
