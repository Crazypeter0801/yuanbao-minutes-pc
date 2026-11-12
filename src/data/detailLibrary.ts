import coverCode from '@/assets/detail/card-code.png';
import coverHunyuan from '@/assets/detail/card-hunyuan.png';
import coverDlpfc from '@/assets/detail/cover-dlpfc.png';
import coverPhoto from '@/assets/detail/cover-photo.png';
import coverRetro from '@/assets/detail/cover-retro.png';
import coverVideo from '@/assets/detail/cover-video.jpg';

/** 资料库筛选。没有对应卡片的分类保持空，不做假数据。 */
export type DetailLibraryFilter = 'all' | 'note' | 'file' | 'media' | 'link';

export type DetailLibraryKind = 'doc' | 'photo' | 'video' | 'code' | 'logo';

export interface DetailLibraryItem {
  id: string;
  title: string;
  meta: string;
  filter: Exclude<DetailLibraryFilter, 'all'>;
  kind: DetailLibraryKind;
  cover: string;
  /** 照片右下角的张数；只有相册卡有 */
  count?: string;
}

export const DETAIL_LIBRARY_FILTERS: { key: DetailLibraryFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'note', label: '元宝笔记' },
  { key: 'file', label: '文件' },
  { key: 'media', label: '图片与视频' },
  { key: 'link', label: '链接' },
];

/** 资料库可见的 6 张（Figma 289:31272）。笔记和链接在这套稿里没有卡片。 */
export const DETAIL_LIBRARY: DetailLibraryItem[] = [
  {
    id: 'dlpfc',
    title: '基于 DLPFC 的研究报...',
    meta: '12:26',
    filter: 'file',
    kind: 'doc',
    cover: coverDlpfc,
  },
  {
    id: 'photo',
    title: '相册',
    meta: '',
    filter: 'media',
    kind: 'photo',
    cover: coverPhoto,
    count: '4',
  },
  {
    id: 'video',
    title: '视频',
    meta: '',
    filter: 'media',
    kind: 'video',
    cover: coverVideo,
  },
  {
    id: 'retro',
    title: 'RETROSPECTIVE LEA...',
    meta: '昨天 17:38',
    filter: 'file',
    kind: 'doc',
    cover: coverRetro,
  },
  {
    id: 'code',
    title: 'Tank Battle.python',
    meta: '09/04 10:44',
    filter: 'file',
    kind: 'code',
    cover: coverCode,
  },
  {
    id: 'hunyuan',
    title: 'Tencent_Hunyuan3D....',
    meta: '08/27 15:33',
    filter: 'file',
    kind: 'logo',
    cover: coverHunyuan,
  },
];
