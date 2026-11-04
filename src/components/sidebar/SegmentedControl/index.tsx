import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

export interface SegmentOption<T extends string> {
  key: T;
  label: string;
  /** 右上角红点（如问元宝有新回答） */
  dot?: boolean;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (key: T) => void;
}

/**
 * 分段切换（Figma 248:14149）
 * 灰底 36 高、圆角 18；选中项白底圆角 16 + 轻阴影，切换时滑块平移。
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>): JSX.Element {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.key === value),
  );

  return (
    <div className={styles.control} role="tablist">
      <span
        className={styles.thumb}
        style={{
          width: `calc((100% - 4px) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
        aria-hidden="true"
      />
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            className={`${styles.item} ${active ? styles.itemActive : ''}`}
            onClick={() => onChange(option.key)}
            ariaLabel={option.label}
          >
            <span className={styles.label}>
              {option.label}
              {option.dot && !active && <span className={styles.dot} aria-label="有新消息" />}
            </span>
          </Pressable>
        );
      })}
    </div>
  );
}
