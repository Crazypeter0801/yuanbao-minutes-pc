/**
 * 生成 Figma Code Layers 的导入包
 *
 * Code Layers 的「Upload a local folder」吃的是**源码工程**（它会自己 install + build + run），
 * 不是构建产物。要求：Web 应用、有入口、有 build 脚本、本地文件夹 ≤ 100 MB。
 * 所以这里复制一份精简源码，剔掉 node_modules / dist / .git 这些既超限又没用的东西。
 *
 * 另外把 vite / sass 这些构建期依赖挪进 dependencies：
 * Code Layers 的云端环境如果只装生产依赖，放在 devDependencies 里会直接构建失败。
 * build 脚本也从 `tsc -b && vite build` 改成 `vite build`——类型检查在本地做，
 * 云端不必为了它再装一整套 typescript。
 *
 * 用法：npm run pack:code-layer
 * 产物：code-layer-bundle/（上传这个文件夹）、code-layer-bundle.zip
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outDir = join(root, 'code-layer-bundle');

/** 只带构建和运行真正需要的东西 */
const COPY = ['index.html', 'src', 'vite.config.ts', 'tsconfig.json'];

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const bundlePkg = {
  name: `${pkg.name}-code-layer`,
  private: true,
  version: pkg.version,
  type: 'module',
  description: '腾讯会议 PC · 元宝对话区（Figma Code Layers 导入包，1600×920）',
  scripts: {
    dev: 'vite',
    start: 'vite',
    build: 'vite build',
    preview: 'vite preview',
  },
  dependencies: {
    ...pkg.dependencies,
    vite: pkg.devDependencies.vite,
    '@vitejs/plugin-react': pkg.devDependencies['@vitejs/plugin-react'],
    sass: pkg.devDependencies.sass,
  },
};

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const item of COPY) {
  const from = join(root, item);
  if (!existsSync(from)) {
    throw new Error(`缺少必需文件：${item}`);
  }
  cpSync(from, join(outDir, item), { recursive: true });
}

writeFileSync(join(outDir, 'package.json'), `${JSON.stringify(bundlePkg, null, 2)}\n`);

writeFileSync(
  join(outDir, 'README.md'),
  `# 元宝对话区 · Figma Code Layers 导入包

## 怎么导入
1. Figma Design 文件里按 \`B\`（或工具栏选 Code）画一个 **1600 × 920** 的 code layer
2. 在弹出的面板里选 **Upload a local folder**，选中本目录
3. 等它安装依赖并构建完成，即可 Play

## 尺寸
页面最小 1600×920：Tahoe 壁纸铺满，1440×760 窗口居中，演示按钮浮在窗口下方。画 code layer 时不小于这个尺寸，内容不会被裁切。

## 演示触发词（在输入框里打字）
| 输入 | 效果 |
| --- | --- |
| 刚入会 / 入会 | 元宝主动问要不要补前 5 分钟内容 |
| 别人提到 / 提到 | 元宝找出「两版视觉探索」的会上结论 |
| 会议将结束 / 快结束 | 元宝问要不要按原班人再约一次 |
| 建个投票 / 投票 | 用户发任务 + 元宝回话 + 投票确认弹窗 |
| 其他任意文字 | 走普通问答规则表 |
`,
);

/** 顺手校验一次能否构建：借用主工程的 node_modules，不额外装包 */
const linkPath = join(outDir, 'node_modules');
execFileSync('ln', ['-s', join(root, 'node_modules'), linkPath]);
try {
  execFileSync('npx', ['vite', 'build'], { cwd: outDir, stdio: 'pipe' });
  console.log('构建校验通过');
} finally {
  rmSync(linkPath, { force: true });
  rmSync(join(outDir, 'dist'), { recursive: true, force: true });
  rmSync(join(outDir, 'tsconfig.tsbuildinfo'), { force: true });
}

/** 打成 zip，方便直接拖给 Figma / 发给同事 */
execFileSync('zip', ['-r', '-q', 'code-layer-bundle.zip', 'code-layer-bundle', '-x', '*.DS_Store'], { cwd: root });

const size = execFileSync('du', ['-sh', outDir], { encoding: 'utf8' }).split('\t')[0];
console.log(`已生成 ${outDir}（${size}）与 code-layer-bundle.zip`);
