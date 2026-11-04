import React from 'react';

interface IconNoteCollapseProps {
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

/**
 * IconNoteCollapse - Figma nodeId: 320:7230（内含 Icon/Minimize 2/48 实例 320:7231）
 *
 * 元宝纪要展开面板右上角用的是「收起」而不是关闭 ×：设计稿给的是 Minimize 2
 * （两个对角内向箭头），20×20、描边 1.333、#4E5461。
 * 收起只是回到底部胶囊，纪要和侧栏都还在，所以语义上也应该是收起。
 */
const IconNoteCollapse: React.FC<IconNoteCollapseProps> = React.memo(({
  width = 20,
  height = 20,
  color = '#4E5461',
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
    <path
      d="M8.6665 16L8.66641 13.4666C8.66638 12.7199 8.66637 12.3465 8.52104 12.0613C8.3932 11.8104 8.18923 11.6065 7.93835 11.4787C7.65314 11.3333 7.27979 11.3333 6.53308 11.3333H3.99984"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.3333 3.99984L11.3333 6.53313C11.3333 7.27986 11.3333 7.65322 11.4787 7.93843C11.6065 8.18931 11.8105 8.39329 12.0613 8.52112C12.3465 8.66645 12.7199 8.66645 13.4666 8.66646L16 8.6665"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

IconNoteCollapse.displayName = 'IconNoteCollapse';

export default IconNoteCollapse;
