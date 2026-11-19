import React from 'react';

interface IconChat556EmojiProps {
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

/** IconChat556Emoji - Figma nodeId: 556:9838 */
const IconChat556Emoji: React.FC<IconChat556EmojiProps> = React.memo(({
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
    <circle cx="8" cy="8" r="8" fill="#4E5461"/>
    <path d="M4.80176 5.11139C4.80176 4.96412 4.92115 4.84473 5.06842 4.84473H5.60176C5.74903 4.84473 5.86842 4.96412 5.86842 5.11139V7.77806C5.86842 7.92534 5.74903 8.04473 5.60176 8.04473H5.06842C4.92115 8.04473 4.80176 7.92534 4.80176 7.77806V5.11139Z" fill="white"/>
    <path d="M9.00252 6.98376C8.5877 6.74426 8.5877 6.14553 9.00252 5.90604L10.7007 4.92557C10.8283 4.85193 10.9914 4.89563 11.065 5.02317L11.3317 5.48505C11.4053 5.6126 11.3616 5.77569 11.2341 5.84933L10.2025 6.4449L11.2341 7.04047C11.3616 7.11411 11.4053 7.2772 11.3317 7.40474L11.065 7.86662C10.9914 7.99417 10.8283 8.03787 10.7007 7.96423L9.00252 6.98376Z" fillRule="evenodd" clipRule="evenodd" fill="white"/>
    <path d="M7.83064 11.2057C8.76869 11.2057 9.57089 10.6561 9.93402 9.8684C9.99568 9.73465 10.1447 9.65704 10.2848 9.70251L10.7921 9.86715C10.9321 9.91262 11.0098 10.0636 10.9533 10.1996C10.4467 11.4176 9.24056 12.2723 7.83064 12.2723C7.07421 12.2723 6.37426 12.0258 5.81007 11.6093C5.69159 11.5218 5.68023 11.3524 5.77675 11.2412L6.12626 10.8384C6.22278 10.7271 6.39046 10.7166 6.51201 10.7998C6.88599 11.0556 7.33988 11.2057 7.83064 11.2057Z" fillRule="evenodd" clipRule="evenodd" fill="white"/>
  </svg>
));

IconChat556Emoji.displayName = 'IconChat556Emoji';

export default IconChat556Emoji;
