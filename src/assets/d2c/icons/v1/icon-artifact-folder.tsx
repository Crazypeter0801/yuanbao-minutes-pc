import React from 'react';

interface IconArtifactFolderProps {
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

/** IconArtifactFolder - Figma nodeId: 320:7905 */
const IconArtifactFolder: React.FC<IconArtifactFolderProps> = React.memo(({
  width = 16,
  height = 16,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M1.6665 9.33333L1.66653 7.8666C1.66655 6.74652 1.66656 6.18647 1.88455 5.75866C2.0763 5.38234 2.38226 5.07638 2.75858 4.88464C3.1864 4.66666 3.74644 4.66666 4.86653 4.66666H9.99984M14.3334 8.81482V9.73334C14.3334 11.2268 14.3334 11.9735 14.0428 12.544C13.7871 13.0457 13.3791 13.4537 12.8774 13.7094C12.3069 14 11.5602 14 10.0667 14H5.93324C4.43975 14 3.693 14 3.12256 13.7094C2.62079 13.4537 2.21284 13.0457 1.95718 12.544C1.66654 11.9735 1.66655 11.2268 1.66658 9.73327L1.66665 5.19995C1.66667 4.07986 1.66668 3.51981 1.88467 3.09199C2.07642 2.71568 2.38238 2.40972 2.7587 2.21798C3.18652 2 3.74657 2 4.86666 2L6.06674 2C6.6534 2 6.94673 2.00001 7.21596 2.0769C7.45442 2.145 7.67813 2.25685 7.87568 2.40676C8.09873 2.57601 8.27473 2.81067 8.62673 3.28L9.35562 4.25186C9.46423 4.39667 9.51853 4.46908 9.58622 4.52267C9.65828 4.57973 9.74136 4.62127 9.83024 4.64468C9.91373 4.66667 10.0042 4.66667 10.1853 4.66667C11.567 4.66667 12.2579 4.66667 12.7937 4.91652C13.3619 5.18148 13.8186 5.63816 14.0836 6.20636C14.3334 6.74215 14.3334 7.43304 14.3334 8.81482Z" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" stroke="#4E5461"/>
  </svg>
));

IconArtifactFolder.displayName = 'IconArtifactFolder';

export default IconArtifactFolder;
