/**
 * 演示用 OpenUI Lang 程序（证明 Intelligent UI 走生成式路径）。
 * 真实接入时由模型按 yuanbaoOpenuiLibrary.prompt() 流式产出同等语法。
 */

/** Demo 1：会中小结（替代硬编码气泡块） */
export const OPENUI_MEETING_SUMMARY = `root = Stack([intro, points, open])
intro = Text("到目前为止主要聊了两件事：")
points = BulletList([p1, p2])
p1 = Bullet("竞品偏“以面为主”的布局，当前产品更偏线性结构，会上做了对照。")
p2 = Bullet("登录页需要更亲和、有趣。")
open = Callout("还没定", "是否保留现有主题色、竖向布局怎么改。")
`;

/** Demo 2：待办清单（Fact 原子展示负责人） */
export const OPENUI_TODO_BOARD = `root = Stack([title, a, b, c, note])
title = Heading("目前记下 3 项待办")
a = Fact("立昌", "两版视觉方向初稿，下次评审前出。")
b = Fact("黄婷婷", "补一组竞品代表案例，可与初稿并行。")
c = Fact("全员", "主题色是否保留，评审时一起定。")
note = Text("需要的话可以说「帮我同步到待办」。")
`;
