import { useState } from 'react';
import { MeetingWindow } from '@/components/meeting/MeetingWindow';
import { PollComposer } from '@/components/poll/PollComposer';
import { YuanbaoSidebar } from '@/components/YuanbaoSidebar';
import {
  buildArtifactCreatedMessage,
  buildExtraArtifact,
  firstCreatedArtifacts,
} from '@/data/artifacts';
import { buildPollPostedMessage, teamBuildingPoll } from '@/data/polls';
import { matchScenario } from '@/data/proactiveScenarios';
import { useYuanbaoSession } from '@/hooks/useYuanbaoSession';
import type { ArtifactItem } from '@/types/artifact';
import styles from './App.module.scss';

/** 「建一个 PDF / PPT / 文件」这类说法都算要生成产物 */
const CREATE_FILE_PATTERN = /创建|建个|生成|做一?份|出一份/;
const FILE_KIND_PATTERN = /pdf|ppt|幻灯片|文件|纪要文档/i;

/**
 * 腾讯会议 PC + 元宝 Agent 对话区（Figma 257:1540）· Figma 导入版
 *
 * 1. 去掉壁纸，页面底色为纯白，画布就是窗口本身；
 * 2. 去掉窗口外的场景切换条；
 * 3. 只留一个 1440×760 的主窗口（会议区 + 元宝侧栏）；
 * 4. 演示场景用输入框或记笔记面板里的指令集合触发。
 */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pollOpen, setPollOpen] = useState(false);
  /** 产物一开始是空的：没有文件时底栏不出现「输出」入口 */
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const chat = useYuanbaoSession();

  /**
   * 创建产物：第一次一次性给一组文件，之后每次追加一条。
   * 只有创建过才会出现「输出 · N」入口，这样第一步是从零开始的。
   */
  const createArtifact = (kind: 'pdf' | 'pptx') => {
    setArtifacts((previous) =>
      previous.length === 0 ? firstCreatedArtifacts : [...previous, buildExtraArtifact(kind)],
    );
    chat.push(buildArtifactCreatedMessage(kind));
  };

  /**
   * 输入框提交：先看是不是要生成文件，再过一遍演示场景，都没命中才当普通提问。
   * 主动开口的场景（刚入会 / 别人提到 / 会议将结束）只追加元宝消息，不出现用户气泡；
   * 投票这类任务场景用场景自带的 userText 提问，同时把确认弹窗摊开。
   */
  const handleSubmit = (text: string) => {
    if (CREATE_FILE_PATTERN.test(text) && FILE_KIND_PATTERN.test(text)) {
      // 和普通提问一样先出用户气泡、元宝想一下再回，文件随回答一起落进「输出」
      chat.runTask(text, () => createArtifact(/ppt|幻灯片/i.test(text) ? 'pptx' : 'pdf'));
      return;
    }

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
            artifacts={artifacts}
            onClose={() => setSidebarOpen(false)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
