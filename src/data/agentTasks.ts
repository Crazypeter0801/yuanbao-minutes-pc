/**
 * 元宝任务状态（Figma 197:42「Agent 任务状态方案」+ 214:10684 视觉）
 *
 * 头像（雪碧图）、头像旁的状态文字、输入框上方的任务条 / 任务列表、长程任务详情都从同一份任务数据推出来：
 * - 有待确认的任务 → 待确认；有进行中的任务 → 工作中；刚全部完成 → 已完成；
 * - 暂停记笔记 → 休眠；其余 → 空闲。元宝第一次出现时先打一次招呼。
 */

/**
 * 头像状态：每个状态对应一组雪碧图动画（见 YuanbaoAvatar）
 * - 由任务 / 会话推出来的「常驻」状态：idle / working / scanning / thinking / confirm / done / sleep；
 * - 一次性的「反应」：greeting / cheer / eat / touch / wink，播完回到常驻状态。
 */
export type YuanbaoMood =
  | 'greeting'
  | 'idle'
  | 'working'
  | 'scanning'
  | 'thinking'
  | 'confirm'
  | 'done'
  | 'cheer'
  | 'sleep'
  | 'eat'
  | 'touch'
  | 'wink';

/** 一次性动画：播完一遍就回到常驻状态 */
export const ONCE_MOODS: ReadonlySet<YuanbaoMood> = new Set<YuanbaoMood>([
  'greeting',
  'cheer',
  'eat',
  'touch',
  'wink',
]);

/** 空闲多久没有任何操作，元宝打瞌睡（有操作再醒来） */
export const IDLE_SLEEP_DELAY = 30_000;
/** 空闲时偶尔眨一下眼：下一次眨眼距上一次动画结束的间隔 = 下限 + 随机 [0, 浮动) */
export const IDLE_WINK_MIN_DELAY = 9_000;
export const IDLE_WINK_JITTER = 6_000;
/** 演示面板里强制触发的循环动画（工作中 / 待确认等）停留多久再回到真实状态 */
export const MOOD_PREVIEW_HOLD = 6_000;

/**
 * 任务类型：决定「工作中」时头像用哪一套动画
 * - minutes 会议纪要（记笔记）/ pdf PDF 报告：对着电脑敲键盘；
 * - markup 共享画面批注 / 识别：一口口吞下画面内容。
 */
export type AgentTaskKind = 'minutes' | 'pdf' | 'markup' | 'board';

/** 任务状态：进行中 / 排队中 / 待确认 / 已完成 / 已停止 */
export type AgentTaskStatus = 'running' | 'queued' | 'confirm' | 'done' | 'stopped';

/** 长程任务的单个步骤（Figma 199:278 步骤行） */
export interface AgentTaskStep {
  title: string;
  desc: string;
  status: 'done' | 'running' | 'pending';
  /** 右侧时间：已完成为用时，进行中为「进行中」，待开始为预计用时或「—」 */
  time: string;
}

export interface AgentTask {
  id: string;
  kind: AgentTaskKind;
  title: string;
  /** 列表里的一行说明 */
  desc: string;
  status: AgentTaskStatus;
  /** 0–100，只有进行中的任务显示进度条 */
  progress?: number;
  /** 头像旁的动作文案，如「正在生成会议纪要…」 */
  activity: string;
  /** 详情页标题下的一行说明 */
  meta?: string;
  /** 有步骤的才是长程任务，可以点进详情 */
  steps?: AgentTaskStep[];
}

/** 头像旁的状态文字（Figma 197:43 标注 2：无任务显示「待命」，有任务换成动作文案） */
const MOOD_TEXT: Record<YuanbaoMood, string> = {
  greeting: '你好，我是元宝',
  idle: '待命',
  working: '工作中…',
  scanning: '正在识别画面…',
  thinking: '正在思考…',
  confirm: '等你确认',
  done: '任务已完成',
  cheer: '太棒啦！',
  sleep: '休息中',
  eat: '收到新内容',
  touch: '嘿嘿，被摸头啦',
  wink: '我在呢',
};

/** 工作中按任务类型换动画：没列出的类型用「对着电脑工作」 */
const WORKING_MOOD_BY_KIND: Record<AgentTaskKind, YuanbaoMood> = {
  minutes: 'working',
  pdf: 'working',
  markup: 'scanning',
  board: 'working',
};

/** 画彩虹原理：上面 activity、下面任务名分开写 */
export const WHITEBOARD_TASK_ID = 'task-whiteboard-rainbow';
export const WHITEBOARD_ACTIVITY = '正在控制画板...';
export const WHITEBOARD_TASK_TITLE = '画彩虹原理';
export const WHITEBOARD_TASK_DONE_TITLE = '彩虹原理已画好';

export function whiteboardBoardTask(status: 'running' | 'done'): AgentTask {
  const done = status === 'done';
  return {
    id: WHITEBOARD_TASK_ID,
    kind: 'board',
    title: done ? WHITEBOARD_TASK_DONE_TITLE : WHITEBOARD_TASK_TITLE,
    desc: done ? '已画好' : '正在白板上画',
    status,
    progress: done ? 100 : undefined,
    activity: WHITEBOARD_ACTIVITY,
  };
}

/** 还没收尾的任务（进行中 / 排队中 / 待确认）：任务条上的「N 个任务进行中」数的就是它们 */
export const isActiveTask = (task: AgentTask) =>
  task.status === 'running' || task.status === 'queued' || task.status === 'confirm';

interface MoodInput {
  /** 打招呼动画是否已播完（只在元宝第一次出现时播） */
  greeted: boolean;
  tasks: AgentTask[];
  /** 刚刚全部完成，正在庆祝 */
  celebrating: boolean;
  /** 是否在记笔记；暂停时元宝休眠 */
  listening: boolean;
  /** 正在回答用户的提问 */
  thinking: boolean;
}

/**
 * 由任务推出头像状态：待确认 > 工作中（按第一个进行中任务的类型换动画）> 思考 > 刚完成。
 * 「空闲太久打瞌睡」「新内容 / 摸头」这些随时间和操作变化的反应不在这里，见 useYuanbaoMood。
 */
export function resolveMood({ greeted, tasks, celebrating, listening, thinking }: MoodInput): YuanbaoMood {
  if (!greeted) {
    return 'greeting';
  }
  if (tasks.some((task) => task.status === 'confirm')) {
    return 'confirm';
  }
  const running = tasks.find((task) => task.status === 'running');
  if (running) {
    return WORKING_MOOD_BY_KIND[running.kind];
  }
  if (thinking) {
    return 'thinking';
  }
  if (celebrating) {
    return 'done';
  }
  return listening ? 'idle' : 'sleep';
}

/** 头像旁的状态文字：工作中时多任务显示「N 个任务进行中…」，单任务显示它自己的动作文案 */
export function resolveMoodText(mood: YuanbaoMood, tasks: AgentTask[]): string {
  if (mood !== 'working' && mood !== 'scanning') {
    return MOOD_TEXT[mood];
  }
  const active = tasks.filter(isActiveTask);
  if (active.length > 1) {
    return `${active.length} 个任务进行中…`;
  }
  return tasks.find((task) => task.status === 'running')?.activity ?? MOOD_TEXT[mood];
}

/* ---------------- 演示数据：元宝依次走一遍 空闲 → 工作中 → 待确认 → 已完成 ---------------- */

const MINUTES_ID = 'task-minutes';
const PDF_ID = 'task-pdf';
const MARKUP_ID = 'task-markup';

/** 会议纪要的五个步骤（Figma 205:350），按推进程度切换状态 */
const MINUTES_STEPS: Omit<AgentTaskStep, 'status' | 'time'>[] = [
  { title: '读取会议转写', desc: '31 分钟音频，已转写完成' },
  { title: '识别发言人与议题', desc: '5 位发言人 · 3 个议题' },
  { title: '提炼结论与待办', desc: '已整理 2 条结论，正在抽取待办' },
  { title: '生成纪要文档', desc: '摘要 + 结论 + 待办' },
  { title: '同步到会议文档库', desc: '完成后可在文档库查看' },
];
const STEP_DONE_TIME = ['0:08', '0:15', '0:21', '0:18', '0:05'];
const STEP_ESTIMATE = ['—', '—', '—', '预计 0:20', '—'];

/** 前 doneCount 步已完成，下一步进行中，其余待开始 */
function minutesSteps(doneCount: number): AgentTaskStep[] {
  return MINUTES_STEPS.map((step, index) => {
    if (index < doneCount) {
      return { ...step, status: 'done', time: STEP_DONE_TIME[index] };
    }
    if (index === doneCount) {
      return { ...step, status: 'running', time: '进行中' };
    }
    return { ...step, status: 'pending', time: STEP_ESTIMATE[index] };
  });
}

/** 工作中阶段每一拍的纪要进度：[进度, 已完成步数, 已用时, 剩余] */
const MINUTES_TICKS: [number, number, string, string][] = [
  [20, 1, '0:12', '预计还需 2 分钟'],
  [40, 2, '0:27', '预计还需 1 分钟'],
  [60, 2, '0:42', '预计还需 1 分钟'],
  [80, 3, '0:58', '预计还需 30 秒'],
];

/** 工作中阶段一共几拍 */
export const DEMO_WORKING_TICKS = MINUTES_TICKS.length;

const markupDone: AgentTask = {
  id: MARKUP_ID,
  kind: 'markup',
  title: '共享画面批注',
  desc: '已标注 2 处 · 刚刚完成',
  status: 'done',
  activity: '正在批注共享画面…',
};

/** 先识别共享画面：批注在跑（头像一口口吞下画面），纪要和 PDF 排队 */
export function demoScanTasks(): AgentTask[] {
  return [
    {
      id: MARKUP_ID,
      kind: 'markup',
      title: '共享画面批注',
      desc: '正在识别共享画面 · 已标注 1 处',
      status: 'running',
      progress: 60,
      activity: '正在批注共享画面…',
    },
    {
      id: MINUTES_ID,
      kind: 'minutes',
      title: '会议纪要',
      desc: '等待画面识别完成后开始',
      status: 'queued',
      activity: '正在生成会议纪要…',
    },
    {
      id: PDF_ID,
      kind: 'pdf',
      title: 'PDF 报告',
      desc: '等待会议纪要完成后生成',
      status: 'queued',
      activity: '正在生成 PDF 报告…',
    },
  ];
}

/** 工作中：纪要进行中（第 tick 拍）、PDF 排队、批注已完成——对应 Figma 197:969 多任务列表 */
export function demoWorkingTasks(tick: number): AgentTask[] {
  const [progress, doneCount, elapsed, remain] = MINUTES_TICKS[Math.min(tick, MINUTES_TICKS.length - 1)];
  return [
    {
      id: MINUTES_ID,
      kind: 'minutes',
      title: '会议纪要',
      desc: `已生成 ${doneCount + 1}/5 段 · ${remain}`,
      status: 'running',
      progress,
      activity: '正在生成会议纪要…',
      meta: `基于本场会议转写 · 已用时 ${elapsed} · ${remain}`,
      steps: minutesSteps(doneCount),
    },
    {
      id: PDF_ID,
      kind: 'pdf',
      title: 'PDF 报告',
      desc: '等待会议纪要完成后生成',
      status: 'queued',
      activity: '正在生成 PDF 报告…',
    },
    markupDone,
  ];
}

const minutesDone: AgentTask = {
  id: MINUTES_ID,
  kind: 'minutes',
  title: '会议纪要',
  desc: '5 段 · 已同步到会议文档库',
  status: 'done',
  progress: 100,
  activity: '正在生成会议纪要…',
  meta: '基于本场会议转写 · 用时 1:07',
  steps: minutesSteps(MINUTES_STEPS.length),
};

/** 待确认：纪要完成，PDF 报告要等用户确认范围再生成 */
export function demoConfirmTasks(): AgentTask[] {
  return [
    {
      id: PDF_ID,
      kind: 'pdf',
      title: 'PDF 报告',
      desc: '要把待办清单一起放进报告吗？',
      status: 'confirm',
      activity: '等你确认 PDF 报告范围',
    },
    minutesDone,
    markupDone,
  ];
}

/** 已完成：三个任务都收尾 */
export function demoDoneTasks(): AgentTask[] {
  return [
    {
      id: PDF_ID,
      kind: 'pdf',
      title: 'PDF 报告',
      desc: '12 页 · 含待办清单 · 刚刚完成',
      status: 'done',
      activity: '正在生成 PDF 报告…',
    },
    minutesDone,
    markupDone,
  ];
}

/** 演示节奏（毫秒）：空闲停一下 → 识别画面 → 工作中每拍 → 待确认停留 → 已完成庆祝 → 喝彩 */
export const DEMO_TIMING = {
  idle: 1500,
  scan: 1800,
  workingTick: 1500,
  confirm: 4000,
  celebrate: 5000,
} as const;

/** 元宝表情演示入口（演示面板「元宝表情」菜单）：逐个触发每一种头像动画，附上它对应的真实触发场景 */
export const MOOD_DEMO_ITEMS: { mood: YuanbaoMood; label: string }[] = [
  { mood: 'greeting', label: '打招呼 · 元宝第一次出现' },
  { mood: 'idle', label: '待机 · 空闲' },
  { mood: 'wink', label: '眨眼 · 空闲时偶尔' },
  { mood: 'touch', label: '摸头 · 点一下头像' },
  { mood: 'sleep', label: '休眠 · 空闲太久 / 暂停记笔记' },
  { mood: 'working', label: '工作中 · 会议纪要 / PDF 报告' },
  { mood: 'scanning', label: '工作中 · 识别共享画面' },
  { mood: 'thinking', label: '思考中 · 回答提问' },
  { mood: 'confirm', label: '待确认 · 等你确认' },
  { mood: 'done', label: '已完成 · 任务收尾' },
  { mood: 'cheer', label: '喝彩 · 文件生成 / 投票发布' },
  { mood: 'eat', label: '吃新动态 · 有新内容进来' },
];
