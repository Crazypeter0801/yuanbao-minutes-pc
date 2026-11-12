import type { ComponentType, FC } from 'react';
import IconAdd from '@/assets/d2c/icons/whiteboard/icon-add';
import IconAiPen from '@/assets/d2c/icons/whiteboard/icon-ai-pen';
import IconCollapse from '@/assets/d2c/icons/whiteboard/icon-collapse';
import IconEraser from '@/assets/d2c/icons/whiteboard/icon-eraser';
import IconLaser from '@/assets/d2c/icons/whiteboard/icon-laser';
import IconRedo from '@/assets/d2c/icons/whiteboard/icon-redo';
import IconSave from '@/assets/d2c/icons/whiteboard/icon-save';
import IconSelect from '@/assets/d2c/icons/whiteboard/icon-select';
import IconShape from '@/assets/d2c/icons/whiteboard/icon-shape';
import IconText from '@/assets/d2c/icons/whiteboard/icon-text';
import IconUndo from '@/assets/d2c/icons/whiteboard/icon-undo';
import type { BoardToolbarTool } from '@/data/whiteboardScenario';
import styles from './index.module.scss';

interface ToolItem {
  tool: BoardToolbarTool;
  label: string;
  Icon: ComponentType<{ className?: string; color?: string }>;
  /** 设计稿里撤销 / 重做为禁用灰 */
  disabled?: boolean;
}

/** 顺序与 Figma「白板工具栏｜主体」一致（Figma 221:30127） */
const TOOLS: ToolItem[] = [
  { tool: 'select', label: '选择', Icon: IconSelect },
  { tool: 'ai-pen', label: 'AI 画笔', Icon: IconAiPen },
  { tool: 'laser', label: '激光笔', Icon: IconLaser },
  { tool: 'shape', label: '形状', Icon: IconShape },
  { tool: 'text', label: '文本', Icon: IconText },
  { tool: 'eraser', label: '橡皮擦', Icon: IconEraser },
  { tool: 'undo', label: '撤销', Icon: IconUndo, disabled: true },
  { tool: 'redo', label: '重做', Icon: IconRedo, disabled: true },
  { tool: 'save', label: '保存', Icon: IconSave },
  { tool: 'add', label: '添加', Icon: IconAdd },
];

interface WhiteboardToolbarProps {
  activeTool: BoardToolbarTool | null;
  /** 鼠标正按下的那个按钮 */
  pressedTool: BoardToolbarTool | null;
}

/**
 * 白板工具栏（Figma 221:30127）
 * 左侧竖排胶囊：10 个 28×28 按钮，右侧中部凸出一个收起把手。
 * 元宝 AI 鼠标点选的就是这里真实的按钮：被选中的按钮高亮，按下的那一下会收缩。
 */
export const WhiteboardToolbar: FC<WhiteboardToolbarProps> = ({ activeTool, pressedTool }) => (
  <div className={styles.wrapper}>
    <div className={styles.panel}>
      {TOOLS.map(({ tool, label, Icon, disabled }) => (
        <span
          key={tool}
          className={`${styles.tool} ${disabled ? styles.toolDisabled : ''} ${
            activeTool === tool ? styles.toolActive : ''
          } ${pressedTool === tool ? styles.toolPressed : ''}`}
          data-tool={tool}
          aria-label={label}
        >
          {/* currentColor：选中 / 按下态由 CSS 改色 */}
          <Icon color="currentColor" />
        </span>
      ))}
    </div>
    {/* 收起把手：设计稿里凸在胶囊右侧中部，装饰用 */}
    <span className={styles.collapse} aria-hidden="true">
      <IconCollapse color="currentColor" />
    </span>
  </div>
);
