import { Renderer } from '@openuidev/react-lang';
import type { FC } from 'react';
import { yuanbaoOpenuiLibrary } from '@/openui/yuanbaoLibrary';
import styles from './index.module.scss';

interface OpenUIBlockProps {
  /** OpenUI Lang 源码（或 buildMessage 存储格式） */
  response: string;
  /** 流式中时禁用交互；演示默认 false */
  isStreaming?: boolean;
}

/**
 * 把 OpenUI Lang 渲染进元宝主对话输出路径。
 * 外层仍套助手气泡壳，内部形态由模型程序决定。
 */
export const OpenUIBlock: FC<OpenUIBlockProps> = ({ response, isStreaming = false }) => (
  <div className={styles.shell}>
    <Renderer
      response={response}
      library={yuanbaoOpenuiLibrary}
      isStreaming={isStreaming}
      onError={(errors) => {
        if (errors.length > 0 && import.meta.env.DEV) {
          // 开发时便于排查畸形生成；生产静默，Parser 会尽量渲染可用部分
          console.warn('[OpenUI]', errors);
        }
      }}
    />
  </div>
);
