import React from 'react';

interface IconToolShotProps {
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

/** IconToolShot - Figma nodeId: 36:10783 */
const IconToolShot: React.FC<IconToolShotProps> = React.memo(({
  width = 18,
  height = 18,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    className={className}
    {...props}
  >
    <mask id="stroke0_36_10783" maskUnits="userSpaceOnUse" x="9.54712" y="9.32452" width="7" height="7" fill="black">
    <rect fill="white" x="9.54712" y="9.32452" width="7" height="7"/>
    <path d="M14.4542 11.9609C14.9974 12.6717 14.8616 13.6884 14.1508 14.2316C13.4399 14.7749 12.4233 14.639 11.88 13.9282C11.3368 13.2173 11.4726 12.2007 12.1835 11.6574C12.8943 11.1142 13.9109 11.25 14.4542 11.9609Z"/>
    </mask>
    <path d="M14.4542 11.9609C14.9974 12.6717 14.8616 13.6884 14.1508 14.2316C13.4399 14.7749 12.4233 14.639 11.88 13.9282C11.3368 13.2173 11.4726 12.2007 12.1835 11.6574C12.8943 11.1142 13.9109 11.25 14.4542 11.9609Z" strokeWidth="2.7" stroke="#0D0D0D" mask="url(#stroke0_36_10783)"/>
    <path d="M5.10491 2.39366C5.40111 2.16729 5.82473 2.2239 6.0511 2.52009L12.5905 11.0767L11.5178 11.8965L4.97848 3.33984C4.75211 3.04364 4.80872 2.62002 5.10491 2.39366Z" fill="#0D0D0D"/>
    <mask id="stroke1_36_10783" maskUnits="userSpaceOnUse" x="1.2085" y="9.32343" width="7" height="7" fill="black">
    <rect fill="white" x="1.2085" y="9.32343" width="7" height="7"/>
    <path d="M3.54142 11.9598C2.99817 12.6706 3.13402 13.6873 3.84485 14.2305C4.55569 14.7738 5.57233 14.6379 6.11558 13.9271C6.65883 13.2162 6.52297 12.1996 5.81214 11.6563C5.1013 11.1131 4.08467 11.2489 3.54142 11.9598Z"/>
    </mask>
    <path d="M3.54142 11.9598C2.99817 12.6706 3.13402 13.6873 3.84485 14.2305C4.55569 14.7738 5.57233 14.6379 6.11558 13.9271C6.65883 13.2162 6.52297 12.1996 5.81214 11.6563C5.1013 11.1131 4.08467 11.2489 3.54142 11.9598Z" strokeWidth="2.7" stroke="#0D0D0D" mask="url(#stroke1_36_10783)"/>
    <path d="M12.8895 2.39256C12.5933 2.16619 12.1697 2.2228 11.9433 2.519L5.40393 11.0756L6.47656 11.8954L13.0159 3.33874C13.2423 3.04254 13.1857 2.61892 12.8895 2.39256Z" fill="#0D0D0D"/>
  </svg>
));

IconToolShot.displayName = 'IconToolShot';

export default IconToolShot;
