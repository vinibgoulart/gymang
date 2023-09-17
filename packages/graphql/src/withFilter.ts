import type { ConnectionArguments } from 'graphql-relay';

type ArgsWithFilter = {
  filters?: Record<string, unknown>;
  [key: string]: any;
} & ConnectionArguments;

export const withFilter = (
  args: ArgsWithFilter,
  filters: Record<string, unknown>,
  filtersPredefined?: Record<string, unknown>,
) => ({
  ...args,
  filters: {
    ...filters,
    ...(args?.filters || {}),
    ...(filtersPredefined || {}),
  },
});
