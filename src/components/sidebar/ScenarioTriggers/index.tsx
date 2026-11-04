import type { FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import type { ProactiveScenario } from '@/data/proactiveScenarios';
import styles from './index.module.scss';

interface ScenarioTriggersProps {
  scenarios: ProactiveScenario[];
  /** 点了某个场景，把它的消息推给元宝 */
  onTrigger: (scenario: ProactiveScenario) => void;
}

/**
 * 主动触发场景条（演示用，非产品功能）
 * 贴在侧栏头部下方、消息流之上，不参与滚动：演示时随手一点就能让元宝在该时机主动开口。
 * 上线前整块删掉即可，不牵连其它组件。
 */
export const ScenarioTriggers: FC<ScenarioTriggersProps> = ({ scenarios, onTrigger }) => (
  <div className={styles.bar} aria-label="主动触发场景">
    <span className={styles.label}>演示</span>
    {scenarios.map((scenario) => (
      <Pressable
        key={scenario.id}
        className={styles.chip}
        onClick={() => onTrigger(scenario)}
        title={scenario.hint}
        ariaLabel={scenario.label}
      >
        {scenario.label}
      </Pressable>
    ))}
  </div>
);
