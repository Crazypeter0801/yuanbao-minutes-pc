/**
 * 会中文件数据结构（底栏文件夹里列出的内容）
 * 说明：当前为前端 mock，接入真实接口时保持这套结构即可，视图无需改动。
 */

/** 文件类型图标，对应设计稿里的文件徽标；image 用缩略图代替徽标 */
export type ArtifactIcon = 'yuanbao' | 'pdf' | 'sheet' | 'transcript' | 'word' | 'slide' | 'image';

/**
 * 分类（参考 Codex 的「输出 / 来源」）
 * - output：元宝生成的产物（报告、PPT、表格…）
 * - source：对话里出现过的原始材料（会议截图、逐字稿、上传的文件…）
 */
export type ArtifactGroup = 'output' | 'source';

export interface ArtifactItem {
  id: string;
  /** 文件名，列表里单行截断 */
  name: string;
  /** 类型标签，如 PDF / DOCX / 图片 */
  type: string;
  /** 体积文案，如 12MB */
  size: string;
  icon: ArtifactIcon;
  group: ArtifactGroup;
  /** 图片类的缩略图 */
  thumb?: string;
}
