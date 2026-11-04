import type {
  AssistantMessage,
  ChatMessage,
  MeetingMinutes,
  RichBlock,
  TextRun,
} from '@/types/chat';

/**
 * 三个方案的 mock 数据 + 本地问答规则
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
/* 方案 A：纪要与问答混排（文案取自 Figma 245:5577）                     */
/* ------------------------------------------------------------------ */

export const schemeAMessages: ChatMessage[] = [
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
/* 方案 B：元宝纪要 Tab（文案取自 Figma 248:13383）+ 问元宝 Tab           */
/* ------------------------------------------------------------------ */

export const schemeBMinutes: ChatMessage[] = [
  {
    id: 'b-1',
    role: 'assistant',
    time: '5分钟前',
    bubbles: [
      {
        id: 'b-1-1',
        blocks: [p('hi，我是你的元宝会议助手，我正在帮你实时记录会议纪要，请安心开会！')],
      },
    ],
  },
  {
    id: 'b-2',
    role: 'assistant',
    time: '刚刚',
    bubbles: [
      {
        id: 'b-2-1',
        blocks: [p('重点优化了数据总览界面和用户调用量展示逻辑，并简化了白名单处理方式，记住这一点。')],
      },
      {
        id: 'b-2-2',
        blocks: [
          p('会议讨论了调用量统计模块的设计方案，重点优化了数据总览界面和用户调用量展示逻辑，是为了元宝的体验。'),
        ],
      },
    ],
  },
];

/** 问元宝 Tab 的欢迎语（设计稿未给，按同一气泡语言补齐） */
export const schemeBAskWelcome: ChatMessage[] = [
  {
    id: 'b-ask-1',
    role: 'assistant',
    time: '刚刚',
    bubbles: [
      {
        id: 'b-ask-1-1',
        blocks: [p('会上任何内容都可以问我，比如某人刚才说了什么、目前有哪些结论。回答只有你能看到。')],
      },
    ],
    followUps: ['刚才讨论了哪些结论？', '我有哪些待办？', '帮我补一下错过的内容'],
  },
];

/* ------------------------------------------------------------------ */
/* 方案 C：问答为主，纪要按需展开（无稿，参考 Granola）                  */
/* ------------------------------------------------------------------ */

export const schemeCMessages: ChatMessage[] = [
  { id: 'c-1', role: 'user', text: '刚才黄婷婷提的两版视觉，差别在哪？' },
  {
    id: 'c-2',
    role: 'assistant',
    time: '刚刚',
    source: '引用 · 2分钟前 黄婷婷的发言',
    bubbles: [
      {
        id: 'c-2-1',
        blocks: [
          p('两版的共同点是都要更干净、少用零散的颜色点缀；差别在验证重点：'),
          list(
            [b('线条／卡片版'), { text: '：用线条和卡片组织内容，看分组和层级是否清楚。' }],
            [b('少色大灰版'), { text: '：大面积灰色加少量强调色，看能否既简洁又突出重点。' }],
          ),
          p('是否保留现有主题色还没定。'),
        ],
      },
    ],
    followUps: ['说得更具体些', '整理成待办'],
  },
];

/** 方案 C 抽屉里的结构化纪要 */
export const schemeCMinutes: MeetingMinutes = {
  title: '视觉改版方向讨论',
  overview:
    '会上对比了会前收集的竞品参考：竞品偏“以面为主”，当前产品偏线性结构。视觉方向暂定探索两版，并整理了两版的共同要求和需要拉开差异的部分。',
  conclusions: [
    {
      id: 'c-con-1',
      title: '两版并行探索',
      detail: '线条／卡片版验证内容分组与层级；少色大灰版验证简洁感与强调色。',
    },
    {
      id: 'c-con-2',
      title: '共同要求',
      detail: '整体干净、减少零散颜色点缀；对比线条粗细与圆角对观感的影响。',
    },
    { id: 'c-con-3', title: '登录页', detail: '需要更亲和、有趣。' },
  ],
  todos: [
    { id: 'c-todo-1', owner: '黄婷婷', content: '整理竞品参考，标出“以面为主”与线性结构的代表案例', done: false },
    { id: 'c-todo-2', owner: '立昌', content: '出两版视觉方向初稿，各含首页与登录页', done: false },
    { id: 'c-todo-3', owner: '全员', content: '下次评审前确认是否保留现有主题色', done: false },
  ],
  pending: ['是否保留现有主题色', '竖向布局如何改善'],
};

/** 方案 C 输入框上方的快捷技能（对应 Granola 的 recipes），文案控制在一行放得下 */
export const schemeCRecipes = ['补一下错过的', '我的待办', '写会后邮件'];

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
