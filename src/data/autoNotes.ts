import { parseMarkedText } from '@/data/richText';
import { createId } from '@/data/yuanbaoContent';
import type { AssistantMessage, RichBlock } from '@/types/chat';

/**
 * 自动记录的会议内容（演示用的假素材）
 * 模拟会中不断有人说话、元宝在旁边实时记下；按顺序循环使用，话题延续本场讨论。
 *
 * 写法说明：
 * - `[[人名]]` 渲染成人名胶囊，位置随意，句中句首都行；
 * - `**文字**` 渲染成加粗，用来强调这一段里真正需要被记住的结论；
 * - 一个 seed 可以给多条气泡：同一时间点连发两三条时，只在组头标一次「元宝 + 时间」。
 */
interface AutoNoteSeed {
  bubbles: string[];
}

const SEEDS: AutoNoteSeed[] = [
  {
    bubbles: [
      '[[黄婷婷]] 与 [[立昌]] 结束前序沟通，双方对当前推进方向达成共识，随后结束通话，可见前序关于 **需求排期** 的拉扯已顺利落地。',
    ],
  },
  {
    bubbles: [
      '随后，[[立昌]] 切入新议题，明确会前信息统计等由 **AI 完成**，并探讨是否接入 A6，这表明会议重心已从业务排期转向 **AI 提效工具** 的落地探讨。',
      '针对会后环节，[[黄婷婷]] 指出 Agent 需具备 **主动总结会议内容** 的能力，相当于给 AI 定下了「主动复盘」的核心考核指标。',
    ],
  },
  {
    bubbles: [
      '针对当前元宝纪要等沉淀载体，[[TizzeHuang]] 提出按内容形态分流：纯图文直接采用文档，视频则考虑 **彻底重构** 而非简单嵌入，可见团队正试图 **打破现有框架**，按媒介特性重新设计承载逻辑。',
    ],
  },
  {
    bubbles: [
      '[[LisaWang]] 明确 **AI Agent 的核心价值** 在于深度挖掘并总结会议上下文，随后将议题转向文档与纪要的转化，这标志着讨论重心从 AI 能力落地，正式切入具体的 **产品载体规划**。',
      '[[立昌]] 补充：录制的段落标记建议按发言人切，不按时间切，回看时更好定位。',
    ],
  },
  {
    bubbles: [
      '[[KanyeWest]] 指出内容迁移不能简单「硬塞」，需明确哪些能用组件、哪些需定制化，这暴露出 **底层组件复用率** 与业务定制需求间的博弈，是后续开发的核心难点。',
    ],
  },
  {
    bubbles: [
      '[[JennyFa]] 提到登录页的「亲和」到底指文案语气还是插画风格，这次先不定，留给 **两版各自发挥**，避免过早收敛。',
    ],
  },
  {
    bubbles: [
      '[[黄婷婷]] 收束讨论：两版视觉的差异要放在 **同一个页面里切换对比**，分成两份稿子看不出差别。',
      '下次评审约在 **下周三同一时间**，先把两版放在一起看，别单看一版就定。',
    ],
  },
  {
    bubbles: ['会后跟进清单要区分「**谁的待办**」和「**什么时候看**」，不然看完就忘了。'],
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
    createdAt: Date.now(),
    isNote: true,
    bubbles: seed.bubbles.map((text) => {
      const blocks: RichBlock[] = [{ type: 'paragraph', runs: parseMarkedText(text) }];
      return { id: createId('auto-note-bubble'), blocks };
    }),
  };
}
