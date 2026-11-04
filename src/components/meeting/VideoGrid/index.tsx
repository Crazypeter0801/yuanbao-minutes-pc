import type { FC } from 'react';
import IconVideoNameMic from '@/assets/d2c/icons/v1/icon-video-name-mic';
import tileLeft from '@/assets/d2c/images/v1/video-tile-left@2x.png';
import tileRight from '@/assets/d2c/images/v1/video-tile-right@2x.png';
import styles from './index.module.scss';

interface VideoTile {
  id: string;
  image: string;
  /** 设计稿中图片节点的原始尺寸，超出画面部分被裁掉 */
  imageClassName: string;
  name: string;
}

// TODO: 接入真实会议流后由参会人列表驱动
const TILES: VideoTile[] = [
  { id: 'left', image: tileLeft, imageClassName: styles.imageLeft, name: '艾慧慧Taylor' },
  { id: 'right', image: tileRight, imageClassName: styles.imageRight, name: '艾慧慧Taylor' },
];

/**
 * 会议画面：两宫格（Figma 316:2002）
 * padding 0 16 16，两块等宽、间距 8、圆角 8；左下角为名字水牌。
 * 说明：本期仅做视觉还原，不挂交互。
 */
export const VideoGrid: FC = () => (
  <div className={styles.grid}>
    {TILES.map((tile) => (
      <div className={styles.tile} key={tile.id}>
        <img className={tile.imageClassName} src={tile.image} alt={`${tile.name}的视频画面`} draggable={false} />
        <div className={styles.nameTag}>
          <IconVideoNameMic />
          <span className={styles.name}>{tile.name}</span>
        </div>
      </div>
    ))}
  </div>
);
