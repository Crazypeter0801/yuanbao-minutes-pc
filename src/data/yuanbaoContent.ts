import type { AssistantMessage, ChatMessage, RichBlock, TextRun } from '@/types/chat';

/**
 * V1 元宝对话的 mock 数据 + 本地问答规则（文案取自 Figma 257:1540）
 * TODO: 接入元宝问答接口后，用接口返回替换 answerQuestion / buildStageSummary。
 */

let seed = 0;
/** 生成前端唯一 id */
export function createId(prefix: string): string {
  seed += 1;
  return `${prefix}-${Date.now().toString(36)}-${seed}`;
}

/** 纯文本段落 */
const p = (...runs: (string | TextRun)[]): RichBlock => ({
  type: 'paragraph',
  runs: runs.map((run) => (typeof run === 'string' ? { text: run } : run)),
});
/** 加粗片段 */
const b = (text: string): TextRun => ({ text, bold: true });
/** 列表 */
const list = (...items: (string | TextRun[])[]): RichBlock => ({
  type: 'list',
  items: items.map((item) => (typeof item === 'string' ? [{ text: item }] : item)),
});
const h = (text: string): RichBlock => ({ type: 'heading', text });

/* ------------------------------------------------------------------ */
/* 初始纪要：两段实时纪要                                               */
/* ------------------------------------------------------------------ */

export const initialMessages: ChatMessage[] = [
  {
    id: 'a-1',
    role: 'assistant',
    time: '2分钟前',
    bubbles: [
      {
        id: 'a-1-1',
        mention: '黄婷婷',
        blocks: [
          p('展示了会前收集的竞品参考，对比了两种组织方式：竞品偏向“以面为主”的布局，当前产品则更偏线性结构。'),
        ],
      },
      {
        id: 'a-1-2',
        blocks: [
          p('视觉方向暂定探索两版：一版以线条和卡片组织内容；另一版采用少量强调色，以大面积灰色保持简洁。'),
        ],
      },
    ],
  },
  {
    id: 'a-2',
    role: 'assistant',
    time: '刚刚',
    bubbles: [
      {
        id: 'a-2-1',
        withLink: true,
        blocks: [
          p('刚才提到要做两版视觉探索，我把本场已经提出的要求整理在一起，方便后续出稿对照：'),
          h('两版共同要求'),
          list(
            '整体保持干净，减少零散的颜色点缀。',
            '对比线条粗细、圆角对界面观感的影响。',
            '登录页需要更亲和、有趣。',
          ),
          h('需要拉开差异的部分'),
          list(
            [b('线条／卡片版'), { text: '：重点验证内容分组和层级是否清晰。' }],
            [b('少色大灰版'), { text: '：重点验证简洁感，以及少量强调色能否突出重点。' }],
          ),
          p(
            b('尚未确定：'),
            '是否保留现有主题色，以及竖向布局如何改善。刚才展示的高纯度浅色配色，也可以作为两版的对照参考。',
          ),
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 本地问答规则                                                         */
/* ------------------------------------------------------------------ */

/** 组装一条元宝回答 */
function reply(blocks: RichBlock[], extra?: Partial<AssistantMessage>): AssistantMessage {
  return {
    id: createId('ans'),
    role: 'assistant',
    time: '刚刚',
    bubbles: [{ id: createId('bubble'), blocks }],
    ...extra,
  };
}

/**
 * 根据问题返回 mock 回答
 * 只做关键词匹配，目的是让演示时每个问题都有像样的回应。
 */
export function answerQuestion(question: string): AssistantMessage {
  const q = question.trim();

  if (/待办|todo|要做|任务/i.test(q)) {
    return reply(
      [
        p('目前记下 3 项待办：'),
        list(
          [b('黄婷婷'), { text: '：整理竞品参考，标出代表案例。' }],
          [b('立昌'), { text: '：出两版视觉方向初稿，各含首页与登录页。' }],
          [b('全员'), { text: '：下次评审前确认是否保留现有主题色。' }],
        ),
      ],
      { source: '引用 · 本场纪要', followUps: ['帮我同步到待办', '谁的待办最急？'] },
    );
  }

  if (/错过|补一下|补充|总结|结论|讨论了/.test(q)) {
    return reply(
      [
        p('到目前为止主要聊了三件事：'),
        list(
          '对比了竞品“以面为主”和当前线性结构两种组织方式。',
          '视觉方向暂定两版并行：线条／卡片版、少色大灰版。',
          '登录页需要更亲和、有趣。',
        ),
        p(b('还没定：'), '是否保留现有主题色、竖向布局怎么改。'),
      ],
      { source: '引用 · 最近 10 分钟的讨论', followUps: ['说得更具体些', '列出我的待办'] },
    );
  }

  if (/具体|展开|详细|多说/.test(q)) {
    return reply(
      [
        p('补充几处细节：'),
        list(
          '线条粗细和圆角会单独出对照，用来判断哪种更“干净”。',
          '少色大灰版里，强调色只用在关键操作和状态上。',
          '刚才展示的高纯度浅色配色，可作为两版的对照参考。',
        ),
      ],
      { source: '引用 · 2分钟前的讨论' },
    );
  }

  if (/邮件|同步|发给/.test(q)) {
    return reply(
      [
        p('会后邮件草稿：'),
        p(b('主题：'), '视觉改版方向讨论 · 会议纪要'),
        p('各位好，今天确定视觉方向分两版并行探索（线条／卡片版、少色大灰版），登录页要更亲和、有趣。待办见附表，主题色是否保留下次评审确认。'),
      ],
      { followUps: ['语气再正式一点', '加上待办表格'] },
    );
  }

  if (/主题色|颜色|配色/.test(q)) {
    return reply(
      [p('主题色是否保留目前还没定。会上提到可以参考刚才展示的高纯度浅色配色，作为两版的对照。')],
      { source: '引用 · 刚刚的讨论' },
    );
  }

  return reply(
    [p('本场会议里还没有和这个问题直接相关的讨论。你可以换个说法，或者问我目前的结论、待办，以及某位参会人说了什么。')],
    { followUps: ['刚才讨论了哪些结论？', '我有哪些待办？'] },
  );
}

/** 「立即总结」生成的阶段小结 */
export function buildStageSummary(): AssistantMessage {
  return reply([
    p('截至目前（01:31）的阶段小结：'),
    list(
      '视觉方向分两版并行探索：线条／卡片版、少色大灰版。',
      '共同要求：整体干净、少用零散颜色点缀，登录页更亲和。',
      '待定：是否保留现有主题色、竖向布局如何改善。',
    ),
  ]);
}

/**
 * 「保存截图」后的确认消息
 * @param time 会议进行时长，如 01:31:09
 */
export function buildScreenshotNote(time: string): AssistantMessage {
  return reply([p(`已保存 ${time} 的会议画面，会附在本场纪要对应的段落里。`)]);
}
