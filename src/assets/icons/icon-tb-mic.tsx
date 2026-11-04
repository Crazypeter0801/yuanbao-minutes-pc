import React from 'react';

interface IconTbMicProps {
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

/** IconTbMic - Figma nodeId: 245:5883 */
const IconTbMic: React.FC<IconTbMicProps> = React.memo(({
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
    <path d="M7.46143 7.5C7.46143 4.73858 9.47614 2.5 11.9614 2.5C14.4467 2.5 16.4614 4.73858 16.4614 7.5V11C16.4614 13.7614 14.4467 16 11.9614 16C9.47614 16 7.46143 13.7614 7.46143 11V7.5Z" fill="#4E5461"/>
    <path d="M16.9517 13.7448C17.0171 13.5929 17.1888 13.5124 17.3442 13.569L18.728 14.0719C18.8835 14.1285 18.9644 14.3016 18.9019 14.4547C17.9015 16.8932 15.6519 18.6872 12.9478 19.0426V21.1998C12.9476 21.3653 12.8124 21.4995 12.647 21.4996H11.2476C11.082 21.4996 10.9479 21.3654 10.9478 21.1998V19.0397C8.25582 18.6758 6.01903 16.8849 5.02197 14.4547C4.95933 14.3016 5.03936 14.1286 5.19482 14.0719L6.57959 13.569C6.73497 13.5127 6.90584 13.593 6.97119 13.7448C7.80069 15.6813 9.72431 17.0357 11.9614 17.0358C14.1985 17.0357 16.1222 15.6813 16.9517 13.7448Z" fill="#4E5461"/>
    <path d="M11.7798 15.996C9.37873 15.8901 7.46143 13.6938 7.46143 11V8.99597H16.4614V11C16.4614 13.6938 14.5441 15.8901 12.143 15.996H11.7798Z" fillRule="evenodd" clipRule="evenodd" fill="#27D08E"/>
  </svg>
));

IconTbMic.displayName = 'IconTbMic';

export default IconTbMic;
