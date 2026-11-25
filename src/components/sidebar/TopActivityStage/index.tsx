import { useEffect, useState, type FC } from 'react';
import yuanbaoSleepingBg from '@/assets/d2c/icons/yuanbao811/yuanbao-sleeping-bg.svg';
import yuanbaoSleepingBody from '@/assets/d2c/icons/yuanbao811/yuanbao-sleeping-body.svg';
import yuanbaoSleepingFg from '@/assets/d2c/icons/yuanbao811/yuanbao-sleeping-fg.svg';
import { YuanbaoWorkingSprite } from '@/components/sidebar/TaskEntry/YuanbaoWorkingSprite';
import styles from './index.module.scss';

const ROLL_EXIT_MS = 280;

interface TopActivityStageProps {
  /** 是否处于活动态（进行中任务或 3 秒思考态）；false 时呈现 Figma 811:39347 空闲中状态 */
  isActive: boolean;
  /** 是否处于用户发言后的思考态 */
  isThinking: boolean;
  /** 当前任务阶段文案（无尾部省略号） */
  statusText: string;
  /** 点击悬浮元宝徽章打开 Agent 详情（查看任务/资料库/连接器） */
  onOpenDetail: () => void;
}

/**
 * 对话内容上方的元宝活动浮层（对齐 Figma 811:25116 活动态 / 811:39347 空闲中状态）：
 * - 空闲中：60×60 休眠元宝三层矢量图 + 白底圆角胶囊仅展示「元宝」；
 * - 活动态：60×60 36 帧工作形象动态雪碧图 + 白底胶囊平滑展开「正在思考」/ 简短任务阶段轮播文案。
 */
export const TopActivityStage: FC<TopActivityStageProps> = ({
  isActive,
  isThinking,
  statusText,
  onOpenDetail,
}) => {
  const resolvedText = (isThinking ? '正在思考' : statusText).replace(/(\.{3}|…)+$/u, '');
  const [rollState, setRollState] = useState<{
    current: string;
    previous: string | null;
    tick: number;
  }>({
    current: resolvedText,
    previous: null,
    tick: 0,
  });

  useEffect(() => {
    setRollState((prev) =>
      prev.current === resolvedText
        ? prev
        : {
            current: resolvedText,
            previous: prev.current,
            tick: prev.tick + 1,
          },
    );
  }, [resolvedText]);

  useEffect(() => {
    if (rollState.previous === null) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setRollState((prev) => (prev.previous === null ? prev : { ...prev, previous: null }));
    }, ROLL_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [rollState.tick, rollState.previous]);

  const ariaLabel = isActive
    ? `元宝，${resolvedText}，点击查看 Agent 详情`
    : '元宝，空闲中，点击查看 Agent 详情';

  return (
    <div
      className={`${styles.stage} ${isActive ? styles.stageActive : styles.stageIdle}`}
      data-top-activity-stage="true"
      data-top-activity-state={isActive ? 'active' : 'idle'}
    >
      <button
        type="button"
        className={styles.badge}
        onClick={onOpenDetail}
        aria-label={ariaLabel}
        title="查看元宝 Agent 详情"
      >
        <span className={styles.character} aria-hidden="true">
          {/* 空闲中休眠元宝（Figma 811:39427，50×53.662 居中于 60×60） */}
          <span
            className={`${styles.characterLayer} ${
              !isActive ? styles.characterLayerVisible : styles.characterLayerHidden
            }`}
            data-top-activity-mascot="idle"
          >
            <span className={styles.sleepingArt}>
              <img
                src={yuanbaoSleepingBg}
                alt=""
                className={styles.sleepingBg}
                draggable={false}
              />
              <img
                src={yuanbaoSleepingBody}
                alt=""
                className={styles.sleepingBody}
                draggable={false}
              />
              <img
                src={yuanbaoSleepingFg}
                alt=""
                className={styles.sleepingFg}
                draggable={false}
              />
            </span>
          </span>

          {/* 活动态工作元宝（Figma 811:37275，接入 36 帧动态雪碧图 60×60） */}
          <span
            className={`${styles.characterLayer} ${
              isActive ? styles.characterLayerVisible : styles.characterLayerHidden
            }`}
            data-top-activity-mascot="active"
          >
            <YuanbaoWorkingSprite size={60} active={isActive} />
          </span>
        </span>

        <span className={`${styles.pill} ${isActive ? styles.pillActive : styles.pillIdle}`}>
          <span className={styles.name}>元宝</span>
          <span
            className={`${styles.statusWrap} ${isActive ? styles.statusWrapVisible : ''}`}
            aria-hidden={!isActive}
          >
            <span className={styles.statusViewport} data-top-activity-text={rollState.current}>
              {rollState.previous !== null && (
                <span
                  key={`exit-${rollState.tick}`}
                  className={`${styles.statusText} ${styles.statusTextExit}`}
                  aria-hidden="true"
                >
                  {rollState.previous}
                </span>
              )}
              <span
                key={`enter-${rollState.tick}`}
                className={`${styles.statusText} ${
                  rollState.previous !== null ? styles.statusTextEnter : ''
                }`}
              >
                {rollState.current}
              </span>
            </span>
          </span>
        </span>
      </button>
    </div>
  );
};
