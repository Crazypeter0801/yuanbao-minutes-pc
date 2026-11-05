import { createId } from '@/data/yuanbaoContent';
import type { ArtifactItem } from '@/types/artifact';
import type { AssistantMessage } from '@/types/chat';

/**
 * 产物列表（演示数据）
 *
 * 一开始是空的：没有产物时底栏不出现文件入口。
 * 用户说「生成一份竞品分析的 PDF」之后才会有文件：本次生成的那份排最前，
 * 首次再附带一组会中已有的文件，方便演示面板里多条文件的排版与滚动。
 */
export const companionArtifacts: ArtifactItem[] = [
  { id: 'artifact-sheet', name: '待办与排期', type: 'XLSX', size: '256KB', icon: 'sheet' },
  { id: 'artifact-word', name: '视觉方向说明', type: 'DOCX', size: '640KB', icon: 'word' },
  { id: 'artifact-slide', name: '汇报材料初稿', type: 'PPTX', size: '24MB', icon: 'slide' },
  { id: 'artifact-transcript', name: '会议逐字稿', type: 'TXT', size: '84KB', icon: 'transcript' },
];

export type ArtifactKind = 'pdf' | 'pptx';

/**
 * 从一句话里取文件名：「生成一份竞品分析的 PDF」→「竞品分析报告」
 * 取不到主题时按类型给默认名，保证列表里每条都读得懂
 */
export function resolveArtifactTitle(text: string, kind: ArtifactKind): string {
  if (/竞品/.test(text)) {
    return kind === 'pdf' ? '竞品分析报告' : '竞品分析汇报';
  }
  if (/汇报/.test(text)) {
    return '会后汇报';
  }
  return kind === 'pdf' ? '会议纪要' : '会后汇报';
}

/** 本次生成的那份文件，排在列表最前 */
export function buildArtifact(kind: ArtifactKind, title: string): ArtifactItem {
  return kind === 'pdf'
    ? { id: createId('artifact'), name: title, type: 'PDF', size: '2.1MB', icon: 'pdf' }
    : { id: createId('artifact'), name: title, type: 'PPTX', size: '6.4MB', icon: 'slide' };
}

/** 创建产物后元宝的回复 */
export function buildArtifactCreatedMessage(artifact: ArtifactItem): AssistantMessage {
  return {
    id: createId('artifact-created'),
    role: 'assistant',
    createdAt: Date.now(),
    bubbles: [
      {
        id: createId('artifact-created-bubble'),
        blocks: [
          {
            type: 'paragraph',
            runs: [
              { text: '已经按今天的讨论生成了' },
              { text: `「${artifact.name}」`, bold: true },
              { text: '，点下方卡片可以打开，之后也能在输入框上方的文件夹里找到。' },
            ],
          },
        ],
      },
    ],
    artifact,
    followUps: ['发到群里', '我有哪些待办'],
  };
}
