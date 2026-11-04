import { useCallback, useEffect, useState } from 'react';

/** Toast 停留时长（ms） */
const TOAST_DURATION = 2000;

export interface ToastState {
  id: number;
  text: string;
}

/** 轻提示状态：show 之后 2 秒自动消失 */
export function useToast(): { toast: ToastState | null; showToast: (text: string) => void } {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((text: string) => {
    setToast({ id: Date.now(), text });
  }, []);

  return { toast, showToast };
}
