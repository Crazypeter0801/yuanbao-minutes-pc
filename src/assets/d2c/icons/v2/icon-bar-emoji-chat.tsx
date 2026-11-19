import React from 'react';

interface IconBarEmojiChatProps {
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

/** IconBarEmojiChat - Figma nodeId: 520:13391 */
const IconBarEmojiChat: React.FC<IconBarEmojiChatProps> = React.memo(({
  width = 36,
  height = 36,
  color = 'currentColor',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 36 36"
    fill="none"
    className={className}
    {...props}
  >
    <circle cx="18" cy="18" r="9" fill="#373C48"/>
    <path d="M14.4023 14.7502C14.4023 14.5845 14.5367 14.4502 14.7023 14.4502H15.3023C15.468 14.4502 15.6023 14.5845 15.6023 14.7502V17.7502C15.6023 17.9159 15.468 18.0502 15.3023 18.0502H14.7023C14.5367 18.0502 14.4023 17.9159 14.4023 17.7502V14.7502Z" fill="white"/>
    <path d="M19.1273 16.8567C18.6607 16.5873 18.6607 15.9137 19.1273 15.6443L21.0378 14.5413C21.1813 14.4584 21.3648 14.5076 21.4477 14.6511L21.7477 15.1707C21.8305 15.3142 21.7813 15.4976 21.6378 15.5805L20.4773 16.2505L21.6378 16.9205C21.7813 17.0034 21.8305 17.1868 21.7477 17.3303L21.4477 17.8499C21.3648 17.9934 21.1813 18.0426 21.0378 17.9598L19.1273 16.8567Z" fillRule="evenodd" clipRule="evenodd" fill="white"/>
    <path d="M17.8103 21.6061C18.8656 21.6061 19.7681 20.9879 20.1766 20.1017C20.246 19.9512 20.4136 19.8639 20.5712 19.9151L21.1419 20.1003C21.2995 20.1515 21.3869 20.3213 21.3233 20.4743C20.7534 21.8446 19.3965 22.8061 17.8103 22.8061C16.9593 22.8061 16.1719 22.5288 15.5372 22.0602C15.4039 21.9618 15.3911 21.7712 15.4997 21.6461L15.8929 21.1929C16.0015 21.0678 16.1901 21.0559 16.3269 21.1495C16.7476 21.4374 17.2582 21.6061 17.8103 21.6061Z" fillRule="evenodd" clipRule="evenodd" fill="white"/>
  </svg>
));

IconBarEmojiChat.displayName = 'IconBarEmojiChat';

export default IconBarEmojiChat;
