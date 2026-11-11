import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';

/** 元宝窗口的两种形态：吸附在会议窗口右侧（并列、连成一体）/ 分离出来的浮动小窗 */
export type AgentDockMode = 'docked' | 'floating';

/** 浮动小窗尺寸；吸附态宽度同为 400，高度跟会议窗口一致（760） */
export const FLOAT_WIDTH = 400;
export const FLOAT_HEIGHT = 680;
/** 按住标题栏移动超过多少像素才算「拖出」，避免点一下就分离 */
export const DETACH_DISTANCE = 6;
/** 浮动窗右缘与会议窗口右缘相距小于多少像素，就出现吸附提示（超出右缘也算） */
export const DOCK_THRESHOLD = 120;
/** 指针纵向要落在会议窗口上下各多少像素范围内，才认为是「拖回会议」 */
const DOCK_VERTICAL_SLACK = 60;

export interface AgentDockControl {
  mode: AgentDockMode;
  /** 浮动态左上角（视口坐标） */
  position: { x: number; y: number };
  /** 正在拖动 */
  dragging: boolean;
  /** 靠近会议右缘：松手会吸附，同时显示吸附提示 */
  dockHint: boolean;
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
  const [dockHint, setDockHint] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const modeRef = useRef<AgentDockMode>(mode);
  modeRef.current = mode;
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
        const near =
          x + FLOAT_WIDTH >= frameRect.right - DOCK_THRESHOLD &&
          move.clientY >= frameRect.top - DOCK_VERTICAL_SLACK &&
          move.clientY <= frameRect.bottom + DOCK_VERTICAL_SLACK;
        if (!near) {
          state.armed = true;
        }
        setDockHint(state.armed && near);
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        cleanup.current = null;
        setDragging(false);
        setDockHint((hint) => {
          if (hint) {
            setMode('docked');
          }
          return false;
        });
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
      x: rect ? rect.right - FLOAT_WIDTH - 24 : 24,
      y: rect ? rect.top + 40 : 40,
    });
    setMode('floating');
  }, [frameRef]);

  return { mode, position, dragging, dockHint, panelRef, onTitlePointerDown, toggleDock };
}
