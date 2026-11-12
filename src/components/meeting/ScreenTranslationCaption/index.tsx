import type { FC } from 'react';
import styles from './index.module.scss';

/**
 * 屏幕翻译叠层：盖在主讲人画面底部，不挡名字水牌和会议底栏。
 * 只有接受「开启屏幕翻译」之后才出现。
 */
export const ScreenTranslationCaption: FC = () => (
  <div className={styles.caption}>
    <p className={styles.badge}>屏幕翻译 · 只有你能看到</p>
    <p className={styles.line}>登录页先只露出手机号和主按钮</p>
    <p className={styles.line}>验证码和第三方登录先收着，点到再展开</p>
  </div>
);
