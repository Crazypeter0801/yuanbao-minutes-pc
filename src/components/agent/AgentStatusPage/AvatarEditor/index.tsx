import { useState, type FC } from 'react';
import checkIcon from '@/assets/detail/avatar-check.svg';
import { Pressable } from '@/components/common/Pressable';
import { DETAIL_AVATARS, DETAIL_AVATAR_EXAMPLE_ID } from '@/data/detailAvatars';
import styles from './index.module.scss';

type AvatarTab = 'default' | 'generate' | 'upload';

interface AvatarEditorProps {
  appliedSrc: string | null;
  onCancel: () => void;
  onApply: (src: string) => void;
}

/**
 * 从头像附近展开的编辑面板（Figma 291:36952）
 * 默认 Tab 四个形象，稿上花臂咪带勾。取消不改，设置头像才换。
 */
export const AvatarEditor: FC<AvatarEditorProps> = ({ appliedSrc, onCancel, onApply }) => {
  const applied = DETAIL_AVATARS.find((item) => item.src === appliedSrc);
  const [tab, setTab] = useState<AvatarTab>('default');
  const [draftId, setDraftId] = useState(applied?.id ?? DETAIL_AVATAR_EXAMPLE_ID);

  return (
    <div className={styles.panel} role="dialog" aria-label="编辑形象">
      <div className={styles.tabs}>
        {(
          [
            ['default', '默认'],
            ['generate', '生成'],
            ['upload', '上传'],
          ] as const
        ).map(([key, label]) => (
          <Pressable
            key={key}
            className={`${styles.tab} ${tab === key ? styles.tabActive : ''}`}
            onClick={() => setTab(key)}
            ariaLabel={label}
            ariaExpanded={tab === key}
          >
            {label}
          </Pressable>
        ))}
      </div>

      {tab === 'default' ? (
        <div className={styles.grid}>
          {DETAIL_AVATARS.map((avatar) => (
            <Pressable
              key={avatar.id}
              className={styles.option}
              onClick={() => setDraftId(avatar.id)}
              ariaLabel={avatar.name}
            >
              <span className={styles.thumb}>
                <img src={avatar.src} alt="" />
                {draftId === avatar.id && <img className={styles.check} src={checkIcon} width={16} height={16} alt="" />}
              </span>
              <span className={styles.name}>{avatar.name}</span>
            </Pressable>
          ))}
        </div>
      ) : (
        <p className={styles.placeholder}>{tab === 'generate' ? '还没有生成的形象' : '从本地选择一张图片'}</p>
      )}

      <div className={styles.footer}>
        <Pressable className={styles.cancel} onClick={onCancel} ariaLabel="取消">
          取消
        </Pressable>
        <Pressable
          className={styles.confirm}
          onClick={() => {
            const picked = DETAIL_AVATARS.find((item) => item.id === draftId) ?? DETAIL_AVATARS[1];
            onApply(picked.src);
          }}
          ariaLabel="设置头像"
        >
          设置头像
        </Pressable>
      </div>
    </div>
  );
};
