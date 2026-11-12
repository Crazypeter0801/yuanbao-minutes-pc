import { extractCard, summaryModeCard, taskConfirmCard } from '@/data/interactiveCards';
import { parseMarkedText } from '@/data/richText';
import { createId } from '@/data/yuanbaoContent';
import type { AssistantMessage, RichBlock } from '@/types/chat';

/**
 * 主动触发场景（演示用）
 * 元宝不该只在被问时才说话。一期做了用户主观打五星的 9 个主动服务场景：
 *   会中：1 迟到/中途加入摘要 · 2 上下文主动检索 · 3 议题跑偏提醒 · 4 时间管理 ·
 *         5 问题悬而未决 · 6 主动总结阶段性讨论 · 7 专业信息补充（默认折叠，已并入智能问答）
 *   跨会议：8 决策记忆 · 9 个人工作流
 * 按设计师要求，在清单外加了两条代表性主动 offer，体现元宝有眼睛、有耳朵：
 * 看见共享屏幕上的英文，就问要不要开屏幕翻译；听见先前问过的概念，就问要不要结合当下再讲。
 * 这两条都是先问要不要，用户点了追问再给结果，和「专业信息补充」一上来倒全文不同。
 * 已定方向保留：实时翻译、OCR 识别。原 demo 自带的会议将结束约下次、建个投票、选总结方式、
 * 提取内容、创建任务也保留。另有几条挂在追问建议后面的「承接场景」（internal），点了追问不会没有回应。
 * 来源：钉钉听记 11-10「元宝入会融合方案与10个主动场景规划」，以及用户给出的五星场景清单。
 */

/** 纯文本段落（支持 **加粗** 与 [[人名]] 标记） */
const paragraph = (...texts: string[]): RichBlock => ({
  type: 'paragraph',
  runs: texts.flatMap((text) => parseMarkedText(text)),
});

/** 无序列表 */
const list = (...items: string[]): RichBlock => ({
  type: 'list',
  items: items.map((item) => parseMarkedText(item)),
});

interface ScenarioBase {
  id: string;
  /** 场景名，也是输入框里最直接的触发词 */
  label: string;
  /** 场景说明：这次触发对应什么时机 */
  hint: string;
  /** 输入框里包含任一词即命中本场景（导入 Figma 的版本没有演示条，只能靠打字触发） */
  keywords: string[];
  /** 所属阶段，仅用于说明 */
  phase: '会中' | '跨会议' | '原有';
  /** 承接场景：挂在追问建议后面，不单独列入菜单 */
  internal?: boolean;
}

/**
 * 两类触发方式：
 * - nudge：元宝主动开口，直接把一条消息推进消息流；
 * - ask：模拟用户自己发一句话，走正常问答流程（先出现用户气泡，再出回答）。
 */
export type ProactiveScenario =
  | (ScenarioBase & {
      kind: 'nudge';
      /** 追问建议触发的承接场景：先出用户气泡，元宝想一下再回 */
      asReply?: boolean;
      /** 每次点击都要生成新消息，id 重新取，否则重复触发时 React key 会撞；可连发多条 */
      build: () => AssistantMessage | AssistantMessage[];
    })
  | (ScenarioBase & {
      kind: 'ask';
      userText: string;
      /** 这类任务除了对话还会弹出对应的操作界面 */
      opens?: 'poll';
    });

/**
 * 开始记录：打开侧栏时默认就有的第一条消息（开启了云笔记），不需要手动触发
 * 「我已经开始记录啦～」+ 下方「正在帮你记」卡片
 */
export function buildRecordingStartMessage(): AssistantMessage {
  return {
    id: createId('recording-start'),
    role: 'assistant',
    createdAt: Date.now(),
    bubbles: [
      {
        id: createId('recording-start-bubble'),
        blocks: [paragraph('我已经开始记录啦～ 你专心开会就好。')],
      },
    ],
    recordingCard: true,
  };
}

export const proactiveScenarios: ProactiveScenario[] = [
  /* ================= 承接场景（追问建议点开后的回应，internal） ================= */
  {
    id: 'follow-open-interpreter',
    kind: 'nudge',
    asReply: true,
    internal: true,
    phase: '会中',
    label: '开启 AI 同传',
    hint: '承接「实时翻译」的追问：用户点了开启，元宝确认已开启',
    keywords: ['开启 AI 同传', '开启AI同传', '开同传'],
    build: () => ({
      id: createId('follow-interpreter'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('follow-interpreter-bubble'),
          blocks: [
            paragraph('已开启 **AI 同传**。[[KanyeWest]] 的英文发言会实时翻成中文字幕，显示在会议画面下方，只有你能看到。'),
          ],
        },
      ],
      source: '操作 · 已开启同传字幕',
      followUps: ['帮我快速回顾'],
    }),
  },
  {
    id: 'follow-decline',
    kind: 'nudge',
    asReply: true,
    internal: true,
    phase: '会中',
    label: '先不用',
    hint: '承接主动提示的「先不用」：元宝收到，不再打扰',
    keywords: ['先不用'],
    build: () => ({
      id: createId('follow-decline'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('follow-decline-bubble'),
          blocks: [paragraph('好的，这件事我先不打扰你。需要时随时叫我。')],
        },
      ],
    }),
  },
  {
    id: 'follow-save-ocr',
    kind: 'nudge',
    asReply: true,
    internal: true,
    phase: '会中',
    label: '保存到会议文件',
    hint: '承接「OCR 识别」的追问：把识别出的文字存进会议文件',
    keywords: ['保存到会议文件', '存到会议文件'],
    build: () => ({
      id: createId('follow-save-ocr'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('follow-save-ocr-bubble'),
          blocks: [paragraph('已把排期表的文字存进会议文件，文字可以直接复制，会后在「元宝笔记」里也能找到。')],
        },
      ],
      source: '操作 · 已保存到会议文件',
      followUps: ['我有哪些待办？'],
    }),
  },
  {
    id: 'follow-screen-translate',
    kind: 'nudge',
    asReply: true,
    internal: true,
    phase: '会中',
    label: '开启屏幕翻译',
    hint: '承接「屏幕翻译」的追问：用户点了开启，元宝确认已把画面英文叠成中文',
    keywords: ['开启屏幕翻译'],
    build: () => ({
      id: createId('follow-screen-translate'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('follow-screen-translate-bubble'),
          blocks: [
            paragraph('已开启 **屏幕翻译**。画面上的英文会实时叠中文译文，只有你能看到。不需要了跟我说一声就行。'),
          ],
        },
      ],
      source: '操作 · 已开启屏幕翻译',
    }),
  },
  {
    id: 'follow-explain-in-context',
    kind: 'nudge',
    asReply: true,
    internal: true,
    phase: '会中',
    label: '结合现在讲讲',
    hint: '承接「结合当下解释」的追问：结合本场登录页讨论，讲渐进式披露具体指什么',
    keywords: ['结合现在讲讲'],
    build: () => ({
      id: createId('follow-explain-in-context'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('follow-explain-in-context-bubble'),
          blocks: [
            paragraph(
              '结合刚才的讨论：**渐进式披露**在登录页里，就是先只露出手机号和主按钮，验证码、第三方登录这些次要入口先收着，用户点到再展开。这跟[[立昌]]说的「先保证主路径干净」是一回事；[[黄婷婷]]担心的信息密度，也可以用这个办法：默认给摘要，细节按需展开，而不要把所有字段一次性铺开。',
            ),
          ],
        },
      ],
      source: '结合 · 本场讨论和你上周的提问',
    }),
  },

  /* ================= 会中（用户主观五星清单 1～7） ================= */
  {
    // 1 迟到 / 中途加入摘要（原「刚入会」改写）
    id: 'late-join',
    kind: 'nudge',
    phase: '会中',
    label: '迟到/中途加入摘要',
    hint: '会中 · 迟到/中途加入摘要：入会后元宝直接告诉你错过了什么、现在讨论到哪',
    keywords: ['刚入会', '中途入会', '迟到', '错过了什么', '入会'],
    build: () => ({
      id: createId('nudge-join'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-join-bubble'),
          blocks: [
            paragraph('你晚到了 **12 分钟**，先帮你补一下：'),
            list(
              '你错过了：第 1 项「两版视觉探索」已经聊完，结论是线条／卡片版和少色大灰版并行。',
              '现在讨论到：第 2 项「是否保留现有主题色」，[[黄婷婷]] 正在发言。',
            ),
          ],
        },
      ],
      source: '引用 · 前 12 分钟的讨论',
      // 两条快捷提问都要能落到问答规则表里，不能出现点了没回应
      followUps: ['帮我快速回顾', '我有哪些待办'],
    }),
  },
  {
    // 2 上下文主动检索（原「别人提到」改写；附原文和文档）
    id: 'context-retrieval',
    kind: 'nudge',
    phase: '会中',
    label: '上下文主动检索',
    hint: '会中 · 上下文主动检索：聊到「白名单规则」，元宝自动找出上次评审结论并附原文和文档',
    keywords: ['上下文检索', '上下文主动检索', '白名单', '别人提到', '有人提到', '提到我', '提到'],
    build: () => ({
      id: createId('nudge-mention'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-mention-bubble'),
          blocks: [
            paragraph('你们正在聊「**白名单规则**」，上次评审（11 月 3 日）已经有结论：'),
            list(
              '白名单先只对企业版管理员开放，个人版本期不做。',
              '名单每次变更都要留操作记录，保留 90 天。',
            ),
            paragraph('原文：「白名单先只对企业版管理员开放，个人版这期不做，等数据出来再评估。」—— [[黄婷婷]]'),
          ],
        },
      ],
      artifact: {
        id: 'artifact-whitelist-review',
        name: '白名单规则评审纪要（11-03）',
        type: 'DOCX',
        size: '312KB',
        icon: 'word',
        group: 'source',
      },
      source: '引用 · 11 月 3 日「视觉改版方向评审」纪要',
      followUps: ['说得更具体些', '我有哪些待办'],
    }),
  },
  {
    // 3 议题跑偏提醒
    id: 'off-topic',
    kind: 'nudge',
    phase: '会中',
    label: '议题跑偏提醒',
    hint: '会中 · 议题跑偏提醒：偏离议程较久，元宝轻提示主持人（仅主持人可见）',
    keywords: ['议题跑偏', '跑偏', '偏离议程', '偏题'],
    build: () => ({
      id: createId('nudge-offtopic'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-offtopic-bubble'),
          blocks: [
            paragraph('主持人 [[JonyZhang]]，提醒一下：最近 **10 分钟**大家在聊「官网首页的 banner 文案」，已经偏离本场议程。'),
            list('议程里还没开始的：登录页方案怎么定、下次评审的安排。'),
            paragraph('这条提示只有你能看到。'),
          ],
        },
      ],
      source: '对照 · 会议议程',
      followUps: ['先不用', '记到笔记里'],
    }),
  },
  {
    // 4 时间管理（原「超时提醒」改写）
    id: 'time-management',
    kind: 'nudge',
    phase: '会中',
    label: '时间管理',
    hint: '会中 · 时间管理：距离会议结束还剩 10 分钟，但还有两个议题未讨论',
    keywords: ['时间管理', '超时', '时间提醒', '时间快到'],
    build: () => ({
      id: createId('nudge-overtime'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-overtime-bubble'),
          blocks: [
            paragraph('距离会议结束还有 **10 分钟**，但还有 **2 个议题**未讨论：'),
            list('登录页方案怎么定', '下次评审的安排和准备材料'),
          ],
        },
      ],
      followUps: ['约下周三同一时间', '写一封会后邮件'],
    }),
  },
  {
    // 5 问题悬而未决
    id: 'unresolved',
    kind: 'nudge',
    phase: '会中',
    label: '问题悬而未决',
    hint: '会中 · 问题悬而未决：同一问题讨论 8 分钟仍有 A/B 两种观点，元宝问是否需要做决策',
    keywords: ['悬而未决', '久议不决', '讨论太久', '两种观点', '需要决策吗'],
    build: () => ({
      id: createId('nudge-unresolved'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-unresolved-bubble'),
          blocks: [
            paragraph('「是否保留手机号验证码登录」这个问题已经讨论 **8 分钟**，目前有 A／B 两种观点，需要做决策吗？'),
            list(
              'A：[[黄婷婷]] 主张保留，老用户习惯这个入口，改动会增加客服咨询。',
              'B：[[立昌]] 倾向改成扫码登录，步骤更少，也更安全。',
            ),
          ],
        },
      ],
      source: '引用 · 最近 8 分钟的讨论',
      followUps: ['还有哪些没定论？', '突出关键决策'],
    }),
  },
  {
    // 6 主动总结阶段性讨论
    id: 'stage-summary',
    kind: 'nudge',
    phase: '会中',
    label: '主动总结阶段性讨论',
    hint: '会中 · 阶段性总结：一个议题结束后，元宝自动给出「结论 / 分歧 / 下一步」',
    keywords: ['阶段总结', '阶段性总结', '议题结束', '议题小结'],
    build: () => ({
      id: createId('nudge-stage'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-stage-bubble'),
          blocks: [
            paragraph('「竖向布局如何提升信息密度」这个议题聊完了，阶段小结如下：'),
            list(
              '**结论**：卡片间距收紧一档，列表项改成单行摘要。',
              '**分歧**：[[黄婷婷]] 担心太密影响阅读，[[立昌]] 认为可以靠分组层级弥补。',
              '**下一步**：[[立昌]] 本周内出两版对比稿，下次评审一起看。',
            ),
          ],
        },
      ],
      source: '引用 · 议题讨论 18 分钟',
      followUps: ['下一步该做什么？', '我有哪些待办'],
    }),
  },
  {
    // 7 专业信息补充（并入原「智能问答」；默认折叠）
    id: 'pro-info',
    kind: 'nudge',
    phase: '会中',
    label: '专业信息补充',
    hint: '会中 · 专业信息补充（含智能问答）：出现术语/数据/竞品时自动检索，默认折叠，点击展开',
    keywords: ['专业信息', '信息补充', '智能问答', '术语解释', '什么意思', '听不懂', '竞品数据'],
    build: () => ({
      id: createId('nudge-proinfo'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-proinfo-bubble'),
          blocks: [],
          fold: {
            title: '元宝补了 3 条背景信息',
            hint: '术语 · 数据 · 竞品',
            blocks: [
              paragraph('**术语**：[[KanyeWest]] 提到的「灰度发布」，指新版本先给一小部分用户试用，没问题再逐步放给所有人。'),
              paragraph('**数据**：本次灰度范围是 5% 的用户，约 8 万人，来自上周的活跃用户数据。'),
              paragraph('**竞品**：飞书会议把 AI 要点放在侧边栏，信息密度更高；腾讯会议目前放在会议详情页里。'),
            ],
          },
        },
      ],
      source: '联网搜索 · 结合本场纪要',
    }),
  },

  /* ================= 会中（已定：实时翻译、OCR 识别） ================= */
  {
    id: 'live-translate',
    kind: 'nudge',
    phase: '会中',
    label: '实时翻译',
    hint: '会中 · 实时翻译（已定）：检测到发言人在说英语，元宝主动问要不要开 AI 同传',
    keywords: ['实时翻译', '英文发言', '英语'],
    build: () => ({
      id: createId('nudge-translate'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-translate-bubble'),
          blocks: [
            paragraph('[[KanyeWest]] 现在在用英语发言。要不要开启 **AI 同传**，把英文实时翻成中文字幕？'),
          ],
        },
      ],
      followUps: ['开启 AI 同传', '先不用'],
    }),
  },
  {
    id: 'screen-translate',
    kind: 'nudge',
    phase: '会中',
    label: '屏幕翻译',
    hint: '会中 · 眼：元宝看见共享屏幕上的英文材料，主动问要不要开屏幕翻译，先不倒译文',
    keywords: ['屏幕翻译', '屏幕有英文', '英文材料'],
    build: () => ({
      id: createId('nudge-screen-translate'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-screen-translate-bubble'),
          blocks: [
            paragraph('共享屏幕上是一份英文材料。要不要我打开 **屏幕翻译**，把画面里的英文叠成中文？只有你能看到。'),
          ],
        },
      ],
      source: '识别 · 共享屏幕',
      followUps: ['开启屏幕翻译', '先不用'],
    }),
  },
  {
    id: 'explain-in-context',
    kind: 'nudge',
    phase: '会中',
    label: '结合当下解释',
    hint: '会中 · 耳：用户上周问过「渐进式披露」；刚才黄婷婷讨论登录页时又提到这个词。元宝靠听和记忆主动问要不要结合当下再讲，不给词典定义',
    keywords: ['结合当下解释', '先前问过的概念', '渐进式披露'],
    build: () => ({
      id: createId('nudge-explain-in-context'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-explain-in-context-bubble'),
          blocks: [
            paragraph(
              '刚才[[黄婷婷]]提到了「**渐进式披露**」。这是你上周问过我的。要不要我结合现在讨论的登录页，再给你讲讲它在这个方案里具体指什么？',
            ),
          ],
        },
      ],
      source: '回忆 · 你上周问过',
      followUps: ['结合现在讲讲', '先不用'],
    }),
  },
  {
    id: 'ocr',
    kind: 'nudge',
    phase: '会中',
    label: 'OCR 识别',
    hint: '会中 · OCR 识别（已定）：有人共享屏幕，元宝把画面里的文字提取出来',
    keywords: ['OCR', '识别文字', '提取文字', '屏幕文字', '识别画面', '共享画面'],
    build: () => ({
      id: createId('nudge-ocr'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-ocr-bubble'),
          blocks: [
            paragraph('[[立昌]] 正在共享屏幕，画面里有一张排期表，我把文字提取出来了：'),
            list(
              '11 月 18 日：两版视觉初稿评审',
              '11 月 22 日：登录页方案定稿',
              '11 月 29 日：设计走查，提交开发',
            ),
          ],
        },
      ],
      source: '识别 · 共享屏幕 刚刚',
      followUps: ['保存到会议文件', '发到群里'],
    }),
  },

  /* ================= 跨会议（用户主观五星清单 8～9） ================= */
  {
    // 8 决策记忆
    id: 'decision-memory',
    kind: 'nudge',
    phase: '跨会议',
    label: '决策记忆',
    hint: '跨会议 · 决策记忆：新讨论触及旧决策，元宝自动带出当时为什么这么定',
    keywords: ['决策记忆', '旧决策', '之前定过', '当初为什么', '为什么这么定'],
    build: () => ({
      id: createId('nudge-decision-memory'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-decision-memory-bubble'),
          blocks: [
            paragraph('你们现在聊的「是否更换主题色」，之前评审已经定过：**先保留现有主题色，只在强调场景引入新色**（11 月 3 日）。'),
            paragraph('当时这么定的原因：'),
            list(
              '老用户对现有主色的识别度高，整体换色会引来大量反馈。',
              '少色大灰版还没有对比验证，数据不足以支撑更换。',
            ),
          ],
        },
      ],
      source: '引用 · 11 月 3 日「视觉改版方向评审」的决策记录',
      followUps: ['说得更具体些', '主题色定了吗？'],
    }),
  },
  {
    // 9 个人工作流
    id: 'personal-workflow',
    kind: 'nudge',
    phase: '跨会议',
    label: '个人工作流',
    hint: '跨会议 · 个人工作流：今天 5 场会议里，元宝整理出 7 个与你有关的事项',
    keywords: ['个人工作流', '今日事项', '与我有关', '我今天的会', '今天开了几场会'],
    build: () => ({
      id: createId('nudge-workflow'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-workflow-bubble'),
          blocks: [
            paragraph('今天你参加了 **5 场会议**，我帮你整理出了 **7 个与你有关的事项**：'),
            list(
              '视觉改版方向评审：出两版视觉方向初稿。',
              '视觉改版方向评审：下次评审前确认是否保留主题色。',
              '登录页方案沟通：把验证码登录的改动评估发给 [[黄婷婷]]。',
              '周会：更新本周排期表。',
              '周会：周五前提交走查清单。',
              '竞品分析同步：补充飞书、钉钉的 AI 视图截图。',
              '用户反馈复盘：整理 3 条高频问题。',
            ),
          ],
        },
      ],
      source: '汇总 · 今天的 5 场会议',
      followUps: ['帮我同步到待办', '把待办发到群里'],
    }),
  },

  /* ================= 原有场景（原 demo 自带，保留） ================= */
  {
    id: 'wrapping-up',
    kind: 'nudge',
    phase: '原有',
    label: '会议将结束',
    hint: '原有 · 会议收尾：元宝主动问要不要按原班人再约一次',
    keywords: ['会议将结束', '快结束', '要结束', '将结束', '结束'],
    build: () => ({
      id: createId('nudge-wrap'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-wrap-bubble'),
          blocks: [paragraph('这场快结束了。要不要我按同样的参会人和时长，帮你预约下一次会议？')],
        },
      ],
      // 两条快捷提问都能落到预约 / 邮件规则上，点了不会答非所问
      followUps: ['约下周三同一时间', '改成每周重复'],
    }),
  },
  {
    id: 'create-poll',
    kind: 'ask',
    phase: '原有',
    label: '建个投票',
    hint: '原有 · 交互功能：模拟用户主动发任务「帮我创建一个投票，团建去哪玩」，元宝回话的同时弹出投票确认',
    keywords: ['建个投票', '创建投票', '发起投票', '投票'],
    userText: '帮我创建一个投票，团建去哪玩',
    opens: 'poll',
  },
  {
    id: 'summary-mode',
    kind: 'nudge',
    phase: '原有',
    label: '选个总结方式',
    hint: '弹单选卡片：简洁摘要 / 按议题组织 / 行动项优先，选完元宝按所选结构写纪要',
    keywords: ['总结方式', '选个总结方式', '怎么总结'],
    build: () => ({
      id: createId('nudge-summary-mode'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-summary-mode-bubble'),
          blocks: [paragraph('这次纪要想要哪种结构？选一个，我就按这个结构来写。')],
          card: summaryModeCard,
        },
      ],
    }),
  },
  {
    id: 'extract-content',
    kind: 'nudge',
    phase: '原有',
    label: '提取内容',
    hint: '弹多选卡片：关键结论 / 待办 / 分歧 / 观点，选完元宝出一份清单',
    keywords: ['提取内容', '提取哪些', '提取哪几项'],
    build: () => ({
      id: createId('nudge-extract'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-extract-bubble'),
          blocks: [paragraph('要我从这场会里提取哪些内容？多选，选完我一次整理。')],
          card: extractCard,
        },
      ],
    }),
  },
  {
    id: 'create-task',
    kind: 'nudge',
    phase: '原有',
    label: '创建任务',
    hint: '弹确认卡片：核对任务名、输出方式、交付时间后开始处理',
    keywords: ['创建任务', '建个任务', '会后任务', '创建会后任务'],
    build: () => ({
      id: createId('nudge-create-task'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-create-task-bubble'),
          blocks: [paragraph('先把任务配置摊开，你确认后我就开始处理。')],
          card: taskConfirmCard,
        },
      ],
    }),
  },
];

/**
 * 按输入框内容匹配演示场景
 * 导入 Figma 的版本没有场景切换条，演示时直接打「刚入会」「建个投票」这类词即可命中；
 * 命中不了就当作普通提问，不影响正常问答。
 */
export function matchScenario(text: string): ProactiveScenario | undefined {
  const input = text.trim();
  if (!input) {
    return undefined;
  }
  // 忽略大小写：「ocr」「OCR」「AI 同传」「ai 同传」都算命中
  const lowered = input.toLowerCase();
  return proactiveScenarios.find((scenario) =>
    scenario.keywords.some((keyword) => lowered.includes(keyword.toLowerCase())),
  );
}
