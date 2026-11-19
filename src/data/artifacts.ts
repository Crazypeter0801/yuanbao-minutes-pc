import { meetingSession, SHARE_TO_GROUP_LABEL } from '@/data/meetingSession';
import { createId } from '@/data/yuanbaoContent';
import type { ArtifactItem } from '@/types/artifact';
import type { AssistantMessage } from '@/types/chat';

/**
 * 会中文件（演示数据）
 *
 * 文件夹装的是对话里出现过的全部内容，分两类：元宝产出的「输出」和用户发进来的「来源」。
 * 一开始是空的：没有任何文件时底栏不出现文件入口。
 * 用户说「生成一份竞品分析的 PDF」之后才会有文件：本次生成的那份排最前，
 * 首次再附带一组会中已有的文件，方便演示分类、排版与滚动；记录会议画面会往「来源」里加一张截图。
 */
export const companionArtifacts: ArtifactItem[] = [
  { id: 'artifact-sheet', name: '待办与排期', type: 'XLSX', size: '256KB', icon: 'sheet', group: 'output' },
  { id: 'artifact-word', name: '视觉方向说明', type: 'DOCX', size: '640KB', icon: 'word', group: 'output' },
  { id: 'artifact-slide', name: '汇报材料初稿', type: 'PPTX', size: '24MB', icon: 'slide', group: 'output' },
  { id: 'artifact-transcript', name: '会议逐字稿', type: 'TXT', size: '84KB', icon: 'transcript', group: 'output' },
  // 用户会前上传的对比稿：来源只放用户发的东西
  { id: 'artifact-brief', name: '两版视觉稿对比', type: 'PDF', size: '5.8MB', icon: 'pdf', group: 'source' },
];

/**
 * 元宝笔记：元宝产出的，算「输出」里的一个文件，始终排在输出第一条
 * 开启云笔记后从第一刻起就在，所以文件夹入口一入会就会出现（至少 1 个文件）。
 */
export const NOTE_ARTIFACT_ID = 'artifact-yuanbao-note';
export const noteArtifact: ArtifactItem = {
  id: NOTE_ARTIFACT_ID,
  name: '元宝笔记',
  type: '笔记',
  size: '实时更新',
  icon: 'yuanbao',
  group: 'output',
};

/** 用户截下的会议画面：用户发进对话的，进「来源」 */
export function buildScreenshotArtifact(thumb: string, createdAt: number = Date.now()): ArtifactItem {
  const date = new Date(createdAt);
  const pad = (value: number) => String(value).padStart(2, '0');
  return {
    id: createId('artifact-shot'),
    name: `会议画面 ${pad(date.getHours())}:${pad(date.getMinutes())}`,
    type: '图片',
    size: '1.2MB',
    icon: 'image',
    group: 'source',
    thumb,
  };
}

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
    ? { id: createId('artifact'), name: title, type: 'PDF', size: '2.1MB', icon: 'pdf', group: 'output' }
    : { id: createId('artifact'), name: title, type: 'PPTX', size: '6.4MB', icon: 'slide', group: 'output' };
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
    followUps: [SHARE_TO_GROUP_LABEL, '我有哪些待办'],
  };
}

/**
 * 发到会议群之后的确认
 * 只回一句结果，不再重复附卡片：文件就在上一条消息里，也在文件夹「输出」里。
 */
export function buildArtifactSharedMessage(artifact: ArtifactItem): AssistantMessage {
  const fileName = `${artifact.name}.${artifact.type.toLowerCase()}`;
  return {
    id: createId('artifact-shared'),
    role: 'assistant',
    createdAt: Date.now(),
    bubbles: [
      {
        id: createId('artifact-shared-bubble'),
        blocks: [
          {
            type: 'paragraph',
            runs: [
              { text: '已把' },
              { text: `「${fileName}」`, bold: true },
              { text: '发到' },
              { text: `「${meetingSession.groupName}」`, bold: true },
              { text: `会议群，群里 ${meetingSession.groupMembers} 位成员会后也能直接打开。` },
            ],
          },
        ],
      },
    ],
    followUps: ['我有哪些待办', '下一步该做什么？'],
  };
}
