import videoSpeaker from '@/assets/d2c/images/v1/video-speaker@2x.png';
import { meetingSession } from '@/data/meetingSession';

/** 会议画面截图的图片源：对话里的小图和文件夹「来源」里的缩略图共用 */
export const meetingShotSrc = videoSpeaker;
import type { AssistantMessage, ChatMessage, RichBlock, TextRun } from '@/types/chat';

/**
 * V1 元宝对话的 mock 数据 + 本地问答规则
 * TODO: 接入元宝问答接口后，用接口返回替换 answerQuestion / buildStageSummary。
 *
 * 问答用「有序规则表」而不是 if 串联，原因有两个：
 * 1. 规则有优先级（具体意图必须在通用意图之前），数组顺序就是优先级，改起来直观；
 * 2. 追问建议（followUps）需要能被某条规则接住，规则集中在一处才方便自检，
 *    否则会出现「点了元宝自己的建议却答不上来」。
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

/** 本场记下的 3 项待办，多处回答复用，避免同一件事写成两套说法 */
const TODO_ITEMS: (string | TextRun[])[] = [
  [b('黄婷婷'), { text: '：整理竞品参考，标出代表案例。' }],
  [b('立昌'), { text: '：出两版视觉方向初稿，各含首页与登录页。' }],
  [b('全员'), { text: '：下次评审前确认是否保留现有主题色。' }],
];

/* ------------------------------------------------------------------ */
/* 初始纪要：两段实时纪要                                               */
/* ------------------------------------------------------------------ */

/**
 * 初始消息：空
 * 演示从「刚入会、元宝还没说话」这个状态开始，内容一律由场景切换条或用户提问产生，
 * 刷新页面不应该看到上一轮演示留下的纪要。
 */
export const initialMessages: ChatMessage[] = [];

/* ------------------------------------------------------------------ */
/* 问答规则                                                             */
/* ------------------------------------------------------------------ */

/**
 * 回答主题
 * 同时承担「会话上下文」的作用：邮件类追问（语气、加待办）必须知道上一轮在聊什么，
 * 否则只能靠关键词猜，很容易答偏。
 */
export type ReplyTopic =
  | 'summary'
  | 'detail'
  | 'todo'
  | 'todoSync'
  | 'todoUrgent'
  | 'email'
  | 'emailFormal'
  | 'emailTodo'
  | 'emailShort'
  | 'shareToGroup'
  | 'speaker'
  | 'login'
  | 'layout'
  | 'competitor'
  | 'color'
  | 'noted'
  | 'meetingSchedule'
  | 'timer'
  | 'timerCancel'
  | 'poll'
  | 'decision'
  | 'takeaway'
  | 'openQuestion'
  | 'nextStep'
  | 'fallback';

export interface AnswerContext {
  /** 上一条回答的主题 */
  lastTopic?: ReplyTopic;
}

export interface Answer {
  message: AssistantMessage;
  topic: ReplyTopic;
}

/** 组装一条元宝回答 */
function reply(blocks: RichBlock[], extra?: Partial<AssistantMessage>): AssistantMessage {
  return {
    id: createId('ans'),
    role: 'assistant',
    createdAt: Date.now(),
    bubbles: [{ id: createId('bubble'), blocks }],
    ...extra,
  };
}

/** 组装一条元宝主动记下的笔记（会出现在「记笔记」展开面板里） */
function note(blocks: RichBlock[]): AssistantMessage {
  return { ...reply(blocks), id: createId('note'), isNote: true };
}

interface Rule {
  topic: ReplyTopic;
  test: (q: string, ctx: AnswerContext) => boolean;
  /** 传入原问题：倒计时的分钟数、预约到周几都要从问句里取，不能写死 */
  build: (q: string) => AssistantMessage;
}

/**
 * 规则表：顺序即优先级，具体意图放前面，通用意图放后面。
 * 新增规则时优先放在对应大类的最前面，尽量不要改动已有顺序。
 *
 * 邮件追问（正式／表格／精简）不依赖上一轮主题：本场唯一的「文档」就是邮件和群消息草稿，
 * 即使点的是较早消息上的追问建议，也按最合理的理解处理，不会掉进兜底。
 */
const RULES: Rule[] = [
  {
    topic: 'emailFormal',
    test: (q) => /正式|专业|措辞|语气|礼貌|客套/.test(q),
    build: () =>
      reply([
        p('改成正式版：'),
        p(b('主题：'), '视觉改版方向评审｜会议纪要与后续安排'),
        p('各位好：'),
        p(
          '本次评审就视觉改版方向形成以下结论：视觉方案分两版并行探索，线条／卡片版重点验证内容分组与层级，少色大灰版重点验证简洁感与强调色的使用；两版共同要求为整体干净、减少零散颜色点缀，登录页需更亲和、有趣。',
        ),
        p(
          '待办事项与待确认项见正文末尾，主题色是否保留请于下次评审前确认。如需补充，请回复本邮件。',
        ),
      ], { followUps: ['加上待办表格', '精简一点'] }),
  },
  {
    topic: 'emailTodo',
    test: (q) => /表格|清单|附上|附表/.test(q),
    build: () =>
      reply([
        p('邮件里带上待办清单：'),
        p(b('主题：'), '视觉改版方向讨论 · 会议纪要与待办'),
        p('各位好，今天确定视觉方向分两版并行探索，登录页要更亲和、有趣。待办如下：'),
        list(...TODO_ITEMS),
        p('主题色与竖向布局两项尚未确定，下次评审继续。'),
      ], { followUps: ['语气再正式一点', '精简一点'] }),
  },
  {
    topic: 'emailShort',
    test: (q) => /精简|简短|短一点|太长|压缩/.test(q),
    build: () =>
      reply([
        p(b('主题：'), '视觉方向：两版并行'),
        p('各位好：视觉方向分两版并行（线条／卡片版、少色大灰版），登录页要更亲和。待办见列表，主题色下次评审定。'),
      ], { followUps: ['语气再正式一点', '加上待办表格'] }),
  },

  /* ---------- 待办 ---------- */
  {
    topic: 'todoSync',
    test: (q) => /同步|写进|加进|记到|存到|放进/.test(q) && /待办|任务|todo/i.test(q),
    build: () =>
      reply([
        p('已经写进待办列表，并按负责人分好了组：'),
        list(...TODO_ITEMS),
        p('会后可以直接在待办里勾选完成，也可以单独设提醒。'),
      ], { source: '操作 · 已同步到待办', followUps: ['谁的待办最急？', '把待办发到群里'] }),
  },
  {
    topic: 'todoUrgent',
    test: (q) => /最急|最紧|优先|先做|排期/.test(q) && /待办|任务|谁/.test(q),
    build: () =>
      reply([
        p(b('最急的是立昌的两版视觉方向初稿。'), '下次评审要拿它对齐方向，另外两项都排在它之后。'),
        p('按先后顺序：'),
        list(
          [b('立昌'), { text: '：两版初稿，评审前必须出。' }],
          [b('黄婷婷'), { text: '：竞品代表案例，可以和初稿并行。' }],
          [b('全员'), { text: '：主题色确认，评审时一起定。' }],
        ),
      ], { source: '引用 · 本场纪要', followUps: ['帮我同步到待办', '刚才讨论了哪些结论？'] }),
  },

  /* ---------- 群消息 ---------- */
  {
    topic: 'shareToGroup',
    test: (q) => /发到群|群里|群消息|发群里|同步到群/.test(q),
    build: () =>
      reply([
        p(`群消息草稿（发到「${meetingSession.groupName}」会议群）：`),
        p(
          '“今天定了视觉方向分两版并行——线条／卡片版、少色大灰版，登录页要更亲和。待办已经分到人，主题色和竖向布局下次评审继续。”',
        ),
      ], { followUps: ['语气再正式一点', '加上待办表格'] }),
  },

  /* ---------- 参会人 ---------- */
  {
    topic: 'speaker',
    test: (q) => /黄婷婷|立昌|谁说的|哪位|发言|参会人/.test(q),
    build: () =>
      reply([
        p('黄婷婷在会上讲了两件事：'),
        list(
          '展示了会前收集的竞品参考，对比“以面为主”和线性结构两种组织方式。',
          '提出视觉方向先做两版探索，再定最终方向。',
        ),
      ], { source: '引用 · 2分钟前 黄婷婷', followUps: ['竞品是怎么组织的？', '我有哪些待办？'] }),
  },

  /* ---------- 具体议题 ---------- */
  {
    topic: 'login',
    test: (q) => /登录页|登录/.test(q),
    build: () =>
      reply([
        p('登录页只提了一个方向：需要更亲和、有趣，具体做法还没讨论。'),
        p('两版视觉都要覆盖它，出稿时可以各出一版登录页做对照。'),
      ], { source: '引用 · 2分钟前的讨论', followUps: ['那竖向布局怎么改？', '这些能整理成待办吗？'] }),
  },
  {
    topic: 'layout',
    test: (q) => /竖向|布局|排布|结构/.test(q),
    build: () =>
      reply([
        p(b('竖向布局还没定方案。'), '会上只是把它列进了要改善的问题，没有展开讨论做法。'),
        p('目前只确认两点：两版探索都要面对现有线性结构的问题；对比重点是内容分组和层级是否更清晰。'),
      ], { source: '引用 · 本场纪要', followUps: ['竞品是怎么组织的？', '那主题色保留吗？'] }),
  },
  {
    topic: 'competitor',
    test: (q) => /竞品|对比|以面为主|参考案例/.test(q),
    build: () =>
      reply([
        p('会上对比了两种组织方式：'),
        list(
          [b('竞品'), { text: '：偏“以面为主”的布局，内容铺开、靠整体分区承载信息。' }],
          [b('当前产品'), { text: '：更偏线性结构，按顺序往下排。' }],
        ),
        p('结论是这次两版探索都要回答同一个问题：内容分组和层级能不能更清楚。'),
      ], { source: '引用 · 2分钟前 黄婷婷', followUps: ['说得更具体些', '这些能整理成待办吗？'] }),
  },
  {
    topic: 'color',
    test: (q) => /主题色|颜色|配色/.test(q),
    build: () =>
      reply([
        p('主题色是否保留还没定。'),
        p('会上提到可以把刚才展示的高纯度浅色配色作为两版的对照，最终在评审时一起确认。'),
      ], { source: '引用 · 刚刚的讨论', followUps: ['那竖向布局怎么改？', '列出我的待办'] }),
  },

  /* ---------- 通用意图 ---------- */
  /* 快捷指令里的通用问法：决策、收获、未决问题、下一步（放在 summary / todo 之前，避免被宽泛规则截走） */
  {
    topic: 'decision',
    test: (q) => /决策|决定|拍板|定下/.test(q),
    build: () =>
      reply([
        p('本场到目前为止定下了 3 个关键决策：'),
        list(
          [b('视觉方向两版并行'), { text: '：线条／卡片版、少色大灰版同时推进，不提前收敛。' }],
          [b('登录页调性'), { text: '：要更亲和、有趣，两版都按这个方向出稿。' }],
          [b('评审方式'), { text: '：下次把两版放进同一页面切换对比，不单看一版就定。' }],
        ),
      ], { source: '引用 · 本场纪要', followUps: ['还有哪些没定论？', '下一步该做什么？'] }),
  },
  {
    topic: 'takeaway',
    test: (q) => /收获|要点|重点|takeaway/i.test(q),
    build: () =>
      reply([
        p('这场会最值得带走的三点：'),
        list(
          '差异不在配色，而在内容分组与层级——两版要围绕这一点拉开。',
          '竞品偏「以面为主」，当前产品偏线性结构，是改版最大的结构性差距。',
          '纪要载体要按内容形态分流，视频不适合简单嵌入文档。',
        ),
      ], { source: '引用 · 最近 15 分钟的讨论', followUps: ['突出关键决策', '我有哪些待办'] }),
  },
  {
    topic: 'openQuestion',
    test: (q) => /没定论|没定|未决|待定|悬而未决|分歧/.test(q),
    build: () =>
      reply([
        p('还有 2 个问题没有定论：'),
        list(
          [b('主题色是否保留'), { text: '：黄婷婷倾向保留，LisaWang 认为浅色版本对比度不够，需要重新调。' }],
          [b('竖向布局怎么改'), { text: '：暂时留给两版各自发挥，下次评审再收。' }],
        ),
        p('建议在会议结束前指定这两件事的负责人。'),
      ], { source: '引用 · 本场纪要', followUps: ['下一步该做什么？', '约下周三同一时间'] }),
  },
  {
    topic: 'nextStep',
    test: (q) => /下一步|接下来|后续/.test(q),
    build: () =>
      reply([
        p('按今天的讨论，下一步建议按这个顺序推进：'),
        list(
          [b('本周五前'), { text: '：立昌出两版视觉初稿，各含首页与登录页。' }],
          [b('下周一'), { text: '：黄婷婷补齐竞品代表案例，标注可借鉴点。' }],
          [b('下周三'), { text: '：同一页面对比两版，顺带定下主题色。' }],
        ),
      ], { followUps: ['帮我同步到待办', '约下周三同一时间'] }),
  },
  {
    topic: 'detail',
    test: (q) => /具体|展开|详细|多说|举例/.test(q),
    build: () =>
      reply([
        p('补充几处细节：'),
        list(
          '线条粗细和圆角会单独出对照，用来判断哪种更“干净”。',
          '少色大灰版里，强调色只用在关键操作和状态上。',
          '刚才展示的高纯度浅色配色，可作为两版的对照参考。',
        ),
      ], { source: '引用 · 2分钟前的讨论', followUps: ['那竖向布局怎么改？', '这些能整理成待办吗？'] }),
  },
  {
    topic: 'email',
    test: (q) => /邮件|发给|会后通知/.test(q),
    build: () =>
      reply([
        p('会后邮件草稿：'),
        p(b('主题：'), '视觉改版方向讨论 · 会议纪要'),
        p(
          '各位好，今天确定视觉方向分两版并行探索（线条／卡片版、少色大灰版），登录页要更亲和、有趣。待办见附表，主题色是否保留下次评审确认。',
        ),
      ], { followUps: ['语气再正式一点', '加上待办表格'] }),
  },
  {
    topic: 'summary',
    test: (q) => /总结|结论|讨论了|错过|补一下|回顾|纪要/.test(q),
    build: () =>
      reply([
        p('到目前为止主要聊了三件事：'),
        list(
          '竞品偏“以面为主”的布局，当前产品更偏线性结构，会上做了对照。',
          '视觉方向暂定两版并行：线条／卡片版、少色大灰版。',
          '登录页需要更亲和、有趣。',
        ),
        p(b('还没定：'), '是否保留现有主题色、竖向布局怎么改。'),
      ], { source: '引用 · 最近 10 分钟的讨论', followUps: ['说得更具体些', '列出我的待办'] }),
  },
  {
    topic: 'todo',
    test: (q) => /待办|任务|todo|要做/i.test(q),
    build: () =>
      reply([p('目前记下 3 项待办：'), list(...TODO_ITEMS)], {
        source: '引用 · 本场纪要',
        followUps: ['帮我同步到待办', '谁的待办最急？'],
      }),
  },
  {
    topic: 'noted',
    test: (q) => /记下|笔记|截图|记录/.test(q),
    build: () =>
      reply([
        p('本场已经记下两段实时纪要和一条阶段小结，都收在底部「元宝正在记笔记」里。'),
        p('暂停后不再产生新笔记，已经记下的内容不会丢。'),
      ], { followUps: ['刚才讨论了哪些结论？', '我有哪些待办？'] }),
  },

  /* ---------- 会后安排 / 会中任务（主动场景与「创建任务」都落在这里） ---------- */
  {
    topic: 'timerCancel',
    test: (q) => /(取消|关掉|停掉|不用了).*(倒计时|计时|定时)/.test(q),
    build: () =>
      reply([p('已取消刚才那个倒计时。'), p('需要的话再说一声，我随时重开一个。')], {
        followUps: ['再建一个 5 分钟', '我有哪些待办'],
      }),
  },
  {
    topic: 'timer',
    test: (q) => /倒计时|计时器|定时|提醒我|\d+\s*分钟/.test(q),
    build: (q) => {
      const minutes = /(\d+)\s*分钟/.exec(q)?.[1] ?? '10';
      const isChange = /改|换成|重新/.test(q);
      return reply(
        [
          p(`${isChange ? '已改成' : '已创建'}：${minutes} 分钟倒计时。`),
          p('到点我会在侧栏提醒你，中途也可以随时让我取消。'),
        ],
        { followUps: ['改成 5 分钟', '取消倒计时'] },
      );
    },
  },
  {
    topic: 'meetingSchedule',
    test: (q) => /预约|下一次会|下次会|改到|下(周|星期)|每周/.test(q),
    build: (q) => {
      if (/每周|重复/.test(q)) {
        return reply([p('已改成每周重复：同一时间自动建会，直到你取消。'), p('本场参会人会默认带上。')], {
          followUps: ['发封邮件通知大家', '我有哪些待办'],
        });
      }
      const day = /(?:周|星期)([一二三四五六日天])/.exec(q)?.[1] ?? '三';
      return reply(
        [
          p(`已按本场的参会人和时长发起预约：下周${day === '天' ? '日' : day} 15:00–16:00。`),
          p('确认后我会把邀请发给全部 8 位参会人。'),
        ],
        { followUps: ['改成每周重复', '发封邮件通知大家'] },
      );
    },
  },

  {
    topic: 'poll',
    test: (q) => /投票|选项|多选|单选|发出去|就这样发|发起/.test(q),
    build: (q) => {
      if (/发出去|就这样发|发起/.test(q)) {
        return reply([p('投票已发到会议里，8 位参会人都能看到，结果我会实时更新。')], {
          followUps: ['改成多选', '加一个选项'],
        });
      }
      if (/多选/.test(q)) {
        return reply([p('已改成多选：同一个人可以投多个选项。'), p('其余设置不变。')], {
          followUps: ['发出去', '加一个选项'],
        });
      }
      if (/加一个选项|加选项|添加选项/.test(q)) {
        return reply([p('已加上第 5 个选项：桌游。'), p('现在是 5 选 1。')], {
          followUps: ['改成多选', '发出去'],
        });
      }
      return reply(
        [
          p('已经生成投票草稿，确认后就能发到会议里：'),
          p(b('主题：'), '团建去哪玩？'),
          p('单选 · 匿名 · 4 个选项：环球影城、密室逃脱、城郊露营、剧本杀。'),
        ],
        { followUps: ['改成多选', '加一个选项'] },
      );
    },
  },

  /* ---------- 兜底 ---------- */
  {
    topic: 'fallback',
    test: (q, ctx) => ctx.lastTopic === 'fallback' && q.length > 0,
    build: () =>
      reply([
        p('还是没有对应的讨论。换个问法试试，比如直接问「主题色定了吗」「竖向布局怎么办」。'),
        p('我只跟到本场会议，会后的事帮不上忙。'),
      ], { followUps: ['主题色定了吗？', '竖向布局怎么办？'] }),
  },
  {
    topic: 'fallback',
    test: () => true,
    build: () =>
      reply([
        p('这个问题在本场讨论里没有直接答案。'),
        p('不过我可以先讲清楚已经记下的内容：结论、待办、某位参会人的发言，或者两版视觉各自的要求。'),
      ], { followUps: ['刚才讨论了哪些结论？', '我有哪些待办？', '黄婷婷说了什么？'] }),
  },
];

/**
 * 根据问题返回 mock 回答
 * 只做规则匹配 + 上一轮主题，目的是让演示时每个问题都有像样的回应。
 */
export function answerQuestion(question: string, ctx: AnswerContext = {}): Answer {
  const q = question.trim();
  const rule = RULES.find((item) => item.test(q, ctx)) ?? RULES[RULES.length - 1];
  return { message: rule.build(q), topic: rule.topic };
}

/** 「立即总结」生成的阶段小结 */
export function buildStageSummary(): AssistantMessage {
  return note([
    p('截至目前（01:31）的阶段小结：'),
    list(
      '视觉方向分两版并行探索：线条／卡片版、少色大灰版。',
      '共同要求：整体干净、少用零散颜色点缀，登录页更亲和。',
      '待定：是否保留现有主题色、竖向布局如何改善。',
    ),
  ]);
}

/**
 * 暂停 / 继续记笔记时的对话反馈
 * 之前用 Toast 提示，现在统一改成一条对话消息：用户只在一个地方看反馈，也能回溯操作。
 * 不算会议记录内容，所以不带 isNote，不会出现在「记笔记」展开面板里。
 */
export function buildRecordingStateNote(listening: boolean): AssistantMessage {
  return {
    id: createId('note-state'),
    role: 'assistant',
    createdAt: Date.now(),
    bubbles: [
      {
        id: createId('note-state-bubble'),
        blocks: [p(listening ? '元宝继续记录会议内容。' : '元宝已暂停记笔记，需要时再叫我继续。')],
      },
    ],
  };
}

/**
 * 「保存截图」后的确认消息
 * 文案只说结果，图直接把当前演讲者画面缩小放进来，看起来就像这一帧真的存进了纪要。
 */
export function buildScreenshotNote(): AssistantMessage {
  return {
    id: createId('note'),
    role: 'assistant',
    createdAt: Date.now(),
    // 归入笔记：展开「元宝正在记笔记」时也能看到这次截图
    isNote: true,
    bubbles: [
      {
        id: createId('shot-bubble'),
        blocks: [p('元宝已记录当前会议画面')],
        // 176×90 对齐左侧演讲者画面的可见比例（1002×512），小图里不会多出被裁掉的部分
        image: { src: videoSpeaker, alt: '当前会议画面', width: 176, height: 90 },
      },
    ],
  };
}
