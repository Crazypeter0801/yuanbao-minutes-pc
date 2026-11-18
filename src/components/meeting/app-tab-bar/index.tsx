import type { FC } from "react";
import IconAppTabChat from "@/assets/d2c/icons/meeting-app/icon-app-tab-chat";
import IconAppTabMembers from "@/assets/d2c/icons/meeting-app/icon-app-tab-members";
import IconAppTabMore from "@/assets/d2c/icons/meeting-app/icon-app-tab-more";
import IconAppTabYuanbao from "@/assets/d2c/icons/meeting-app/icon-app-tab-yuanbao";
import iconClose from "@/assets/d2c/icons/members/icon-close.svg";
import iconPip from "@/assets/d2c/icons/members/icon-pip.svg";
import { Pressable } from "@/components/common/Pressable";
import type { MeetingAppTab } from "@/lib/meetingAppTab";
import type { AgentDockControl } from "@/hooks/useAgentDock";
import styles from "./index.module.scss";

interface AppTabBarProps {
  /** 当前应用（成员或聊天）；元宝态不用本顶栏 */
  tab: Exclude<MeetingAppTab, "yuanbao">;
  dock: AgentDockControl;
  onSelectTab: (tab: MeetingAppTab) => void;
  onClose: () => void;
  onMore?: () => void;
}

const TITLES: Record<Exclude<MeetingAppTab, "yuanbao">, string> = {
  members: "管理成员",
  chat: "聊天",
};

/**
 * 多应用顶部壳（Figma 489:10247）
 * 未选中的应用显示 40 图标，选中项展开为标题胶囊（含独立窗口 / 关闭）。
 */
export const AppTabBar: FC<AppTabBarProps> = ({ tab, dock, onSelectTab, onClose, onMore }) => {
  const floating = dock.mode === "floating";
  const title = TITLES[tab];
  const ActiveIcon = tab === "chat" ? IconAppTabChat : IconAppTabMembers;

  return (
    <header
      className={`${styles.header} ${dock.dragging ? styles.dragging : ""}`}
      onPointerDown={dock.onTitlePointerDown}
      title="按住拖动，可把窗口从会议分离出来"
    >
      {tab !== "chat" && (
        <span data-nodrag>
        <Pressable
          className={styles.iconTab}
          onClick={() => onSelectTab("chat")}
          ariaLabel="打开会议聊天"
          title="会议聊天"
        >
          <IconAppTabChat width={24} height={24} />
        </Pressable>
        </span>
      )}

      <div className={styles.capsule} data-nodrag>
        <span className={styles.capsuleTitle}>
          <ActiveIcon width={20} height={20} />
          <span>{title}</span>
        </span>
        <span className={styles.capsuleActions}>
          <Pressable
            className={styles.action}
            onClick={dock.toggleDock}
            ariaLabel={floating ? "吸附回会议窗口" : "独立窗口"}
            title={floating ? "吸附回会议窗口" : "独立窗口"}
          >
            <img src={iconPip} alt="" width={16} height={16} />
          </Pressable>
          <Pressable className={styles.action} onClick={onClose} ariaLabel="关闭侧栏" title="关闭">
            <img src={iconClose} alt="" width={16} height={16} />
          </Pressable>
        </span>
      </div>

      {tab !== "members" && (
        <span data-nodrag>
        <Pressable
          className={styles.iconTab}
          onClick={() => onSelectTab("members")}
          ariaLabel="打开管理成员"
          title="管理成员"
        >
          <IconAppTabMembers width={24} height={24} />
        </Pressable>
        </span>
      )}

      <span data-nodrag>
      <Pressable
        className={styles.iconTab}
        onClick={() => onSelectTab("yuanbao")}
        ariaLabel="打开元宝"
        title="元宝"
      >
        <IconAppTabYuanbao width={24} height={24} />
      </Pressable>
      </span>

      <span data-nodrag>
      <Pressable
        className={styles.iconTab}
        onClick={onMore}
        ariaLabel="更多"
        title="更多"
      >
        <IconAppTabMore width={20} height={20} />
      </Pressable>
      </span>
    </header>
  );
};
