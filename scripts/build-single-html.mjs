/**
 * 把 dist 打成一个自包含的单文件 HTML（图、CSS、JS 全部内联）
 *
 * 为什么要单文件：导入 Figma 的插件（html.to.design / Codia 之类）要么给 URL，
 * 要么直接上传 HTML；dist 原样给出去的话，外部资源路径会丢，页面只剩骨架。
 * 内联后用 file:// 双击也能打开，拖进插件也只有一个文件。
 *
 * 用法：npm run build:single（内部先 vite build 再跑本脚本）
 * 产物：figma-import/index.html
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distDir = join(root, 'dist');
const outDir = join(root, 'figma-import');

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

/** 所有构建产物里的静态资源 → data URI，键是 /assets/xxx 形式的路径 */
function collectAssets() {
  const assetsDir = join(distDir, 'assets');
  const map = new Map();
  for (const name of readdirSync(assetsDir)) {
    const mime = MIME[extname(name).toLowerCase()];
    if (!mime) {
      continue;
    }
    const base64 = readFileSync(join(assetsDir, name)).toString('base64');
    map.set(`/assets/${name}`, `data:${mime};base64,${base64}`);
  }
  return map;
}

/** 按路径长度倒序替换，避免 a.png 抢在 a@2x.png 之前命中 */
function inlineAssets(text, assets) {
  let output = text;
  for (const [path, dataUri] of [...assets.entries()].sort((a, b) => b[0].length - a[0].length)) {
    output = output.split(path).join(dataUri);
  }
  return output;
}

const assets = collectAssets();
let html = readFileSync(join(distDir, 'index.html'), 'utf8');

// <script type="module" crossorigin src="/assets/index-xxx.js"></script>
html = html.replace(/<script[^>]*src="\/assets\/([^"]+\.js)"[^>]*><\/script>/g, (_match, name) => {
  const code = readFileSync(join(distDir, 'assets', name), 'utf8');
  // 内联脚本里出现 </script> 会提前闭合，按 HTML 规范拆开写
  const safe = code.split('</script>').join('<\\/script>');
  return `<script type="module">\n${safe}\n</script>`;
});

// <link rel="stylesheet" crossorigin href="/assets/index-xxx.css">
html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="\/assets\/([^"]+\.css)"[^>]*>/g, (_match, name) => {
  const css = readFileSync(join(distDir, 'assets', name), 'utf8');
  return `<style>\n${css}\n</style>`;
});

html = inlineAssets(html, assets);

mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, 'index.html');
writeFileSync(outFile, html);

const size = (Buffer.byteLength(html) / 1024 / 1024).toFixed(1);
console.log(`已生成 ${outFile}（${size} MB，资源全部内联）`);
