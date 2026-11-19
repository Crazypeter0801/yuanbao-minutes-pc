import { useCallback, useEffect, useRef, useState } from 'react';
import { SELF } from '@/data/meetingChat';

/** 弹幕停留时长（ms），之后淡出 */
const BARRAGE_STAY = 3280;
/** 淡出动画时长（ms） */
const BARRAGE_EXIT = 220;
/** 画面上同时最多几条 */
const BARRAGE_MAX = 4;

export interface BarrageItem {
  id: number;
  name: string;
  text: string;
  /** 正在淡出 */
  leaving: boolean;
}

export interface MeetingChat {
  /** 本场自己发出的消息（追加在历史记录后面） */
  sent: { id: number; text: string }[];
  /** 画面左下角的弹幕 */
  barrage: BarrageItem[];
  /** 聊天侧栏里的「开启弹幕」：关掉后侧栏发的消息不再上屏 */
  barrageEnabled: boolean;
  setBarrageEnabled: (next: boolean) => void;
  /** 发一条消息；showBarrage 为 true 时同时上屏，空白内容返回 false */
  send: (value: string, showBarrage?: boolean) => boolean;
}

/**
 * 会中聊天状态：底栏「发送弹幕」浮层和聊天侧栏共用一份消息与弹幕
 * （参考 Demo 的 sendChatMessage：发出即进聊天记录，开着弹幕时同时上屏 3.3 秒）
 */
export function useMeetingChat(): MeetingChat {
  const [sent, setSent] = useState<MeetingChat['sent']>([]);
  const [barrage, setBarrage] = useState<BarrageItem[]>([]);
  const [barrageEnabled, setBarrageEnabled] = useState(true);
  const seq = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const send = useCallback((value: string, showBarrage = true) => {
    const text = value.trim();
    if (!text) {
      return false;
    }
    seq.current += 1;
    const id = seq.current;
    setSent((previous) => [...previous, { id, text }]);

    if (showBarrage) {
      setBarrage((previous) => [...previous, { id, name: SELF.name, text, leaving: false }].slice(-BARRAGE_MAX));
      timers.current.push(
        window.setTimeout(() => {
          setBarrage((previous) => previous.map((item) => (item.id === id ? { ...item, leaving: true } : item)));
        }, BARRAGE_STAY),
        window.setTimeout(() => {
          setBarrage((previous) => previous.filter((item) => item.id !== id));
        }, BARRAGE_STAY + BARRAGE_EXIT),
      );
    }
    return true;
  }, []);

  return { sent, barrage, barrageEnabled, setBarrageEnabled, send };
}
