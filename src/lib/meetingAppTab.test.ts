import {
  INITIAL_MEETING_APP_SIDEBAR,
  reduceMeetingAppSidebar,
  type MeetingAppSidebarState,
} from "./meetingAppTab.ts";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function eq(actual: MeetingAppSidebarState, expected: MeetingAppSidebarState, label: string) {
  assert(actual.open === expected.open && actual.tab === expected.tab, `${label}: ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`);
}

const initial = INITIAL_MEETING_APP_SIDEBAR;
eq(reduceMeetingAppSidebar(initial, { type: "toggle", tab: "yuanbao" }), { open: false, tab: "yuanbao" }, "toggle current yuanbao closes");
eq(reduceMeetingAppSidebar(initial, { type: "toggle", tab: "members" }), { open: true, tab: "members" }, "toggle members switches");
eq(reduceMeetingAppSidebar(initial, { type: "toggle", tab: "chat" }), { open: true, tab: "chat" }, "toggle chat switches");
eq(reduceMeetingAppSidebar({ open: false, tab: "members" }, { type: "toggle", tab: "chat" }), { open: true, tab: "chat" }, "closed toggle opens target");
eq(reduceMeetingAppSidebar({ open: true, tab: "chat" }, { type: "toggle", tab: "chat" }), { open: false, tab: "chat" }, "toggle same chat closes and remembers tab");
eq(reduceMeetingAppSidebar({ open: true, tab: "members" }, { type: "select", tab: "yuanbao" }), { open: true, tab: "yuanbao" }, "header select never closes");
eq(reduceMeetingAppSidebar({ open: true, tab: "chat" }, { type: "close" }), { open: false, tab: "chat" }, "close keeps last tab");
eq(reduceMeetingAppSidebar({ open: false, tab: "chat" }, { type: "open", tab: "members" }), { open: true, tab: "members" }, "open sets tab");

console.log("meetingAppTab tests passed");
