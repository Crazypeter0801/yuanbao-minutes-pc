import type { FC } from 'react';
import IconVideoNameMic from '@/assets/d2c/icons/v1/icon-video-name-mic';
import avatarJenny from '@/assets/d2c/images/v1/avatar-jenny@2x.png';
import avatarJony from '@/assets/d2c/images/v1/avatar-jony@2x.png';
import avatarKanye from '@/assets/d2c/images/v1/avatar-kanye@2x.png';
import avatarLisa from '@/assets/d2c/images/v1/avatar-lisa@2x.png';
import avatarTizze from '@/assets/d2c/images/v1/avatar-tizze@2x.png';
import videoSpeaker from '@/assets/d2c/images/v1/video-speaker@2x.png';
import styles from './index.module.scss';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  /** 头像下方柔光的不透明度：设计稿首位 0.5，其余 0.35 */
  glowStrong?: boolean;
  /** 正在说话：头像外加三圈绿色声波 */
  speaking?: boolean;
}

// TODO: 接入真实会议流后由参会人列表驱动
const PARTICIPANTS: Participant[] = [
  { id: 'jony', name: 'JonyZhang', avatar: avatarJony, glowStrong: true },
  { id: 'tizze', name: 'TizzeHuang', avatar: avatarTizze, speaking: true },
  { id: 'lisa', name: 'LisaWong', avatar: avatarLisa },
  { id: 'kanye', name: 'KanyeWest', avatar: avatarKanye },
  { id: 'jenny', name: 'JennyFa', avatar: avatarJenny },
];

const SPEAKER_NAME = '艾慧慧Taylor';

/**
 * 会议画面：演讲者视图（Figma 257:1966）
 * 上：参会人头像条（317:5308，5 块 210×118、间距 12，右缘渐隐）
 * 下：主讲人大画面（316:2002，圆角 8，左下角名字水牌）
 * 说明：本期仅做视觉还原，不挂交互。
 */
export const MeetingStage: FC = () => (
  <div className={styles.stage}>
    <div className={styles.strip}>
      <div className={styles.stripTrack}>
        {PARTICIPANTS.map((p) => (
          <div className={styles.tile} key={p.id}>
            {/* 头像下方的柔光：同一张图下移 10、模糊 20 */}
            <img
              className={`${styles.avatarGlow} ${p.glowStrong ? styles.avatarGlowStrong : ''}`}
              src={p.avatar}
              alt=""
              draggable={false}
            />
            {p.speaking && (
              <span className={styles.rings} aria-hidden="true">
                <span className={`${styles.ring} ${styles.ringOuter}`} />
                <span className={`${styles.ring} ${styles.ringMiddle}`} />
                <span className={`${styles.ring} ${styles.ringInner}`} />
              </span>
            )}
            <img className={styles.avatar} src={p.avatar} alt={`${p.name}的头像`} draggable={false} />
            <span className={styles.tileName}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>

    <div className={styles.speaker}>
      <img className={styles.speakerVideo} src={videoSpeaker} alt={`${SPEAKER_NAME}的视频画面`} draggable={false} />
      <div className={styles.nameTag}>
        <IconVideoNameMic />
        <span className={styles.name}>{SPEAKER_NAME}</span>
      </div>
    </div>
  </div>
);
