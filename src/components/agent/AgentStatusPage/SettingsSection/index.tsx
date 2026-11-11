import { Fragment, type FC, type ReactNode } from 'react';
import IconStatusChevron from '@/assets/d2c/icons/agent-status/icon-status-chevron';
import IconStatusSettingApps from '@/assets/d2c/icons/agent-status/icon-status-setting-apps';
import IconStatusSettingAuto from '@/assets/d2c/icons/agent-status/icon-status-setting-auto';
import IconStatusSettingLanguage from '@/assets/d2c/icons/agent-status/icon-status-setting-language';
import IconStatusSettingPersonal from '@/assets/d2c/icons/agent-status/icon-status-setting-personal';
import { Pressable } from '@/components/common/Pressable';
import type { AgentSettingIcon, AgentSettingItem } from '@/data/agentStatusSettings';
import styles from './index.module.scss';

/** 方案一的设置行图标（Figma 242:1147 Icon Kit） */
const SETTING_ICONS: Record<AgentSettingIcon, ReactNode> = {
  apps: <IconStatusSettingApps />,
  personal: <IconStatusSettingPersonal />,
  auto: <IconStatusSettingAuto />,
  language: <IconStatusSettingLanguage />,
};

interface SettingsSectionProps {
  variant: 'tabs' | 'flow';
  settings: AgentSettingItem[];
  /** 打开设置项（演示） */
  onOpenSetting: (setting: AgentSettingItem) => void;
}

/** 状态页 Agent 设置：方案一带图标，方案二按设计稿只保留文字 */
export const SettingsSection: FC<SettingsSectionProps> = ({
  variant,
  settings,
  onOpenSetting,
}) => (
  <section className={styles.section} aria-label="Agent 设置">
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>Agent 设置</h2>
    </div>
    <div className={styles.card}>
      {settings.map((setting, index) => (
        <Fragment key={setting.id}>
          <Pressable
            className={styles.row}
            onClick={() => onOpenSetting(setting)}
            ariaLabel={`${setting.label}，${setting.value}`}
          >
            {variant === 'tabs' && setting.icon && (
              <span className={styles.icon}>{SETTING_ICONS[setting.icon]}</span>
            )}
            <span className={styles.label}>{setting.label}</span>
            <span className={styles.value}>{setting.value}</span>
            <span className={styles.chevron}>
              <IconStatusChevron />
            </span>
          </Pressable>
          {index < settings.length - 1 && (
            <div className={`${styles.divider} ${variant === 'flow' ? styles.dividerFlow : ''}`} />
          )}
        </Fragment>
      ))}
    </div>
  </section>
);
