import { createId } from '@/data/yuanbaoContent';
import type { AssistantMessage } from '@/types/chat';

/** 一次投票的草稿（元宝生成、用户确认后发出） */
export interface PollDraft {
  title: string;
  /** 单选 / 多选 */
  mode: 'single' | 'multi';
  anonymous: boolean;
  options: string[];
}

export const teamBuildingPoll: PollDraft = {
  title: '团建去哪玩？',
  mode: 'single',
  anonymous: true,
  options: ['环球影城', '密室逃脱', '城郊露营', '剧本杀'],
};

/** 投票发出后元宝的确认消息 */
export function buildPollPostedMessage(title: string): AssistantMessage {
  return {
    id: createId('poll-posted'),
    role: 'assistant',
    createdAt: Date.now(),
    bubbles: [
      {
        id: createId('poll-posted-bubble'),
        blocks: [
          {
            type: 'paragraph',
            runs: [{ text: `投票「${title}」已经发到会议里，当前 8 位参会人都能看到，结果我会实时更新。` }],
          },
        ],
      },
    ],
    followUps: ['改成多选', '加一个选项'],
  };
}
