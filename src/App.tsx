import { useState } from 'react';
import { MeetingWindow } from '@/components/meeting/MeetingWindow';
import { PollComposer } from '@/components/poll/PollComposer';
import { YuanbaoSidebar } from '@/components/YuanbaoSidebar';
import { initialArtifacts } from '@/data/artifacts';
import { buildPollPostedMessage, teamBuildingPoll } from '@/data/polls';
import { matchScenario } from '@/data/proactiveScenarios';
import { useYuanbaoSession } from '@/hooks/useYuanbaoSession';
import styles from './App.module.scss';

/**
 * 腾讯会议 PC + 元宝 Agent 对话区（Figma 257:1540）· Figma 导入版
 *
 * 相比演示版做了四件事：
 * 1. 去掉壁纸，页面底色为纯白，画布就是窗口本身；
 * 2. 去掉窗口外的场景切换条；
 * 3. 只留一个 1440×760 的主窗口（会议区 + 元宝侧栏）；
 * 4. 演示场景改用输入框触发——打「刚入会」「别人提到」「会议将结束」「建个投票」即可。
 */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pollOpen, setPollOpen] = useState(false);
  const chat = useYuanbaoSession();

  /**
   * 输入框提交：先过一遍演示场景，命中就按场景走，没命中才当普通提问。
   * 主动开口的场景（刚入会 / 别人提到 / 会议将结束）只追加元宝消息，不出现用户气泡；
   * 投票这类任务场景用场景自带的 userText 提问，同时把确认弹窗摊开。
   */
  const handleSubmit = (text: string) => {
    const scenario = matchScenario(text);
    if (!scenario) {
      chat.ask(text);
      return;
    }
    if (scenario.kind === 'ask') {
      chat.ask(scenario.userText);
      if (scenario.opens === 'poll') {
        setPollOpen(true);
      }
      return;
    }
    chat.push(scenario.build());
  };

  return (
    <div className={styles.page}>
      <div className={styles.window}>
        {/* 投票弹窗只盖会议区，元宝说的话仍然看得见 */}
        <div className={styles.meetingArea}>
          <MeetingWindow yuanbaoOpen={sidebarOpen} onToggleYuanbao={() => setSidebarOpen((open) => !open)} />
          {pollOpen && (
            <PollComposer
              draft={teamBuildingPoll}
              onClose={() => setPollOpen(false)}
              onSubmit={() => {
                setPollOpen(false);
                chat.push(buildPollPostedMessage(teamBuildingPoll.title));
              }}
            />
          )}
        </div>
        {sidebarOpen && (
          <YuanbaoSidebar
            chat={chat}
            artifacts={initialArtifacts}
            onClose={() => setSidebarOpen(false)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
