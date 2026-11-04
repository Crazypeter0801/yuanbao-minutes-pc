import type { ComponentType } from 'react';
import { SchemeA } from '@/components/schemes/SchemeA';
import { SCHEME_A_VARIANTS } from '@/components/schemes/SchemeA/variants';
import { SchemeB } from '@/components/schemes/SchemeB';
import { SchemeC } from '@/components/schemes/SchemeC';
import { SCHEME_C_VARIANTS } from '@/components/schemes/SchemeC/variants';
import type { SchemeSidebarProps, SchemeVariant } from '@/components/schemes/types';
import { SchemeWindow } from '@/components/SchemeWindow';
import styles from './App.module.scss';

interface SchemeConfig {
  name: string;
  description: string;
  sidebar: ComponentType<SchemeSidebarProps>;
  variants?: SchemeVariant[];
}

/**
 * 方案清单
 * A / B 按 Figma 还原；C 暂无设计稿，按 Granola 的「对话为主、笔记可拉出」思路自行设计。
 * 增删方案只需改这里。
 */
const SCHEMES: SchemeConfig[] = [
  {
    name: '方案 A',
    description: '纪要与问答混排在同一条时间流',
    sidebar: SchemeA,
    variants: SCHEME_A_VARIANTS,
  },
  { name: '方案 B', description: '元宝纪要为主，问元宝独立 Tab', sidebar: SchemeB },
  {
    name: '方案 C',
    description: '问答为主，纪要按需展开（无稿，参考 Granola）',
    sidebar: SchemeC,
    variants: SCHEME_C_VARIANTS,
  },
];

/**
 * 页面根组件
 * 壁纸固定铺满视口，方案窗口纵向排列，上下滚动时只有内容移动。
 */
export default function App() {
  return (
    <div className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <main className={styles.list}>
        {SCHEMES.map((scheme) => (
          <SchemeWindow
            key={scheme.name}
            name={scheme.name}
            description={scheme.description}
            sidebar={scheme.sidebar}
            variants={scheme.variants}
          />
        ))}
      </main>
    </div>
  );
}
