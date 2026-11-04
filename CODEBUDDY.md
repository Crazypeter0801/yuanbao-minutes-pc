# CODEBUDDY.md — 本工程编码约定

## 通用

- TypeScript strict，禁止 `any`（确实需要时用 `unknown` + 类型收窄）。
- 组件一律函数组件 + Hooks；`Named Export` 用于组件，`Default Export` 仅用于页面 / SVGR 图标。
- 每个组件一个目录：`index.tsx` + `index.module.scss`，同目录同名。
- 目录 kebab-case，组件名 PascalCase，样式类名 camelCase。
- 公共注释用中文 JSDoc；复杂逻辑写「为什么」，不复述「做了什么」。

## 样式

- 只允许通过 `var(--wm-color-*)` / `var(--wm-shadow-*)` 使用颜色与阴影，禁止在 `*.module.scss` 里写死 HEX / rgb。
  新增颜色先加到 `src/styles/tokens.scss`。
- 禁止 CSS `gap`（旧版 WebKit 不支持），间距用相邻兄弟选择器：
  ```scss
  .row > * + * {
    margin-left: 8px;
  }
  ```
- `font-size` 用 px；`line-height` 必须写 px，禁止无单位比例值。
- 文字截断：单行 `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`（flex 子项需 `min-width: 0`）；
  多行用 `-webkit-line-clamp`。
- 隐藏滚动条保留滚动能力：`overflow: auto` + `scrollbar-width: none` + `::-webkit-scrollbar { display: none; }`
  （工程内已提供全局类 `wm-scroll-hidden`）。
- 渐变终点禁止 `transparent`，用 `rgba(r, g, b, 0)`。

## 组件

- 禁止使用原生 `<button>`（默认样式难清除），统一用 `components/common/Pressable`。
- 图片一律 `import` 后使用，禁止字符串相对路径；SVG 图标用 SVGR 组件（`src/assets/d2c/icons`）。
- 纯图标按钮必须提供 `ariaLabel`；装饰性元素加 `aria-hidden`。
- 交互状态不放组件内，统一由 `useMinutesPanel` 管理；组件只渲染 props。

## 资源

- `src/assets/d2c/` 由 D2C 脚本生成，不手工编辑；需要调整请改设计稿后重新导出。
- 该目录不参与 ESLint（`.eslintrc.cjs` 已忽略）。
