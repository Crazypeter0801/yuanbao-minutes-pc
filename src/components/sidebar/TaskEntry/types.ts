export type CommandBarVariant =
  | 'agent-status-sprite'
  | 'agent-status-dots'
  | 'top-activity'
  | 'capsules';

export const isAgentStatusVariant = (variant: CommandBarVariant): boolean =>
  variant === 'agent-status-sprite' || variant === 'agent-status-dots';

export const isTopActivityVariant = (variant: CommandBarVariant): boolean =>
  variant === 'top-activity';
