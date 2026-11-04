/**
 * 元宝生成的产物（文件）数据结构
 * 说明：当前为前端 mock，接入真实接口时保持这套结构即可，视图无需改动。
 */

/** 文件类型图标，对应设计稿里 32×32 的文件徽标 */
export type ArtifactIcon = 'yuanbao' | 'pdf' | 'sheet' | 'transcript' | 'word' | 'slide';

export interface ArtifactItem {
  id: string;
  /** 文件名，列表里单行截断 */
  name: string;
  /** 类型标签，如 PDF / DOCX */
  type: string;
  /** 体积文案，如 12MB */
  size: string;
  icon: ArtifactIcon;
}
