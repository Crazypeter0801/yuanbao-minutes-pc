import { useCallback, useState } from 'react';

/**
 * 元宝「正在听」状态
 * 暂停 / 继续时给出提示文案，由调用方决定如何展示。
 */
export function useListening(onChange?: (listening: boolean) => void) {
  const [isListening, setIsListening] = useState(true);

  const toggleListening = useCallback(() => {
    const next = !isListening;
    setIsListening(next);
    onChange?.(next);
  }, [isListening, onChange]);

  return { isListening, toggleListening };
}
