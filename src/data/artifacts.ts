import type { ArtifactItem } from '@/types/artifact';

/**
 * 产物列表（演示数据）
 * 设计稿 Figma 320:8202 只给了排版和 7 条占位文案（多行重复「王家卫的电影世界风格解析」），
 * 这里换成本场会议的合理命名；当前保留 5 条，用来验证条数变化时面板高度会跟着收放。
 */
export const initialArtifacts: ArtifactItem[] = [
  { id: 'artifact-2', name: '竞品参考汇总', type: 'PDF', size: '8.4MB', icon: 'pdf' },
  { id: 'artifact-3', name: '待办与排期', type: 'XLSX', size: '256KB', icon: 'sheet' },
  { id: 'artifact-5', name: '视觉方向说明', type: 'DOCX', size: '640KB', icon: 'word' },
  { id: 'artifact-6', name: '会后跟进清单', type: 'DOCX', size: '320KB', icon: 'word' },
  { id: 'artifact-7', name: '汇报材料初稿', type: 'PPTX', size: '24MB', icon: 'slide' },
];
