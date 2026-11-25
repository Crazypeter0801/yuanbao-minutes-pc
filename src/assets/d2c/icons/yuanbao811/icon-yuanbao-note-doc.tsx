import React from 'react';
import iconYuanbaoNote582 from './icon-yuanbao-note-582.svg';

interface IconYuanbaoNoteDocProps {
  width?: number;
  height?: number;
  className?: string;
}

/**
 * 元宝笔记卡片文件图标（Figma uqgy1LUHAOhLZ3QcCVtskE 节点 582:33088 / I582:33088;626:33323）
 * 严格按原稿 40×40 容器内 27×33（left: 6.5px, top: 3.5px）比例居中渲染无损矢量 SVG。
 */
const IconYuanbaoNoteDoc: React.FC<IconYuanbaoNoteDocProps> = React.memo(
  ({ width = 40, height = 40, className }) => (
    <span
      className={className}
      data-yuanbao-note-icon="582-33088"
      style={{
        position: 'relative',
        display: 'inline-block',
        flexShrink: 0,
        width,
        height,
      }}
    >
      <img
        src={iconYuanbaoNote582}
        alt=""
        draggable={false}
        style={{
          position: 'absolute',
          left: '16.25%',
          top: '8.75%',
          width: '67.5%',
          height: '82.5%',
          display: 'block',
          userSelect: 'none',
        }}
      />
    </span>
  ),
);

IconYuanbaoNoteDoc.displayName = 'IconYuanbaoNoteDoc';

export default IconYuanbaoNoteDoc;
