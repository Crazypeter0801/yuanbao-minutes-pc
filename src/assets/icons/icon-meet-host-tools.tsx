import React from 'react';

interface IconMeetHostToolsProps {
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

/** IconMeetHostTools - Figma nodeId: 245:5834 */
const IconMeetHostTools: React.FC<IconMeetHostToolsProps> = React.memo(({
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
    <path d="M9.42578 2.07788C9.79539 1.93577 10.2046 1.93578 10.5742 2.07788L15.9902 4.16089C16.6726 4.42334 17.0902 5.11547 17.0049 5.84155L16.4287 10.739C16.1969 12.7091 15.0914 14.4707 13.418 15.5359L10.8496 17.1707C10.3334 17.4991 9.67475 17.5044 9.15332 17.1843L6.53906 15.5789C4.77095 14.493 3.61631 12.6388 3.42188 10.573L2.97363 5.81128C2.90651 5.09724 3.32282 4.42524 3.99219 4.16772L9.42578 2.07788ZM10.1436 3.198C10.0512 3.16248 9.94883 3.16248 9.85645 3.198L4.42285 5.28784C4.25583 5.35222 4.15148 5.51979 4.16797 5.698L4.61621 10.4607C4.77532 12.1508 5.72037 13.668 7.16699 14.5564L9.78125 16.1609C9.91157 16.2409 10.076 16.24 10.2051 16.158L12.7734 14.5242C14.1427 13.6528 15.0475 12.2113 15.2373 10.5994L15.8135 5.70093C15.8347 5.5195 15.7301 5.34659 15.5596 5.28101L10.1436 3.198Z" fill="#373C48"/>
    <path d="M13.2678 7.7631C13.3883 7.87686 13.3937 8.06673 13.28 8.18719L10.172 11.478C9.91102 11.7543 9.47727 11.7719 9.19479 11.5177L7.2308 9.75008C7.10765 9.63924 7.09766 9.44955 7.2085 9.3264L7.74367 8.73177C7.85451 8.60861 8.0442 8.59863 8.16735 8.70947L9.62338 10.0199L12.2621 7.22592C12.3759 7.10546 12.5658 7.10004 12.6862 7.2138L13.2678 7.7631Z" fillRule="evenodd" clipRule="evenodd" fill="#1CAF7B"/>
  </svg>
));

IconMeetHostTools.displayName = 'IconMeetHostTools';

export default IconMeetHostTools;
