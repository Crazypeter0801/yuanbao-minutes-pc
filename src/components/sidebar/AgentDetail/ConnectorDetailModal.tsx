import { useEffect, type FC } from 'react';
import IconModalClose from '@/assets/d2c/icons/agentDetail811/icon-modal-close';
import { Pressable } from '@/components/common/Pressable';
import type { AgentConnectorItem } from '@/data/agentDetail';
import styles from './index.module.scss';

interface ConnectorDetailModalProps {
  connector: AgentConnectorItem;
  iconSrc: string;
  onClose: () => void;
  onToggleConnect: (id: AgentConnectorItem['id']) => void;
}

/**
 * 连接器查看详情弹窗（Figma 796:85424）
 * 覆盖在元宝详情页之上（宽 320px 居中卡片 + 半透明蒙层），支持查看连接状态与断开/重新连接。
 */
export const ConnectorDetailModal: FC<ConnectorDetailModalProps> = ({
  connector,
  iconSrc,
  onClose,
  onToggleConnect,
}) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`${connector.name} 连接器详情`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.modalCard}>
        <Pressable
          className={styles.modalCloseButton}
          onClick={onClose}
          ariaLabel="关闭连接器详情"
          title="关闭"
        >
          <IconModalClose width={20} height={20} />
        </Pressable>

        <div className={styles.modalHeader}>
          <div className={styles.modalIconWrap}>
            <img
              src={iconSrc}
              alt={connector.name}
              width={36}
              height={36}
              className={styles.modalIconImg}
            />
          </div>
          <div className={styles.modalTitleGroup}>
            <h3 className={styles.modalTitle}>{connector.name}</h3>
            <p className={styles.modalSubtitle}>{connector.description}</p>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalInfoCard}>
            <div className={styles.modalInfoRow}>
              <span className={styles.modalInfoLabel}>状态</span>
              <span
                className={`${styles.modalStatusValue} ${
                  connector.connected ? styles.modalStatusConnected : styles.modalStatusDisconnected
                }`}
              >
                <span
                  className={`${styles.modalStatusDot} ${
                    connector.connected ? styles.modalStatusDotConnected : styles.modalStatusDotDisconnected
                  }`}
                  aria-hidden="true"
                />
                <span>{connector.connected ? '已连接' : '未连接'}</span>
              </span>
            </div>

            <div className={styles.modalDivider} aria-hidden="true" />

            <div className={styles.modalInfoRow}>
              <span className={styles.modalInfoLabel}>连接时间</span>
              <span className={styles.modalInfoValue}>
                {connector.connected ? connector.connectedAt : '未连接'}
              </span>
            </div>

            <div className={styles.modalDivider} aria-hidden="true" />

            <div className={styles.modalInfoRow}>
              <span className={styles.modalInfoLabel}>账号</span>
              <span className={styles.modalInfoValue}>
                {connector.connected ? connector.account : '暂未绑定'}
              </span>
            </div>
          </div>

          <Pressable
            className={styles.modalActionButton}
            onClick={() => onToggleConnect(connector.id)}
            ariaLabel={connector.connected ? `断开 ${connector.name} 连接` : `连接 ${connector.name}`}
          >
            <span
              className={
                connector.connected ? styles.modalActionDangerText : styles.modalActionPrimaryText
              }
            >
              {connector.connected ? '断开连接' : '立即连接'}
            </span>
          </Pressable>
        </div>
      </div>
    </div>
  );
};
