export const FILTER_CONDITION_TYPE = {
  // something that could be used on find() or $match
  MATCH_1_TO_1: 'MATCH_1_TO_1',
  CUSTOM_CONDITION: 'CUSTOM_CONDITION', // create a custom condition based on value
  AGGREGATE_PIPELINE: 'AGGREGATE_PIPELINE',
};
export type BuildedConditionSet = {
  conditions: Record<string, unknown>;
  pipeline: Record<string, unknown>[];
};
export type FilterFieldMappingMatch<TContext, TValue> = {
  type: typeof FILTER_CONDITION_TYPE.MATCH_1_TO_1;
  key: string;
  format?: (
    value: TValue,
    filter: Record<string, unknown>,
    context: TContext,
  ) => any;
};
export type FilterFieldMappingPipeline<TContext, TValue> = {
  type: typeof FILTER_CONDITION_TYPE.AGGREGATE_PIPELINE;
  pipeline:
    | Record<string, unknown>[]
    | ((
        value: TValue,
        filter: Record<string, unknown>,
        context: TContext,
      ) => any[]);
};
export type FilterFieldMappingCustomCondition<TContext, TValue> = {
  type: typeof FILTER_CONDITION_TYPE.CUSTOM_CONDITION;
  format: (
    value: TValue,
    filter: Record<string, unknown>,
    context: TContext,
  ) => any;
};
export type FilterFieldMapping<TContext, TValue> =
  | FilterFieldMappingMatch<TContext, TValue>
  | FilterFieldMappingPipeline<TContext, TValue>
  | FilterFieldMappingCustomCondition<TContext, TValue>
  | boolean;
export type FilterMapping<TContext, TValue> = {
  [key: string]: FilterFieldMapping<TContext, TValue>;
};
