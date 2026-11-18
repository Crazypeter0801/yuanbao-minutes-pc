/** 同一右侧应用容器里的三个 Tab：元宝 / 管理成员 / 会议聊天 */
export type MeetingAppTab = "yuanbao" | "members" | "chat";

/** 侧栏开关与当前 Tab；关闭后仍记住上次 Tab，便于从底栏再打开 */
export interface MeetingAppSidebarState {
  open: boolean;
  tab: MeetingAppTab;
}

export type MeetingAppSidebarAction =
  | { type: "toggle"; tab: MeetingAppTab }
  | { type: "select"; tab: MeetingAppTab }
  | { type: "open"; tab: MeetingAppTab }
  | { type: "close" };

export const INITIAL_MEETING_APP_SIDEBAR: MeetingAppSidebarState = {
  open: true,
  tab: "yuanbao",
};

/**
 * 底栏按钮用 toggle：关着则打开到该 Tab；开着且已在该 Tab 则关闭；开着但在别的 Tab 则只切换。
 * 顶栏图标用 select：只切换并保持打开，不关闭。
 */
export function reduceMeetingAppSidebar(
  state: MeetingAppSidebarState,
  action: MeetingAppSidebarAction,
): MeetingAppSidebarState {
  switch (action.type) {
    case "close":
      return { open: false, tab: state.tab };
    case "open":
    case "select":
      return { open: true, tab: action.tab };
    case "toggle":
      if (!state.open) {
        return { open: true, tab: action.tab };
      }
      if (state.tab === action.tab) {
        return { open: false, tab: state.tab };
      }
      return { open: true, tab: action.tab };
    default:
      return state;
  }
}
