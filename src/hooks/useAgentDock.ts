import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';

/** 元宝窗口的两种形态：吸附在会议窗口一侧（两个完整圆角窗口并排）/ 分离出来的浮动小窗 */
export type AgentDockMode = 'docked' | 'floating';
/** 吸附在会议窗口的哪一侧，默认右侧 */
export type AgentDockSide = 'left' | 'right';

/** 浮动小窗尺寸；吸附态宽度同为 400，高度跟会议窗口一致（760）；浮动窗矮一点（580） */
export const FLOAT_WIDTH = 400;
export const FLOAT_HEIGHT = 580;
/** 按住标题栏移动超过多少像素才算「拖出」，避免点一下就分离 */
export const DETACH_DISTANCE = 6;
/** 浮动窗靠会议窗口左 / 右缘的一边与该缘相距小于多少像素，就出现吸附提示（超出缘也算） */
export const DOCK_THRESHOLD = 120;
/** 指针纵向要落在会议窗口上下各多少像素范围内，才认为是「拖回会议」 */
const DOCK_VERTICAL_SLACK = 60;

export interface AgentDockControl {
  mode: AgentDockMode;
  /** 浮动态左上角（视口坐标） */
  position: { x: number; y: number };
  /** 正在拖动 */
  dragging: boolean;
  /** 吸附在哪一侧（浮动态时是松手后回去的那一侧） */
  side: AgentDockSide;
  /** 靠近会议左 / 右缘：松手会吸附到那一侧，同时显示吸附提示；不靠近时为 null */
  dockHint: AgentDockSide | null;
  /** 挂到元宝窗口根节点，用来量当前位置 */
  panelRef: RefObject<HTMLElement>;
  /** 标题栏按下：开始拖动 / 拖出 */
  onTitlePointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  /** 标题栏上的「分离 / 吸附」按钮 */
  toggleDock: () => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/**
 * 元宝窗口的吸附 / 分离逻辑
 * - 吸附态：贴在会议窗口右缘，会议内容让出 400 宽；
 * - 按住标题栏拖动超过 DETACH_DISTANCE 就分离成浮动小窗，会议内容恢复撑满；
 * - 拖动中浮动窗右缘离会议窗口右缘小于 DOCK_THRESHOLD，出现吸附提示，松手即吸附回去；
 * - 从吸附态刚拖出时窗口右缘仍贴着会议右缘，需先远离一次再靠近才提示，否则一拖出来就闪提示。
 */
export function useAgentDock(frameRef: RefObject<HTMLElement>): AgentDockControl {
  const [mode, setMode] = useState<AgentDockMode>('docked');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [side, setSide] = useState<AgentDockSide>('right');
  const [dockHint, setDockHint] = useState<AgentDockSide | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const modeRef = useRef<AgentDockMode>(mode);
  modeRef.current = mode;
  const sideRef = useRef<AgentDockSide>(side);
  sideRef.current = side;
  const hintRef = useRef<AgentDockSide | null>(null);
  const cleanup = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanup.current?.(), []);

  const onTitlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0 || (event.target as HTMLElement).closest('[data-nodrag]')) {
        return;
      }
      const panel = panelRef.current;
      const frame = frameRef.current;
      if (!panel || !frame) {
        return;
      }
      event.preventDefault();
      const rect = panel.getBoundingClientRect();
      const state = {
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        detached: modeRef.current === 'floating',
        // 从吸附态拖出时，先要离开一次吸附区才允许出现提示
        armed: modeRef.current === 'floating',
      };
      setDragging(true);

      const onMove = (move: PointerEvent) => {
        if (!state.detached) {
          if (Math.hypot(move.clientX - state.startX, move.clientY - state.startY) < DETACH_DISTANCE) {
            return;
          }
          state.detached = true;
          setMode('floating');
        }
        const x = clamp(move.clientX - state.offsetX, 0, window.innerWidth - FLOAT_WIDTH);
        const y = clamp(move.clientY - state.offsetY, 0, window.innerHeight - 56);
        setPosition({ x, y });

        const frameRect = frame.getBoundingClientRect();
        const nearVertical =
          move.clientY >= frameRect.top - DOCK_VERTICAL_SLACK && move.clientY <= frameRect.bottom + DOCK_VERTICAL_SLACK;
        const nearSide: AgentDockSide | null = !nearVertical
          ? null
          : x + FLOAT_WIDTH >= frameRect.right - DOCK_THRESHOLD
            ? 'right'
            : x <= frameRect.left + DOCK_THRESHOLD
              ? 'left'
              : null;
        if (!nearSide) {
          state.armed = true;
        }
        const hint = state.armed ? nearSide : null;
        hintRef.current = hint;
        setDockHint(hint);
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        cleanup.current = null;
        setDragging(false);
        if (hintRef.current) {
          setSide(hintRef.current);
          setMode('docked');
        }
        hintRef.current = null;
        setDockHint(null);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
      cleanup.current = onUp;
    },
    [frameRef],
  );

  const toggleDock = useCallback(() => {
    if (modeRef.current === 'floating') {
      setMode('docked');
      return;
    }
    const frame = frameRef.current;
    const rect = frame?.getBoundingClientRect();
    setPosition({
      x: rect ? (sideRef.current === 'left' ? rect.left + 24 : rect.right - FLOAT_WIDTH - 24) : 24,
      y: rect ? rect.top + 40 : 40,
    });
    setMode('floating');
  }, [frameRef]);

  return { mode, side, position, dragging, dockHint, panelRef, onTitlePointerDown, toggleDock };
}
