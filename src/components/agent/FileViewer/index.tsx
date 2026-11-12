import { useState, type FC, type FormEvent } from 'react';
import viewerWindow from '@/assets/detail/viewer-window.png';
import plusIcon from '@/assets/detail/viewer-plus.svg';
import sendIcon from '@/assets/detail/viewer-send.svg';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

interface FileViewerProps {
  onClose: () => void;
}

const DEMO_REPLY = '会。算力、数据和监管都会把节奏限住，报告里各机构的口径本来就不宜直接相加。';

/**
 * 独立于会议窗和元宝窗的文件查看器（Figma 289:29965）
 * 文档用稿面导出的窗口图。底部输入条浮在页码和缩放上面，可发送一条演示回复。
 */
export const FileViewer: FC<FileViewerProps> = ({ onClose }) => {
  const [draft, setDraft] = useState('AI发展会受到哪些限制？');
  const [reply, setReply] = useState<string | null>(null);

  const send = (event?: FormEvent) => {
    event?.preventDefault();
    const text = draft.trim();
    if (!text) {
      return;
    }
    setReply(DEMO_REPLY);
    setDraft('');
  };

  return (
    <div className={styles.layer}>
      <div className={styles.window} role="dialog" aria-label="AI产业调研报告.pdf">
        <img className={styles.sheet} src={viewerWindow} alt="AI产业调研报告.pdf 第 4 页，共 16 页" />
        <Pressable className={styles.close} onClick={onClose} ariaLabel="关闭文件" title="关闭">
          <span className={styles.closeHit} />
        </Pressable>
        {reply && <p className={styles.reply}>{reply}</p>}
        <form className={styles.ask} onSubmit={send}>
          <Pressable className={styles.plus} ariaLabel="添加" title="添加">
            <img src={plusIcon} width={18} height={18} alt="" />
          </Pressable>
          <input
            className={styles.input}
            value={draft}
            aria-label="问这份文件"
            onChange={(event) => setDraft(event.target.value)}
          />
          <Pressable className={styles.send} onClick={() => send()} ariaLabel="发送">
            <img src={sendIcon} width={28} height={28} alt="" />
          </Pressable>
        </form>
      </div>
    </div>
  );
};
