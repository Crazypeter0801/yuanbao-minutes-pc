import { createId } from '@/data/yuanbaoContent';
import type { AssistantMessage, BubbleCard, RichBlock } from '@/types/chat';

/**
 * 对话里的交互卡片（文案与结构取自 Figma 元宝Agent · Component Gallery 4:351）
 *
 * 卡片只负责「收集一次选择」，选完由元宝接着回一条对应的结果消息；
 * 投票仍走左侧弹窗，不在这里。
 */

const p = (...texts: string[]): RichBlock => ({
  type: 'paragraph',
  runs: texts.map((text) => ({ text })),
});

const list = (...items: string[]): RichBlock => ({
  type: 'list',
  items: items.map((item) => [{ text: item }]),
});

const heading = (text: string): RichBlock => ({ type: 'heading', text });

/** 01 Radio：选择会议总结方式 */
export const summaryModeCard: BubbleCard = {
  id: 'summary-mode',
  kind: 'single',
  title: '选择会议总结方式',
  description: '选择最适合这次会议的输出结构。',
  options: ['简洁摘要', '按议题组织', '行动项优先'],
  primaryLabel: '生成摘要',
};

/** 02 Checkbox：选择需要提取的内容 */
export const extractCard: BubbleCard = {
  id: 'extract',
  kind: 'multi',
  title: '选择需要提取的内容',
  description: '可多选，之后仍可调整。',
  options: ['关键结论', '待办事项', '重要分歧', '参会人观点'],
  primaryLabel: '生成清单',
};

/** 08 Confirmation：确认创建任务 */
export const taskConfirmCard: BubbleCard = {
  id: 'task-confirm',
  kind: 'confirm',
  title: '确认创建任务',
  description: '请确认以下信息，确认后开始处理。',
  summary: [
    { label: '任务', value: '产品评审会议整理' },
    { label: '输出', value: '简洁摘要 · 结论、待办' },
    { label: '交付', value: '2026 年 11 月 18 日' },
  ],
  primaryLabel: '确认创建',
  secondaryLabel: '返回修改',
};

/** 组装一条元宝回复 */
function reply(blocks: RichBlock[], followUps?: string[]): AssistantMessage {
  return {
    id: createId('card-reply'),
    role: 'assistant',
    createdAt: Date.now(),
    bubbles: [{ id: createId('card-reply-bubble'), blocks }],
    followUps,
  };
}

const SUMMARY_BY_MODE: Record<string, RichBlock[]> = {
  简洁摘要: [
    heading('简洁摘要'),
    list(
      '两版视觉并行探索：线条／卡片版、少色大灰版，都要求干净、少用零散颜色。',
      '元宝纪要按内容形态分流：图文走文档，视频考虑重构承载方式。',
      '下次评审约在下周三同一时间，先放在同一页面对比。',
    ),
  ],
  按议题组织: [
    heading('按议题组织'),
    list(
      '视觉方向：两版并行，差异点在内容分组层级与简洁感的取舍。',
      '会后承接：纪要载体按形态分流，录制段落改按发言人切。',
      '排期：下次评审前把两版放进同一页面，避免单看一版就定。',
    ),
  ],
  行动项优先: [
    heading('行动项优先'),
    list(
      '立昌：把两版视觉放进同一页面切换对比，周五前给出结论。',
      '黄婷婷：会后跟进清单补「谁的待办」和「什么时候看」。',
      'TizzeHuang：录制段落标记改为按发言人切。',
    ),
  ],
};

const EXTRACT_BY_OPTION: Record<string, RichBlock[]> = {
  关键结论: [
    heading('关键结论'),
    list('两版视觉的差异在分组层级与简洁感，不在配色。', '纪要要按内容形态分流，视频不适合简单嵌入。'),
  ],
  待办事项: [
    heading('待办事项'),
    list('立昌：两版放进同一页面，周五前对比。', '黄婷婷：跟进清单补责任人与查看时间。'),
  ],
  重要分歧: [
    heading('重要分歧'),
    list('是否保留现有主题色仍未定。', '竖向布局怎么改善，留给两版各自发挥。'),
  ],
  参会人观点: [
    heading('参会人观点'),
    list('LisaWang：AI Agent 的价值在挖掘会议上下文。', 'KanyeWest：内容迁移不能硬塞，要区分组件与定制。'),
  ],
};

function buildSummaryModeResult(mode: string): AssistantMessage {
  const blocks = SUMMARY_BY_MODE[mode] ?? SUMMARY_BY_MODE['简洁摘要'];
  return reply(blocks, ['导出为文档', '我有哪些待办']);
}

function buildExtractResult(values: string[]): AssistantMessage {
  const picked = values.filter((value) => value in EXTRACT_BY_OPTION);
  const blocks = picked.flatMap((value) => EXTRACT_BY_OPTION[value]);
  return reply(
    blocks.length > 0 ? blocks : [p('先选一两项，我再按你选的范围整理。')],
    ['发到群里', '存进纪要'],
  );
}

function buildTaskCreatedResult(): AssistantMessage {
  return reply(
    [
      heading('任务已创建'),
      p('我会按以下配置开始处理：'),
      list('任务：产品评审会议整理', '输出：简洁摘要 · 结论、待办', '交付：2026 年 11 月 18 日'),
      p('整理好会放进「输出」，不会打断会议。'),
    ],
    ['查看任务', '改到下周'],
  );
}

/** 卡片提交后元宝的回复 */
export function buildCardResult(cardId: BubbleCard['id'], values: string[]): AssistantMessage {
  switch (cardId) {
    case 'summary-mode':
      return buildSummaryModeResult(values[0] ?? '简洁摘要');
    case 'extract':
      return buildExtractResult(values);
    case 'task-confirm':
      return buildTaskCreatedResult();
    default:
      return reply([p('收到。')]);
  }
}
