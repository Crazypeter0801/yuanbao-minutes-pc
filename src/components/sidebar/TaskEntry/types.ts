export type CommandBarVariant = 'agent-status-sprite' | 'agent-status-dots' | 'capsules';

export const isAgentStatusVariant = (variant: CommandBarVariant): boolean =>
  variant === 'agent-status-sprite' || variant === 'agent-status-dots';
