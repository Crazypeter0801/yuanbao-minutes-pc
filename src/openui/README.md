# Yuanbao OpenUI (Intelligent UI)

Minimal OpenUI Lang integration for the Agent main chat.

## Packages

- `@openuidev/react-lang` — `defineComponent` / `createLibrary` / `Renderer`
- `zod` — component prop schemas (`import { z } from "zod/v4"`)

## How it renders

1. Assistant messages may set `openui` to an OpenUI Lang program string.
2. `AssistantMessageView` prefers `openui` over hard-coded `bubbles`.
3. `OpenUIBlock` mounts `<Renderer library={yuanbaoOpenuiLibrary} … />`.

## Author a new generative block

1. Prefer existing atoms in `yuanbaoLibrary.tsx`: `Stack`, `Text`, `Heading`, `BulletList`, `Bullet`, `Fact`, `Callout`.
2. Add a new atom only when the model needs a new shape — keep schemas flat; register it on `Stack.children`.
3. Write OpenUI Lang (demo or model output), e.g.:

```text
root = Stack([title, row])
title = Heading("标题")
row = Fact("立昌", "两版初稿")
```

4. Attach it to a message:

```ts
reply([], { openui: YOUR_PROGRAM, followUps: ['…'] })
```

5. Optional: `buildYuanbaoOpenuiPrompt()` for the system prompt you send the model.

## Demo cases in the app

| Trigger | Program |
| --- | --- |
| Initial summary after「总结刚刚发生的事情」 | `OPENUI_MEETING_SUMMARY` |
| Ask / follow-up「列出我的待办」 | `OPENUI_TODO_BOARD` |
