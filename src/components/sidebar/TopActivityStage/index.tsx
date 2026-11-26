import { useEffect, useState, type FC } from 'react';
import yuanbaoStateIdle from '@/assets/d2c/icons/yuanbao811/yuanbao-state-idle.svg';
import styles from './index.module.scss';
import { YuanbaoWorkingSprite } from './YuanbaoWorkingSprite';

const ROLL_EXIT_MS = 280;

interface TopActivityStageProps {
  /** 是否处于活动态（进行中任务或 3 秒思考态）；false 时呈现 Figma 875:28570 空闲态 */
  isActive: boolean;
  /** 是否处于用户发言后的思考态 */
  isThinking: boolean;
  /** 当前任务阶段文案（无尾部省略号） */
  statusText: string;
  /** 点击顶部悬浮元宝徽章打开 Agent 详情（任务 / 资料库 / 连接器） */
  onOpenDetail: () => void;
}

/**
 * 顶部元宝活动状态与 Agent 详情统一入口（Figma 811:24867 活动态 / 875:28570 空闲态）：
 * - 空闲态：48×48 空闲元宝（state-idle 42×39.353）+ #FAFAFA 磨砂胶囊仅展示「元宝」；
 * - 活动态：48×48 36 帧工作形象动态雪碧图 + #FAFAFA 磨砂胶囊平滑展开「正在思考」/ 简短任务阶段轮播文案；
 * - 点击徽章统一进入元宝 Agent 详情页。
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
        data-agent-detail-trigger="true"
      >
        <span
          className={`${styles.character} ${isActive ? styles.characterActive : styles.characterIdle}`}
          aria-hidden="true"
        >
          {/* 空闲态元宝（Figma 875:28570 / 898:31284 state-idle，42×39.353 居中于 48×48） */}
          <span
            className={`${styles.characterLayer} ${
              !isActive ? styles.characterLayerVisible : styles.characterLayerHidden
            }`}
            data-top-activity-mascot="idle"
          >
            <img
              src={yuanbaoStateIdle}
              alt=""
              className={styles.idleArt}
              width={42}
              height={39.353}
              draggable={false}
            />
          </span>

          {/* 活动态工作元宝（Figma 811:37275，接入 36 帧动态雪碧图 48×48） */}
          <span
            className={`${styles.characterLayer} ${
              isActive ? styles.characterLayerVisible : styles.characterLayerHidden
            }`}
            data-top-activity-mascot="active"
          >
            <YuanbaoWorkingSprite size={48} active={isActive} />
          </span>
        </span>

        <span className={`${styles.pill} ${isActive ? styles.pillActive : styles.pillIdle}`}>
          <span className={`${styles.name} ${isActive ? styles.nameActive : styles.nameIdle}`}>元宝</span>
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
