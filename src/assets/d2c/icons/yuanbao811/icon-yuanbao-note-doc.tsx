import React, { useId } from 'react';

interface IconYuanbaoNoteDocProps {
  width?: number;
  height?: number;
  className?: string;
  [key: string]: unknown;
}

/**
 * 元宝笔记卡片 40×40 文件图标（Figma uqgy1LUHAOhLZ3QcCVtskE 节点 811:41212）
 * 柔和薄荷绿折角文档底 + 底部漫射绿光 + 左下角 18.75×18.75 元宝标准圆形徽章。
 */
const IconYuanbaoNoteDoc: React.FC<IconYuanbaoNoteDocProps> = React.memo(({
  width = 40,
  height = 40,
  className,
  ...props
}) => {
  const uid = useId().replace(/:/g, '');
  const clipId = `yb-note-clip-${uid}`;
  const blurId = `yb-note-blur-${uid}`;
  const gradId = `yb-note-grad-${uid}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M26.764 3.333H10.002C8.775 3.333 7.78 4.328 7.78 5.555V34.444C7.78 35.672 8.775 36.667 10.002 36.667H33.335C34.563 36.667 35.558 35.672 35.558 34.444V12.127C35.558 11.832 35.441 11.55 35.232 11.341L27.55 3.659C27.341 3.45 27.059 3.333 26.764 3.333Z" />
        </clipPath>
        <filter id={blurId} x="-4" y="8" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <linearGradient id={gradId} x1="21.67" y1="3.33" x2="21.67" y2="36.67" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A1E6C3" stopOpacity="0.5" />
          <stop offset="1" stopColor="#A1E6C3" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* 折角绿文档主体（按原稿 811:41214 / 811:41217 几何精确对齐） */}
      <g clipPath={`url(#${clipId})`}>
        <rect x="7.78" y="3.333" width="27.778" height="33.334" fill="#FFFFFF" />
        <g filter={`url(#${blurId})`}>
          <circle cx="14.45" cy="25.55" r="8.89" fill="#00A653" fillOpacity="0.65" />
        </g>
        <rect x="7.78" y="3.333" width="27.778" height="33.334" fill={`url(#${gradId})`} />
        <path
          d="M28.89 12.222H35.558V3.333H26.668V10C26.668 11.227 27.663 12.222 28.89 12.222Z"
          fill="#A1E6C3"
        />
      </g>

      {/* 左下角元宝圆形徽章（811:41225，位置 left=2.71px top=13.82px 尺寸 18.75×18.75） */}
      <g transform="translate(2.71, 13.82)">
        <path
          d="M9.375 18.75C14.5526 18.75 18.75 14.5526 18.75 9.375C18.75 4.19725 14.5526 0 9.375 0C4.19734 0 0 4.19725 0 9.375C0 14.5526 4.19734 18.75 9.375 18.75Z"
          fill="#00CC70"
        />
        <path
          d="M15.5307 6.71766C14.1279 5.19029 11.6296 5.18541 9.952 6.70629C8.2736 8.22729 5.77618 8.22154 4.37321 6.69416C3.01383 5.21529 3.18022 2.85041 4.7181 1.32141C1.50343 4.37291 1.11251 9.20616 3.87485 12.2124C6.68081 15.2664 11.6765 15.2769 15.0332 12.2359C16.7116 10.7158 16.9346 8.24504 15.5307 6.71766Z"
          fill="#FFFFFF"
        />
        <path
          d="M8.42491 9.99698C8.42491 11.4096 8.14384 11.6754 7.5114 11.6754C6.87898 11.6754 6.5979 11.4105 6.5979 9.99698C6.5979 8.58348 6.87898 8.31848 7.5114 8.31848C8.14384 8.31848 8.42491 8.58348 8.42491 9.99698Z"
          fill="#000000"
        />
        <path
          d="M11.566 11.6706C11.3819 11.6706 11.2001 11.5843 11.0863 11.4219L10.3464 10.3726C10.2074 10.1756 10.2034 9.91389 10.3359 9.71276L11.0758 8.58764C11.2534 8.31714 11.6169 8.24201 11.8875 8.41964C12.158 8.59739 12.2331 8.96076 12.0555 9.23139L11.5353 10.0229L12.045 10.7459C12.2315 11.0108 12.1685 11.3766 11.9036 11.5633C11.801 11.6359 11.6831 11.6706 11.566 11.6706Z"
          fill="#000000"
        />
      </g>
    </svg>
  );
});

IconYuanbaoNoteDoc.displayName = 'IconYuanbaoNoteDoc';

export default IconYuanbaoNoteDoc;
