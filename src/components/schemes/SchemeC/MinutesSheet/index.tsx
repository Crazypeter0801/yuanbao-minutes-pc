import type { FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import type { MeetingMinutes } from '@/types/chat';
import styles from './index.module.scss';

interface MinutesSheetProps {
  minutes: MeetingMinutes;
  /** 勾选 / 取消待办 */
  onToggleTodo: (id: string) => void;
  /** 复制纪要全文 */
  onCopy: () => void;
  /** 带着某段内容去提问 */
  onAskAbout: (text: string) => void;
}

/**
 * 方案 C 纪要抽屉
 * 从预览条下方展开、盖在对话上方；对话仍是主体，纪要是「随时可拉出来看的那张纸」。
 * 每条结论都能一键带到输入框追问，把纪要和问答连起来。
 */
export const MinutesSheet: FC<MinutesSheetProps> = ({ minutes, onToggleTodo, onCopy, onAskAbout }) => (
  <div className={styles.sheet} role="dialog" aria-label="元宝纪要全文">
    <div className={`${styles.body} wm-scroll-hidden`}>
      <h3 className={styles.title}>{minutes.title}</h3>

      <section className={styles.section}>
        <p className={styles.label}>概览</p>
        <p className={styles.text}>{minutes.overview}</p>
      </section>

      <section className={styles.section}>
        <p className={styles.label}>结论</p>
        <ol className={styles.conclusions}>
          {minutes.conclusions.map((item, index) => (
            <li className={styles.conclusion} key={item.id}>
              <span className={styles.index}>{index + 1}</span>
              <div className={styles.conclusionBody}>
                <p className={styles.text}>
                  <strong className={styles.bold}>{item.title}</strong>：{item.detail}
                  <Pressable
                    as="span"
                    className={styles.askLink}
                    onClick={() => onAskAbout(`关于「${item.title}」，`)}
                  >
                    追问
                  </Pressable>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section}>
        <p className={styles.label}>待办</p>
        <div className={styles.todos}>
          {minutes.todos.map((todo) => (
            <Pressable
              key={todo.id}
              className={`${styles.todo} ${todo.done ? styles.todoDone : ''}`}
              onClick={() => onToggleTodo(todo.id)}
              ariaLabel={`${todo.done ? '取消完成' : '标记完成'}：${todo.content}`}
            >
              <span className={styles.checkbox} aria-hidden="true" />
              <p className={styles.todoText}>
                <span className={styles.owner}>{todo.owner}</span>
                {todo.content}
              </p>
            </Pressable>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.label}>待定</p>
        <ul className={styles.pending}>
          {minutes.pending.map((item) => (
            <li className={styles.text} key={item}>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>

    <div className={styles.actions}>
      <Pressable className={styles.action} onClick={onCopy}>
        复制全文
      </Pressable>
      <Pressable
        className={`${styles.action} ${styles.actionPrimary}`}
        onClick={() => onAskAbout('基于纪要，')}
      >
        基于纪要提问
      </Pressable>
    </div>
  </div>
);
