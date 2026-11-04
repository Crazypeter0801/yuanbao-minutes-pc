import React from 'react';

interface IconInputFlashProps {
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

/** IconInputFlash - Figma nodeId: 248:12539 */
const IconInputFlash: React.FC<IconInputFlashProps> = React.memo(({
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
    <path d="M9.41309 2.97855L3.67382 10.0205C3.45846 10.2847 3.35078 10.4168 3.34995 10.5282C3.34923 10.625 3.39286 10.7169 3.46838 10.7775C3.55523 10.8472 3.72568 10.8472 4.06657 10.8472H8.06146C8.2566 10.8472 8.35417 10.8472 8.42547 10.8865C8.48809 10.9209 8.53721 10.9756 8.56484 11.0415C8.5963 11.1165 8.58596 11.2135 8.56528 11.4076L8.24321 14.4294C8.18898 14.9383 8.16186 15.1927 8.24075 15.2937C8.30888 15.381 8.41762 15.4263 8.52754 15.4133C8.65482 15.3982 8.81647 15.1999 9.13977 14.8032L14.7012 7.97954C14.9165 7.71529 15.0242 7.58317 15.0251 7.4718C15.0258 7.37496 14.9821 7.28312 14.9066 7.2225C14.8198 7.15278 14.6493 7.15278 14.3084 7.15278H10.8192C10.6418 7.15278 10.5531 7.15278 10.4854 7.11826C10.4258 7.0879 10.3774 7.03946 10.347 6.97988C10.3125 6.91214 10.3125 6.82346 10.3125 6.64611V3.29865C10.3125 2.86118 10.3125 2.64244 10.2303 2.55188C10.159 2.47348 10.0534 2.43586 9.94862 2.45165C9.82765 2.46989 9.68947 2.63945 9.41309 2.97855Z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="#333333"/>
  </svg>
));

IconInputFlash.displayName = 'IconInputFlash';

export default IconInputFlash;
