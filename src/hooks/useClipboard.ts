import { useCallback } from 'react';

/**
 * 复制文本到剪贴板
 * 优先使用 Clipboard API，非安全上下文（http）下回退到 textarea + execCommand。
 * @returns copy 函数，返回是否复制成功
 */
export function useClipboard(): (text: string) => Promise<boolean> {
  return useCallback(async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const succeeded = document.execCommand('copy');
      document.body.removeChild(textarea);
      return succeeded;
    } catch (error) {
      console.error('[useClipboard] 复制失败', error);
      return false;
    }
  }, []);
}
