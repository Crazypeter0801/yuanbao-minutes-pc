import { useState, type ComponentType, type FC } from 'react';
import IconSideLogo from '@/assets/d2c/icons/schemes/icon-side-logo';
import { Pressable } from '@/components/common/Pressable';
import { MeetingWindow } from '@/components/meeting/MeetingWindow';
import type { SchemeSidebarProps, SchemeVariant } from '@/components/schemes/types';
import styles from './index.module.scss';

interface SchemeWindowProps {
  /** 方案名，如「方案 A」 */
  name: string;
  /** 一句话说明方案思路 */
  description: string;
  /** 该方案的元宝侧栏 */
  sidebar: ComponentType<SchemeSidebarProps>;
  /** 可选变体，在方案标签里切换；第一项为默认 */
  variants?: SchemeVariant[];
}

/**
 * 单个方案窗口：标签（含变体切换）+ 会议窗口（998）+ 元宝侧栏（400）
 * 侧栏开合与变体在这里管理；切换变体不重新挂载侧栏，对话内容保留，便于同一状态下对比。
 */
export const SchemeWindow: FC<SchemeWindowProps> = ({
  name,
  description,
  sidebar: Sidebar,
  variants,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [variant, setVariant] = useState(variants?.[0]?.key);

  return (
    <section className={styles.scheme} aria-label={name}>
      <div className={styles.label}>
        <span className={styles.labelName}>{name}</span>
        <span className={styles.labelDesc}>{description}</span>
        {variants && variants.length > 1 && (
          <div className={styles.variants} role="tablist" aria-label={`${name}变体`}>
            {variants.map((item) => (
              <Pressable
                key={item.key}
                className={`${styles.variant} ${item.key === variant ? styles.variantActive : ''}`}
                onClick={() => setVariant(item.key)}
                ariaLabel={`切换到：${item.label}`}
              >
                {item.label}
              </Pressable>
            ))}
          </div>
        )}
      </div>

      <div className={styles.canvas}>
        <MeetingWindow />
        {sidebarOpen ? (
          <Sidebar onClose={() => setSidebarOpen(false)} variant={variant} />
        ) : (
          <Pressable
            className={styles.reopen}
            onClick={() => setSidebarOpen(true)}
            ariaLabel="打开元宝"
            title="打开元宝"
          >
            <IconSideLogo />
            <span className={styles.reopenText}>元宝</span>
          </Pressable>
        )}
      </div>
    </section>
  );
};
