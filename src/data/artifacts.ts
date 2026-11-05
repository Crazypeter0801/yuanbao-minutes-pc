import { createId } from '@/data/yuanbaoContent';
import type { ArtifactItem } from '@/types/artifact';
import type { AssistantMessage } from '@/types/chat';

/**
 * 产物列表（演示数据）
 *
 * 一开始是空的：没有产物时底栏右侧不出现「输出」入口。
 * 用户在指令集合或输入框里说「创建一个 PDF 文件」之后才会有文件，
 * 首次创建一次性给一组，方便演示面板里多条文件的排版与滚动。
 */
export const firstCreatedArtifacts: ArtifactItem[] = [
  { id: 'artifact-pdf', name: '产品评审会议纪要', type: 'PDF', size: '1.2MB', icon: 'pdf' },
  { id: 'artifact-sheet', name: '待办与排期', type: 'XLSX', size: '256KB', icon: 'sheet' },
  { id: 'artifact-word', name: '视觉方向说明', type: 'DOCX', size: '640KB', icon: 'word' },
  { id: 'artifact-slide', name: '汇报材料初稿', type: 'PPTX', size: '24MB', icon: 'slide' },
  { id: 'artifact-transcript', name: '会议逐字稿', type: 'TXT', size: '84KB', icon: 'transcript' },
];

/** 后续再创建时追加的一条 */
export function buildExtraArtifact(kind: 'pdf' | 'pptx'): ArtifactItem {
  return kind === 'pdf'
    ? { id: createId('artifact'), name: `会议纪要 ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`, type: 'PDF', size: '860KB', icon: 'pdf' }
    : { id: createId('artifact'), name: '会后汇报草稿', type: 'PPTX', size: '6.4MB', icon: 'slide' };
}

/** 创建产物后元宝的回复 */
export function buildArtifactCreatedMessage(kind: 'pdf' | 'pptx'): AssistantMessage {
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
              { text: '已经按今天的讨论生成了一份' },
              { text: kind === 'pdf' ? ' PDF 纪要' : ' PPT 汇报草稿', bold: true },
              { text: '，放在输入框上方的文件夹里，随时可以打开或导出。' },
            ],
          },
        ],
      },
    ],
    followUps: ['导出为文档', '我有哪些待办'],
  };
}
