import { createId } from '@/data/yuanbaoContent';
import type { AssistantMessage } from '@/types/chat';

/**
 * 自动记录的会议内容（演示用的假素材）
 * 模拟会中不断有人说话、元宝在旁边实时记下；按顺序循环使用，语气和话题延续本场讨论。
 */
interface AutoNoteSeed {
  /** 发言的人，渲染成句首的蓝色人名胶囊 */
  speaker: string;
  /** 记下的内容，一到两句，别太长——这是流式记录，不是总结 */
  text: string;
}

const SEEDS: AutoNoteSeed[] = [
  {
    speaker: '黄婷婷',
    text: '竞品里有两家把纪要常驻在右侧，不用跳出会议就能改结论，这点值得抄。',
  },
  {
    speaker: '立昌',
    text: '两版视觉的差异最好放在同一个页面里切换对比，分成两份稿子不好看差别。',
  },
  {
    speaker: '黄婷婷',
    text: '登录页的“亲和”到底指文案语气还是插画风格，这次先不定，留给两版各自发挥。',
  },
  {
    speaker: 'TizzeHuang',
    text: '录制的段落标记建议按发言人切，不按时间切，回看时更好定位。',
  },
  {
    speaker: '立昌',
    text: '会后跟进清单要区分「谁的待办」和「什么时候看」，不然看完就忘了。',
  },
  {
    speaker: 'LisaWang',
    text: '主题色如果要保留，浅色版本得重新调对比度，现在这套放在灰底上偏弱。',
  },
  {
    speaker: '黄婷婷',
    text: '下次评审约在下周同一时间，先把两版放在一起看，别单看一版就定。',
  },
];

/**
 * 生成一条自动记录
 * @param index 递增序号，用来在素材里循环，保证两条之间不重复
 */
export function buildAutoNote(index: number): AssistantMessage {
  const seed = SEEDS[index % SEEDS.length];
  return {
    id: createId('auto-note'),
    role: 'assistant',
    time: '刚刚',
    isNote: true,
    bubbles: [
      {
        id: createId('auto-note-bubble'),
        mention: seed.speaker,
        blocks: [{ type: 'paragraph', runs: [{ text: seed.text }] }],
      },
    ],
  };
}
