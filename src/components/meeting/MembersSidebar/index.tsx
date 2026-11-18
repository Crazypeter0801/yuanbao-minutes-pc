import { useMemo, useState, type FC } from "react";
import iconCam from "@/assets/d2c/icons/members/icon-cam.svg";
import iconCamOff from "@/assets/d2c/icons/members/icon-cam-off.svg";
import iconMic from "@/assets/d2c/icons/members/icon-mic.svg";
import iconMicMuted from "@/assets/d2c/icons/members/icon-mic-muted.svg";
import iconSearch from "@/assets/d2c/icons/members/icon-search.svg";
import avatarRing from "@/assets/d2c/icons/members/avatar-ring.svg";
import { Pressable } from "@/components/common/Pressable";
import { MEETING_MEMBERS } from "@/data/meetingMembers";
import styles from "./index.module.scss";

type MemberFilter = "in" | "out";

interface MembersSidebarProps {
  /** 底栏按钮演示反馈 */
  onAction?: (label: string) => void;
}

/**
 * 会中「管理成员」内容（Figma 489:10247）
 * 顶栏由 AppTabBar 提供；本组件负责内部 Tab、搜索、名单和底栏。
 */
export const MembersSidebar: FC<MembersSidebarProps> = ({ onAction }) => {
  const [filter, setFilter] = useState<MemberFilter>("in");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const members = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return MEETING_MEMBERS.filter((member) => {
      if (filter === "in" ? !member.inMeeting : member.inMeeting) {
        return false;
      }
      if (!keyword) {
        return true;
      }
      return `${member.name}${member.org}`.toLowerCase().includes(keyword);
    });
  }, [filter, query]);

  return (
    <div className={styles.panel} aria-label="管理成员">
      <div className={styles.body}>
        <div className={styles.tabsRow}>
          <div className={styles.tabs} role="tablist" aria-label="成员状态">
            <Pressable
              as="span"
              className={`${styles.tab} ${filter === "in" ? styles.tabActive : ""}`}
              onClick={() => setFilter("in")}
              ariaLabel="会议中"
              ariaExpanded={filter === "in"}
            >
              <span role="tab" aria-selected={filter === "in"}>
                会议中
              </span>
            </Pressable>
            <Pressable
              as="span"
              className={`${styles.tab} ${filter === "out" ? styles.tabActive : ""}`}
              onClick={() => setFilter("out")}
              ariaLabel="未入会"
              ariaExpanded={filter === "out"}
            >
              <span role="tab" aria-selected={filter === "out"}>
                未入会
              </span>
            </Pressable>
          </div>
          {searchOpen ? (
            <input
              className={styles.searchInput}
              value={query}
              autoFocus
              placeholder="搜索成员"
              onChange={(event) => setQuery(event.target.value)}
              onBlur={() => {
                if (!query.trim()) {
                  setSearchOpen(false);
                }
              }}
            />
          ) : (
            <Pressable
              className={styles.search}
              onClick={() => setSearchOpen(true)}
              ariaLabel="搜索成员"
              title="搜索"
            >
              <img src={iconSearch} alt="" />
            </Pressable>
          )}
        </div>

        <ul className={`${styles.list} wm-scroll-hidden`}>
          {members.length === 0 ? (
            <li className={styles.empty}>{query.trim() ? "没有匹配的成员" : "暂无未入会成员"}</li>
          ) : (
            members.map((member) => (
              <li key={member.id} className={styles.row}>
                <div className={styles.identity}>
                  <span className={styles.avatarWrap}>
                    <img className={styles.avatar} src={member.avatar} alt="" />
                    <img className={styles.avatarRing} src={avatarRing} alt="" />
                  </span>
                  <span className={styles.meta}>
                    <span className={styles.name}>{member.name}</span>
                    <span className={styles.org}>{member.org}</span>
                  </span>
                </div>
                <span className={styles.device} aria-hidden="true">
                  <img src={member.micOn ? iconMic : iconMicMuted} alt="" />
                  <img src={member.camOn ? iconCam : iconCamOff} alt="" />
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      <footer className={styles.footer}>
        <Pressable className={styles.footerButton} onClick={() => onAction?.("全体静音")}>
          全体静音
        </Pressable>
        <Pressable className={styles.footerButton} onClick={() => onAction?.("会议管控")}>
          会议管控
        </Pressable>
        <Pressable className={`${styles.footerButton} ${styles.footerPrimary}`} onClick={() => onAction?.("邀请成员")}>
          邀请成员
        </Pressable>
      </footer>
    </div>
  );
};
