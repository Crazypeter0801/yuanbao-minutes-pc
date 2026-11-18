"""
生成 src/components/sidebar/TaskDots/index.module.scss（进行中任务点阵的帧动画）。

帧数据来自 Frame-based Matrix Loader：8 帧、7fps，带拖尾的「蛇」沿 3×3 外圈顺时针走。
原方案用 JS 每帧改 opacity；这里把同一份帧数据编译成每格独立的 CSS 关键帧，
每帧开头用 0.05s 淡到该帧的值（对应原 CSS 的 transition: opacity 0.05s），然后保持到下一帧。

改帧数据 / fps 后执行：python3 scripts/gen-task-dots.py
"""
from pathlib import Path

FRAMES = [
    [[1, 0, 0], [0.7666666666666667, 0, 0], [0.5333333333333334, 0, 0]],
    [[0.7666666666666667, 1, 0], [0.5333333333333334, 0, 0], [0, 0, 0]],
    [[0.5333333333333334, 0.7666666666666667, 1], [0, 0, 0], [0, 0, 0]],
    [[0, 0.5333333333333334, 0.7666666666666667], [0, 0, 1], [0, 0, 0]],
    [[0, 0, 0.5333333333333334], [0, 0, 0.7666666666666667], [0, 0, 1]],
    [[0, 0, 0], [0, 0, 0.5333333333333334], [0, 1, 0.7666666666666667]],
    [[0, 0, 0], [0, 0, 0], [1, 0.7666666666666667, 0.5333333333333334]],
    [[0, 0, 0], [1, 0, 0], [0.7666666666666667, 0.5333333333333334, 0]],
]
FPS = 7
FADE_MS = 50  # 原 CSS：transition: opacity 0.05s ease

OUT = Path(__file__).resolve().parent.parent / 'src/components/sidebar/TaskDots/index.module.scss'


def num(value: float) -> str:
    text = f'{value:.3f}'.rstrip('0').rstrip('.')
    return text or '0'


def build() -> str:
    count = len(FRAMES)
    duration = round(count * 1000 / FPS)
    seg = 100 / count
    fade = FADE_MS / duration * 100

    parts = [
        f"""/*
 * 进行中任务点阵 · 帧动画（Frame-based Matrix Loader）
 *
 * 结构与参数沿用给定的 Matrix Loader：3×3、每格底色 off、上面叠一层 on 色的 ::after，
 * 每一帧只改 ::after 的 opacity，帧间 0.05s 过渡；{count} 帧、{FPS}fps，一轮 {duration}ms。
 * 帧数据是一条带拖尾的「蛇」沿外圈顺时针走：头 1、拖尾 0.767 / 0.533，中心格始终不亮。
 * 原方案用 JS 驱动帧，这里把同一份帧数据编译成每格的 CSS 关键帧，效果一致、不触发 React 重渲染。
 *
 * 颜色按 Figma 533:13569 替换：off #E6E8EB、on #B0B6C3；尺寸按稿：16×16，格 3.5、间距 1、圆角 1。
 * 原 CSS 的 drop-shadow 光晕在白底小卡片上会变成一圈灰雾，这里不用。
 *
 * ⚠️ 本文件由 scripts/gen-task-dots.py 生成，改帧请改脚本后重新执行，不要手改。
 */

$cell: 3.5px;
$gap: 1px;
$inset: 1.75px;

.dots {{
  position: relative;
  flex: 0 0 auto;
  display: block;
  width: 16px;
  height: 16px;
}}

.cell {{
  position: absolute;
  width: $cell;
  height: $cell;
  border-radius: 1px;
  background-color: var(--wm-color-task-dot-off);

  &::after {{
    position: absolute;
    inset: 0;
    content: '';
    border-radius: 1px;
    background-color: var(--wm-color-task-dot-on);
    opacity: 0;
  }}
}}
"""
    ]

    for index in range(9):
        row, col = divmod(index, 3)
        parts.append(
            f""".cell{index} {{
  top: calc($inset + {row} * ($cell + $gap));
  left: calc($inset + {col} * ($cell + $gap));
}}
"""
        )

    parts.append('/* ---------- 每格的关键帧：第 n 帧从 n×12.5% 开始，0.05s 内淡到该帧的值，保持到下一帧 ---------- */\n')
    for index in range(9):
        row, col = divmod(index, 3)
        values = [frame[row][col] for frame in FRAMES]
        if max(values) == 0:
            continue  # 中心格从不亮
        lines = [f'@keyframes task-dot-{index} {{', f'  0% {{ opacity: {num(values[-1])}; }}']
        for k, value in enumerate(values):
            start = k * seg
            end = '100' if k == count - 1 else num(start + seg)
            lines.append(f'  {num(start + fade)}%, {end}% {{ opacity: {num(value)}; }}')
        lines.append('}')
        parts.append('\n'.join(lines) + '\n')
        parts.append(
            f""".running .cell{index}::after {{
  animation: task-dot-{index} {duration}ms linear infinite;
}}
"""
        )

    parts.append(
        """/* 减少动态效果：停在设计稿静帧（第一行亮、第二行第一格 70%） */
@media (prefers-reduced-motion: reduce) {
  .running .cell::after {
    animation: none;
  }

  .running .cell0::after,
  .running .cell1::after,
  .running .cell2::after {
    opacity: 1;
  }

  .running .cell3::after {
    opacity: 0.7;
  }
}
"""
    )
    return '\n'.join(parts)


if __name__ == '__main__':
    OUT.write_text(build(), encoding='utf-8')
    print(f'written {OUT}')
