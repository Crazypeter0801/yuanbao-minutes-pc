import React from 'react';

interface IconNoteChevronProps {
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

/** IconNoteChevron - Figma nodeId: 46:7854 */
const IconNoteChevron: React.FC<IconNoteChevronProps> = React.memo(({
  width = 28,
  height = 16,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 28 16"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M18.0761 4.57621C18.2811 4.37124 18.5972 4.34544 18.8301 4.49906L18.9238 4.57621L21.8935 7.54496L21.9863 7.6475C22.4192 8.17775 22.3879 8.96073 21.8935 9.45512L18.9238 12.4238C18.6895 12.6581 18.3105 12.6581 18.0761 12.4238C17.842 12.1895 17.8419 11.8104 18.0761 11.5762L21.0449 8.60649C21.0889 8.56248 21.1002 8.49762 21.0781 8.4434L21.0449 8.39359L18.0761 5.42387L17.999 5.33012C17.8454 5.09725 17.8712 4.78118 18.0761 4.57621Z" fill="#A6A6A6"/>
  </svg>
));

IconNoteChevron.displayName = 'IconNoteChevron';

export default IconNoteChevron;
