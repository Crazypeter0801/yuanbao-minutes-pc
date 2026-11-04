/** 方案变体（同一方案下的局部差异，如底栏样式） */
export interface SchemeVariant {
  key: string;
  label: string;
}

/** 每个方案侧栏的公共入参 */
export interface SchemeSidebarProps {
  /** 关闭侧栏（由 SchemeWindow 管理开合） */
  onClose: () => void;
  /** 当前变体 key；方案没有变体时为 undefined */
  variant?: string;
}
