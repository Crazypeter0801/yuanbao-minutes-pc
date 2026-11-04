import React from 'react';

interface IconMeetAppLogoProps {
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

/** IconMeetAppLogo - Figma nodeId: 245:5702 */
const IconMeetAppLogo: React.FC<IconMeetAppLogoProps> = React.memo(({
  width = 20,
  height = 20,
  color = 'currentColor',
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
    <path d="M13.8568 4.82161L19.482 10.3275C20.1266 10.9587 20.1696 11.956 19.6109 12.636L19.482 12.7766L17.1439 15.0656L13.5779 11.5743L10.0042 15.0732L6.77053 11.9069L13.8568 4.82161ZM6.44193 4.54688L6.4409 4.57191L9.86737 7.9153L2.80316 14.9795L0.51965 12.7562C-0.127026 12.1265 -0.170137 11.1317 0.390315 10.4534L0.51965 10.3131L6.41508 4.57191L6.4156 4.54709L6.42799 4.56005L6.44193 4.54688Z" fillRule="evenodd" clipRule="evenodd" fill="#373C48"/>
  </svg>
));

IconMeetAppLogo.displayName = 'IconMeetAppLogo';

export default IconMeetAppLogo;
