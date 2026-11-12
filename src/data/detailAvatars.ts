import avatarHuabimi from '@/assets/detail/avatar-huabimi.png';
import avatarSaodiji from '@/assets/detail/avatar-saodiji.png';
import avatarWending from '@/assets/detail/avatar-wending.png';
import avatarYuanbao from '@/assets/detail/avatar-yuanbao.png';

export interface DetailAvatar {
  id: string;
  name: string;
  src: string;
}

/** 编辑形象 · 默认 Tab 的四个形象（Figma 291:36952）。稿上默认勾着花臂咪。 */
export const DETAIL_AVATARS: DetailAvatar[] = [
  { id: 'yuanbao', name: '元宝', src: avatarYuanbao },
  { id: 'huabimi', name: '花臂咪', src: avatarHuabimi },
  { id: 'saodiji', name: '扫地基', src: avatarSaodiji },
  { id: 'wending', name: '情绪稳定', src: avatarWending },
];

export const DETAIL_AVATAR_EXAMPLE_ID = 'huabimi';
